import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { applyCommand, buildSnapshot, createSession } from "./engine-xp";
import { createAndStoreSession, resetPlayStoreForTests, runCommand } from "./store";

function travelTo(session: ReturnType<typeof createSession>, roomId: string) {
  let outcome = applyCommand(session, `enter ${roomId}`);
  for (let index = 0; index < 8 && outcome.snapshot.currentRoom.id !== roomId; index += 1) {
    outcome = applyCommand(session, `enter ${roomId}`);
  }
  return outcome;
}

test("a new session starts at the desk with the network visible", () => {
  const session = createSession("session-test-1");
  const snapshot = buildSnapshot(session);

  assert.equal(snapshot.title, "XP Desk");
  assert.equal(snapshot.currentRoom.id, "desk");
  assert.ok(snapshot.rooms.some((room) => room.id === "phonebook"));
  assert.ok(snapshot.hosts.some((host) => host.id === "bbs"));
  assert.ok(snapshot.files.length > 0);

  const desktopAlias = applyCommand(session, "enter desktop");
  assert.equal(desktopAlias.snapshot.currentRoom.id, "desk");
});

test("phonebook and protocol hops expose the host graph", () => {
  const session = createSession("session-test-2");

  applyCommand(session, "pager off");
  const phonebook = applyCommand(session, "phonebook");
  assert.match(phonebook.reply.join("\n"), /Phonebook/);
  assert.match(phonebook.reply.join("\n"), /bbs/);
  assert.match(phonebook.reply.join("\n"), /games/);
  assert.match(phonebook.reply.join("\n"), /lab/);

  const telnet = applyCommand(session, "telnet");
  assert.equal(telnet.snapshot.currentRoom.id, "phonebook");
  assert.match(telnet.reply.join("\n"), /Route recorded to BBS/);

  const telnetHop = applyCommand(session, "telnet");
  assert.equal(telnetHop.snapshot.currentRoom.id, "bbs");
  assert.match(telnetHop.reply.join("\n"), /BBS/);

  const trace = applyCommand(session, "trace relay");
  assert.match(trace.reply.join("\n"), /Route to Relay/);
});

test("non-adjacent moves advance one visible hop and cache routes", () => {
  const session = createSession("session-test-2-routes");

  applyCommand(session, "pager off");
  const firstHop = applyCommand(session, "enter bbs");
  assert.equal(firstHop.snapshot.currentRoom.id, "phonebook");
  assert.match(firstHop.reply.join("\n"), /Route recorded to BBS/);
  assert.ok(firstHop.snapshot.routes.some((route) => route.target === "bbs"));

  const secondHop = applyCommand(session, "enter bbs");
  assert.equal(secondHop.snapshot.currentRoom.id, "bbs");
  assert.match(secondHop.reply.join("\n"), /Moved to BBS/);

  const trace = applyCommand(session, "trace mirror");
  assert.match(trace.reply.join("\n"), /Route to Mirror/);
  assert.ok(trace.snapshot.routes.some((route) => route.target === "mirror"));
});

test("waypoints require proven routes and respect lane locks", () => {
  const session = createSession("session-test-waypoints");

  const denied = applyCommand(session, "mark bbs");
  assert.match(denied.reply.join("\n"), /No proven route to BBS/i);

  applyCommand(session, "pager off");
  applyCommand(session, "enter bbs");
  const marked = applyCommand(session, "mark bbs");
  assert.match(marked.reply.join("\n"), /Marked BBS/);
  assert.equal(marked.snapshot.waypoints.find((waypoint) => waypoint.room === "bbs")?.state, "ready");

  travelTo(session, "archive");
  const jumped = applyCommand(session, "jump bbs");
  assert.equal(jumped.snapshot.currentRoom.id, "bbs");
  assert.match(jumped.reply.join("\n"), /Jumped to BBS/);

  travelTo(session, "archive");
  applyCommand(session, "camp");
  applyCommand(session, "tunnel");
  applyCommand(session, "camp");
  const blocked = applyCommand(session, "jump bbs");
  assert.equal(blocked.snapshot.currentRoom.id, "archive");
  assert.match(blocked.reply.join("\n"), /blocked: current lane locked/i);
});

test("route circuits require proven stops and reduce travel pressure", () => {
  const session = createSession("session-test-circuits");

  applyCommand(session, "pager off");
  const early = applyCommand(session, "map-circuit loop: desk bbs");
  assert.match(early.reply.join("\n"), /Trace BBS/i);

  applyCommand(session, "enter bbs");
  applyCommand(session, "mark bbs");
  applyCommand(session, "trace desk");

  const mapped = applyCommand(session, "map-circuit loop: desk bbs");
  assert.match(mapped.reply.join("\n"), /Mapped loop/i);
  assert.equal(mapped.snapshot.circuits.find((entry) => entry.label === "loop")?.state, "stable");
  assert.ok(mapped.snapshot.mesh.signals.some((signal) => signal.includes("1 stable circuit")));

  applyCommand(session, "camp");
  applyCommand(session, "tunnel");
  const before = buildSnapshot(session).pressure.find((entry) => entry.room === "phonebook")?.level ?? 0;
  const ridden = applyCommand(session, "ride-circuit loop");
  const after = ridden.snapshot.pressure.find((entry) => entry.room === "phonebook")?.level ?? 0;

  assert.equal(ridden.snapshot.currentRoom.id, "bbs");
  assert.match(ridden.reply.join("\n"), /Rode loop to BBS Lobby/i);
  assert.ok(after <= before);
  assert.equal(ridden.snapshot.circuits.find((entry) => entry.label === "loop")?.uses, 1);
});

test("line pressure locks long routes until the lane is braced", () => {
  const session = createSession("session-test-2-pressure");

  applyCommand(session, "pager off");
  applyCommand(session, "enter archive");
  applyCommand(session, "camp");
  applyCommand(session, "tunnel");
  const saturated = applyCommand(session, "camp");

  const archivePressure = saturated.snapshot.pressure.find((entry) => entry.room === "archive");
  assert.equal(archivePressure?.state, "locked");
  assert.equal(archivePressure?.level, 5);

  const denied = applyCommand(session, "enter bbs");
  assert.equal(denied.snapshot.currentRoom.id, "archive");
  assert.match(denied.reply.join("\n"), /saturated/i);

  const braced = applyCommand(session, "brace");
  const bracedPressure = braced.snapshot.pressure.find((entry) => entry.room === "archive");
  assert.equal(bracedPressure?.state, "strained");
  assert.ok((bracedPressure?.graceCommands ?? 0) > 0);

  const move = applyCommand(session, "enter bbs");
  assert.equal(move.snapshot.currentRoom.id, "phonebook");
  assert.match(move.reply.join("\n"), /Advanced one hop/);
});

test("direct adjacent moves still behave as single host changes", () => {
  const session = createSession("session-test-2-direct");

  const archive = applyCommand(session, "enter archive");
  assert.equal(archive.snapshot.currentRoom.id, "archive");
  assert.match(archive.reply.join("\n"), /Moved to Archive/);
});

test("protocol hops expose the host graph", () => {
  const session = createSession("session-test-2-protocols");

  applyCommand(session, "pager off");
  applyCommand(session, "telnet");
  const telnet = applyCommand(session, "telnet");
  assert.equal(telnet.snapshot.currentRoom.id, "bbs");
  assert.match(telnet.reply.join("\n"), /BBS/);

  const trace = applyCommand(session, "trace relay");
  assert.match(trace.reply.join("\n"), /Route to Relay/);
});

test("hidden hosts stay hidden until a wardial sweep reveals them", () => {
  const session = createSession("session-test-2a");

  const snapshot = buildSnapshot(session);
  assert.ok(!snapshot.hosts.some((host) => host.id === "qotd"));
  assert.ok(!snapshot.hosts.some((host) => host.id === "zcode"));
  assert.ok(!snapshot.hosts.some((host) => host.id === "vault"));

  applyCommand(session, "pager off");
  const phonebookBefore = applyCommand(session, "phonebook");
  assert.doesNotMatch(phonebookBefore.reply.join("\n"), /qotd/i);
  assert.doesNotMatch(phonebookBefore.reply.join("\n"), /zcode/i);

  const whoisBefore = applyCommand(session, "whois qotd");
  const traceBefore = applyCommand(session, "trace zcode");
  const wardialDenied = applyCommand(session, "wardial");
  assert.match(whoisBefore.reply.join("\n"), /No record/);
  assert.match(traceBefore.reply.join("\n"), /not in the public map/i);
  assert.match(wardialDenied.reply.join("\n"), /Login first/i);

  applyCommand(session, "login Boden");
  const wardial = applyCommand(session, "wardial");
  assert.match(wardial.reply.join("\n"), /Wardial sweep complete/);
  assert.ok(session.badges.includes("wardial"));

  const phonebookAfter = applyCommand(session, "phonebook");
  assert.match(phonebookAfter.reply.join("\n"), /qotd/i);
  assert.match(phonebookAfter.reply.join("\n"), /zcode/i);

  const qotd = travelTo(session, "qotd");
  assert.equal(qotd.snapshot.currentRoom.id, "qotd");
});

test("back unwinds the current hop stack", () => {
  const session = createSession("session-test-2b");

  applyCommand(session, "enter archive");
  applyCommand(session, "enter phonebook");
  const backOne = applyCommand(session, "back");
  assert.equal(backOne.snapshot.currentRoom.id, "archive");
  assert.match(backOne.reply.join("\n"), /Returned to Archive/);

  const backTwo = applyCommand(session, "back");
  assert.equal(backTwo.snapshot.currentRoom.id, "desk");
});

test("archive history reveals the hidden shell clue and unlocks the vault", () => {
  const session = createSession("session-test-3");

  applyCommand(session, "enter archive");
  const scan = applyCommand(session, "scan");

  assert.ok(session.inventory.includes("luna"));
  assert.match(scan.reply.join("\n"), /Luna/);

  const solve = applyCommand(session, "solve luna");
  assert.equal(solve.snapshot.solved, true);
  assert.equal(solve.snapshot.rooms.find((room) => room.id === "vault")?.unlocked, true);
});

test("notebook records discoveries and supports decode and pin commands", () => {
  const session = createSession("session-test-notebook");

  applyCommand(session, "pager off");
  applyCommand(session, "scan");
  applyCommand(session, "enter archive");
  applyCommand(session, "history");
  applyCommand(session, "cat 2001.NOTE");
  const route = applyCommand(session, "trace bbs");

  assert.ok(route.snapshot.notebook.some((entry) => entry.kind === "room" && entry.room === "desk"));
  assert.ok(route.snapshot.notebook.some((entry) => entry.kind === "history" && entry.source === "2001"));
  assert.ok(route.snapshot.notebook.some((entry) => entry.kind === "file" && entry.source === "2001.NOTE"));
  assert.ok(route.snapshot.notebook.some((entry) => entry.kind === "route" && entry.title.includes("BBS")));

  const notebook = applyCommand(session, "notebook");
  assert.match(notebook.reply.join("\n"), /Notebook entries/);

  const decode = applyCommand(session, "decode 2001.NOTE");
  assert.match(decode.reply.join("\n"), /Blue shell era/);
  assert.equal(decode.snapshot.notebook.find((entry) => entry.source === "2001.NOTE")?.decoded, true);

  const pin = applyCommand(session, "pin 2001.NOTE");
  assert.match(pin.reply.join("\n"), /Pinned Archive/);
  assert.equal(pin.snapshot.notebook[0]?.source, "2001.NOTE");
});

test("file browsing and containment rules behave like a guarded host", () => {
  const session = createSession("session-test-4");

  applyCommand(session, "enter archive");
  applyCommand(session, "scan");

  const ls = applyCommand(session, "ls");
  assert.match(ls.reply.join("\n"), /2001\.NOTE/);

  const cat = applyCommand(session, "cat LUNA.KEY");
  assert.match(cat.reply.join("\n"), /Luna is the old shell name/);

  const camp = applyCommand(session, "camp");
  const tunnel = applyCommand(session, "tunnel");
  assert.match(camp.reply.join("\n"), /Repeat-start pressure is refused/);
  assert.match(tunnel.reply.join("\n"), /Side-channel shortcuts are refused/);
});

test("query verbs and ambient shell extras behave like a lived-in terminal", () => {
  const session = createSession("session-test-5");

  const question = applyCommand(session, "?");
  const login = applyCommand(session, "login Boden");
  const stty = applyCommand(session, "stty /dumb");
  const pager = applyCommand(session, "pager off");
  const netstat = applyCommand(session, "netstat");
  const scores = applyCommand(session, "scores");
  const who = applyCommand(session, "who");
  const time = applyCommand(session, "time");
  const grep = applyCommand(session, "grep archive");
  const finger = applyCommand(session, "finger archive");
  const alias = applyCommand(session, "alias");
  const ver = applyCommand(session, "ver");
  const fortune = applyCommand(session, "fortune");
  const save = applyCommand(session, "save");
  const load = applyCommand(session, "load");

  assert.match(question.reply.join("\n"), /help/);
  assert.match(login.reply.join("\n"), /Logged in as Boden/i);
  assert.match(stty.reply.join("\n"), /dumb/i);
  assert.match(pager.reply.join("\n"), /disabled/i);
  assert.match(netstat.reply.join("\n"), /hosts visible/i);
  assert.match(scores.reply.join("\n"), /badges earned/i);
  assert.match(who.reply.join("\n"), /Active operators/);
  assert.equal(time.reply.length, 2);
  assert.match(grep.reply.join("\n"), /archive/i);
  assert.match(finger.reply.join("\n"), /Archive/);
  assert.match(alias.reply.join("\n"), /Room aliases/);
  assert.match(ver.reply.join("\n"), /XP Desk shell v2/);
  assert.equal(fortune.reply.length, 1);
  assert.match(save.reply.join("\n"), /Session saved/);
  assert.match(load.reply.join("\n"), /Session loaded/);
});

test("pager pauses long outputs and advances on demand", () => {
  const session = createSession("session-test-5b");

  const netstat = applyCommand(session, "netstat");
  assert.match(netstat.reply.join("\n"), /--More--/);
  assert.equal(netstat.snapshot.pagerPending, true);

  const next = applyCommand(session, "space");
  assert.ok(next.reply.length > 0);
  assert.match(next.reply.join("\n"), /Desktop|Archive|Phonebook|BBS/);

  const nextAgain = applyCommand(session, "space");
  assert.match(nextAgain.reply.join("\n"), /Games|Lab|IRC|Relay|Mirror|Sysop|Vault/);
});

test("public boards accept posts and expose readback", () => {
  const session = createSession("session-test-6");

  travelTo(session, "bbs");
  const board = applyCommand(session, "board");
  assert.match(board.reply.join("\n"), /Welcome to the board/);

  const post = applyCommand(session, "post status: the board is alive");
  assert.match(post.reply.join("\n"), /Posted to BBS Lobby/);

  const read = applyCommand(session, "read 3");
  assert.match(read.reply.join("\n"), /the board is alive/);
  assert.ok(read.snapshot.notebook.some((entry) => entry.kind === "message" && entry.source === "status"));
});

test("mailbox commands keep private notes in the inbox", () => {
  const session = createSession("session-test-7");

  travelTo(session, "mail");
  const inbox = applyCommand(session, "inbox");
  assert.match(inbox.reply.join("\n"), /Route check/);

  const send = applyCommand(session, "send sysop update: checking in");
  assert.match(send.reply.join("\n"), /Sent to Sysop Desk/);

  const read = applyCommand(session, "read 3");
  assert.match(read.reply.join("\n"), /checking in/);
});

test("adjacent porthack and root progression tracks host flags", () => {
  const session = createSession("session-test-8");

  applyCommand(session, "login Boden");
  const fail = applyCommand(session, "porthack vault");
  assert.match(fail.reply.join("\n"), /not adjacent/i);

  const porthack = applyCommand(session, "porthack phonebook");
  assert.match(porthack.reply.join("\n"), /Login created on Phonebook/);

  applyCommand(session, "enter phonebook");
  const root = applyCommand(session, "root");
  assert.match(root.reply.join("\n"), /Phonebook is now rooted/i);

  applyCommand(session, "pager off");
  const netstat = applyCommand(session, "netstat");
  assert.match(netstat.reply.join("\n"), /\*  Phonebook/);
  assert.equal(buildSnapshot(session).hosts.find((host) => host.id === "phonebook")?.state, "rooted");
});

test("queued operations complete host control across command ticks", () => {
  const session = createSession("session-test-ops");

  applyCommand(session, "login Boden");
  const queuedLogin = applyCommand(session, "op porthack phonebook");
  assert.match(queuedLogin.reply.join("\n"), /Queued porthack Phonebook/);
  assert.equal(queuedLogin.snapshot.operations[0]?.status, "running");
  assert.ok(!session.loginHosts.includes("phonebook"));

  applyCommand(session, "jobs");
  const completedLogin = applyCommand(session, "jobs");
  assert.match(completedLogin.reply.join("\n"), /login created on Phonebook/i);
  assert.ok(session.loginHosts.includes("phonebook"));

  applyCommand(session, "enter phonebook");
  const queuedRoot = applyCommand(session, "op root");
  assert.match(queuedRoot.reply.join("\n"), /Queued root Phonebook/);
  applyCommand(session, "jobs");
  const completedRoot = applyCommand(session, "jobs");
  assert.match(completedRoot.reply.join("\n"), /Phonebook rooted/i);
  assert.ok(session.rootedRooms.includes("phonebook"));

  for (const action of ["audit", "patch", "firewall", "snapshot"] as const) {
    const queued = applyCommand(session, `op ${action}`);
    assert.match(queued.reply.join("\n"), new RegExp(`Queued ${action} Phonebook`, "i"));
    const completed = applyCommand(session, "jobs");
    assert.match(completed.reply.join("\n"), new RegExp(`Phonebook .*${action === "firewall" ? "firewall" : action}`, "i"));
  }

  const queuedSeal = applyCommand(session, "op secure");
  assert.match(queuedSeal.reply.join("\n"), /Queued secure Phonebook/);
  applyCommand(session, "jobs");
  const completedSeal = applyCommand(session, "jobs");
  assert.match(completedSeal.reply.join("\n"), /Phonebook sealed/i);
  assert.ok(session.securedRooms.includes("phonebook"));
});

test("hosts require audit, patch, firewall, and snapshot before sealing", () => {
  const session = createSession("session-test-8-hardening");

  applyCommand(session, "login Boden");
  applyCommand(session, "porthack phonebook");
  applyCommand(session, "enter phonebook");

  const earlySecure = applyCommand(session, "secure");
  assert.match(earlySecure.reply.join("\n"), /Root the current host/i);

  applyCommand(session, "root");
  const afterRoot = buildSnapshot(session).hosts.find((host) => host.id === "phonebook");
  assert.equal(afterRoot?.state, "rooted");
  assert.equal(afterRoot?.hardeningState, "rooted");

  const needsAudit = applyCommand(session, "secure");
  assert.match(needsAudit.reply.join("\n"), /Audit the host/i);

  const audit = applyCommand(session, "audit");
  assert.match(audit.reply.join("\n"), /audit complete/i);
  assert.equal(buildSnapshot(session).hosts.find((host) => host.id === "phonebook")?.hardeningState, "audited");

  const patch = applyCommand(session, "patch");
  assert.match(patch.reply.join("\n"), /patch set applied/i);

  const firewall = applyCommand(session, "firewall");
  assert.match(firewall.reply.join("\n"), /firewall rules loaded/i);

  const snapshot = applyCommand(session, "snapshot");
  assert.match(snapshot.reply.join("\n"), /snapshot written/i);
  assert.equal(snapshot.snapshot.hosts.find((host) => host.id === "phonebook")?.hardeningScore, 4);

  const secure = applyCommand(session, "secure");
  assert.match(secure.reply.join("\n"), /Phonebook is sealed/);
  const sealed = secure.snapshot.hosts.find((host) => host.id === "phonebook");
  assert.equal(sealed?.state, "secured");
  assert.equal(sealed?.hardeningState, "sealed");
});

test("sealed hosts can hold synced copies", () => {
  const session = createSession("session-test-replicas");

  const submitBeforeAccept = applyCommand(session, "submit warm-copy");
  assert.match(submitBeforeAccept.reply.join("\n"), /Accept warm-copy/i);

  applyCommand(session, "enter archive");
  const denied = applyCommand(session, "deploy");
  assert.match(denied.reply.join("\n"), /needs a sealed lane/i);

  applyCommand(session, "back");
  const deskCopy = applyCommand(session, "deploy");
  assert.match(deskCopy.reply.join("\n"), /Seeded Desktop/i);
  assert.equal(deskCopy.snapshot.replicas.find((replica) => replica.room === "desk")?.level, 2);

  applyCommand(session, "login Boden");
  applyCommand(session, "porthack phonebook");
  applyCommand(session, "enter phonebook");
  applyCommand(session, "root");
  applyCommand(session, "audit");
  applyCommand(session, "patch");
  applyCommand(session, "firewall");
  applyCommand(session, "snapshot");
  applyCommand(session, "secure");

  const seeded = applyCommand(session, "deploy");
  const phonebookReplica = seeded.snapshot.replicas.find((replica) => replica.room === "phonebook");
  assert.match(seeded.reply.join("\n"), /Seeded Phonebook/);
  assert.equal(phonebookReplica?.state, "warm");

  const before = phonebookReplica?.integrity ?? 0;
  applyCommand(session, "scan");
  const synced = applyCommand(session, "sync");
  const after = synced.snapshot.replicas.find((replica) => replica.room === "phonebook");

  assert.match(synced.reply.join("\n"), /Phonebook sync complete/);
  assert.ok((after?.integrity ?? 0) > before);
  assert.match(applyCommand(session, "replicas").reply.join("\n"), /Copies: 2/);
  assert.equal(buildSnapshot(session).replicas.length, 2);

  const accepted = applyCommand(session, "accept warm-copy");
  assert.match(accepted.reply.join("\n"), /Accepted Warm Copy/);
  const submitted = applyCommand(session, "submit warm-copy");
  assert.match(submitted.reply.join("\n"), /Warm Copy complete/);
  assert.ok(submitted.snapshot.rooms.find((room) => room.id === "zcode")?.unlocked);
  assert.equal(submitted.snapshot.briefs.find((brief) => brief.id === "warm-copy")?.status, "complete");
});

test("mesh stabilization requires sealed hosts, warm copies, briefs, and waypoints", () => {
  const session = createSession("session-test-mesh");

  applyCommand(session, "pager off");
  const fresh = applyCommand(session, "mesh");
  assert.equal(fresh.snapshot.mesh.tier, "fragile");
  assert.match(fresh.reply.join("\n"), /seal another host/i);

  const early = applyCommand(session, "stabilize");
  assert.equal(early.snapshot.mesh.stabilized, false);
  assert.match(early.reply.join("\n"), /seal another host/i);

  applyCommand(session, "login Boden");
  applyCommand(session, "porthack phonebook");
  applyCommand(session, "enter phonebook");
  applyCommand(session, "trace bbs");
  const marked = applyCommand(session, "mark bbs");
  assert.equal(marked.snapshot.waypoints.find((waypoint) => waypoint.room === "bbs")?.state, "ready");

  applyCommand(session, "root");
  applyCommand(session, "audit");
  applyCommand(session, "patch");
  applyCommand(session, "firewall");
  applyCommand(session, "snapshot");
  applyCommand(session, "secure");
  applyCommand(session, "deploy");
  applyCommand(session, "scan");
  applyCommand(session, "sync");
  applyCommand(session, "accept warm-copy");
  applyCommand(session, "submit warm-copy");

  const ready = applyCommand(session, "mesh");
  assert.equal(ready.snapshot.mesh.blockers.length, 0);
  assert.ok(ready.snapshot.mesh.score >= 70);

  const stabilized = applyCommand(session, "stabilize");
  assert.equal(stabilized.snapshot.mesh.stabilized, true);
  assert.ok(stabilized.snapshot.badges.includes("mesh:stable"));
  assert.match(stabilized.reply.join("\n"), /Mesh stabilized/i);
});

test("warm sealed hosts can form and rekey trust links", () => {
  const session = createSession("session-test-links");

  applyCommand(session, "pager off");
  const early = applyCommand(session, "link phonebook");
  assert.match(early.reply.join("\n"), /Phonebook is not sealed/i);

  applyCommand(session, "deploy");
  applyCommand(session, "scan");
  applyCommand(session, "sync");
  applyCommand(session, "sync");

  applyCommand(session, "login Boden");
  applyCommand(session, "porthack phonebook");
  applyCommand(session, "enter phonebook");
  applyCommand(session, "root");
  applyCommand(session, "audit");
  applyCommand(session, "patch");
  applyCommand(session, "firewall");
  applyCommand(session, "snapshot");
  applyCommand(session, "secure");
  applyCommand(session, "deploy");
  applyCommand(session, "scan");
  applyCommand(session, "sync");
  applyCommand(session, "trace desk");
  applyCommand(session, "maintain desk");
  applyCommand(session, "maintain desk");
  applyCommand(session, "rotate desk");

  const linked = applyCommand(session, "link desk");
  assert.match(linked.reply.join("\n"), /Linked Phonebook <-> Desktop/i);
  assert.equal(linked.snapshot.trustLinks.length, 1);
  assert.equal(linked.snapshot.trustLinks[0]?.state, "handshake");

  const links = applyCommand(session, "links");
  assert.match(links.reply.join("\n"), /Desktop <-> Phonebook/);

  const rekeyed = applyCommand(session, "rekey desk");
  assert.match(rekeyed.reply.join("\n"), /Rekeyed Desktop <-> Phonebook|Rekeyed Phonebook <-> Desktop/i);
  assert.equal(rekeyed.snapshot.trustLinks[0]?.state, "trusted");
  assert.ok(rekeyed.snapshot.mesh.signals.some((signal) => signal.includes("1 trusted link")));
});

test("warm sealed hosts can install and repair native services", () => {
  const session = createSession("session-test-services");

  applyCommand(session, "pager off");
  const blocked = applyCommand(session, "install");
  assert.match(blocked.reply.join("\n"), /Desktop copy is not warm/i);

  applyCommand(session, "deploy");
  applyCommand(session, "scan");
  applyCommand(session, "sync");
  applyCommand(session, "sync");

  const installed = applyCommand(session, "install");
  assert.match(installed.reply.join("\n"), /Installed Desktop console/i);
  assert.equal(installed.snapshot.services.find((service) => service.room === "desk")?.state, "online");
  assert.ok(installed.snapshot.mesh.signals.some((signal) => signal.includes("1 online service")));

  const listed = applyCommand(session, "services");
  assert.match(listed.reply.join("\n"), /Desktop console/);

  for (let index = 0; index < 12; index += 1) {
    applyCommand(session, "time");
  }
  applyCommand(session, "maintain desk");
  applyCommand(session, "maintain desk");

  const beforeRepair = buildSnapshot(session).services.find((service) => service.room === "desk")?.health ?? 100;
  const repaired = applyCommand(session, "repair-service desk");
  assert.match(repaired.reply.join("\n"), /Repaired Desktop console/i);
  assert.ok((repaired.snapshot.services.find((service) => service.room === "desk")?.health ?? 0) > beforeRepair);
});

test("online host services can compile bounded upkeep runbooks", () => {
  const session = createSession("session-test-runbooks");

  applyCommand(session, "pager off");
  const blocked = applyCommand(session, "compile");
  assert.match(blocked.reply.join("\n"), /Install Desktop's service/i);

  applyCommand(session, "deploy");
  applyCommand(session, "scan");
  applyCommand(session, "sync");
  applyCommand(session, "sync");
  applyCommand(session, "install");

  const compiled = applyCommand(session, "compile");
  assert.match(compiled.reply.join("\n"), /Compiled Desktop upkeep/i);
  assert.equal(compiled.snapshot.runbooks.find((runbook) => runbook.room === "desk")?.state, "ready");
  assert.ok(compiled.snapshot.mesh.signals.some((signal) => signal.includes("1 ready runbook")));

  for (let index = 0; index < 10; index += 1) {
    applyCommand(session, "time");
  }

  const before = buildSnapshot(session);
  const beforeIntegrity = before.replicas.find((replica) => replica.room === "desk")?.integrity ?? 0;
  const beforeHealth = before.services.find((service) => service.room === "desk")?.health ?? 0;
  const run = applyCommand(session, "runbook desk");

  assert.match(run.reply.join("\n"), /Running Desktop upkeep/i);
  assert.equal(run.snapshot.runbooks.find((runbook) => runbook.room === "desk")?.runs, 1);
  assert.ok((run.snapshot.replicas.find((replica) => replica.room === "desk")?.integrity ?? 0) > beforeIntegrity);
  assert.ok((run.snapshot.services.find((service) => service.room === "desk")?.health ?? 0) > beforeHealth);
});

test("controlled graph sectors can be claimed and swept", () => {
  const session = createSession("session-test-sectors");

  applyCommand(session, "pager off");
  const blocked = applyCommand(session, "claim-sector foyer");
  assert.match(blocked.reply.join("\n"), /not ready/i);

  applyCommand(session, "deploy");
  applyCommand(session, "scan");
  applyCommand(session, "sync");
  applyCommand(session, "sync");
  applyCommand(session, "install");
  applyCommand(session, "compile");
  applyCommand(session, "login Boden");
  applyCommand(session, "porthack phonebook");
  applyCommand(session, "enter phonebook");
  applyCommand(session, "root");
  applyCommand(session, "audit");
  applyCommand(session, "patch");
  applyCommand(session, "firewall");
  applyCommand(session, "snapshot");
  applyCommand(session, "secure");

  const ready = applyCommand(session, "sectors");
  assert.match(ready.reply.join("\n"), /foyer .* ready/i);

  const claimed = applyCommand(session, "claim-sector foyer");
  assert.match(claimed.reply.join("\n"), /Claimed Foyer Loop/i);
  assert.equal(claimed.snapshot.sectors.find((sector) => sector.id === "foyer")?.state, "claimed");
  assert.ok(claimed.snapshot.mesh.signals.some((signal) => signal.includes("1 claimed sector")));

  applyCommand(session, "back");
  for (let index = 0; index < 8; index += 1) {
    applyCommand(session, "time");
  }
  const before = buildSnapshot(session).replicas.find((replica) => replica.room === "desk")?.integrity ?? 0;
  const swept = applyCommand(session, "sweep-sector foyer");

  assert.match(swept.reply.join("\n"), /Sweeping Foyer Loop/i);
  assert.equal(swept.snapshot.sectors.find((sector) => sector.id === "foyer")?.sweeps, 1);
  assert.ok((swept.snapshot.replicas.find((replica) => replica.room === "desk")?.integrity ?? 0) >= before);
});

test("claimed sectors can plant and pulse durable anchors", () => {
  const session = createSession("session-test-anchors");

  applyCommand(session, "pager off");
  const early = applyCommand(session, "plant-anchor foyer");
  assert.match(early.reply.join("\n"), /not ready/i);

  applyCommand(session, "deploy");
  applyCommand(session, "scan");
  applyCommand(session, "sync");
  applyCommand(session, "sync");
  applyCommand(session, "install");
  applyCommand(session, "compile");
  applyCommand(session, "login Boden");
  applyCommand(session, "porthack phonebook");
  applyCommand(session, "enter phonebook");
  applyCommand(session, "root");
  applyCommand(session, "audit");
  applyCommand(session, "patch");
  applyCommand(session, "firewall");
  applyCommand(session, "snapshot");
  applyCommand(session, "secure");
  applyCommand(session, "claim-sector foyer");

  const planted = applyCommand(session, "plant-anchor foyer");
  assert.match(planted.reply.join("\n"), /Planted Foyer Loop anchor/i);
  assert.equal(planted.snapshot.anchors.length, 1);
  assert.ok((planted.snapshot.anchors[0]?.capacity ?? 0) >= 35);
  assert.ok(planted.snapshot.mesh.signals.some((signal) => signal.includes("1 planted anchor")));

  const before = planted.snapshot.anchors[0]?.heartbeat ?? 0;
  const pulsed = applyCommand(session, "pulse-anchor foyer");
  assert.match(pulsed.reply.join("\n"), /Pulsed Foyer Loop anchor/i);
  assert.ok((pulsed.snapshot.anchors[0]?.heartbeat ?? 0) > before);
});

test("the accord closes only after stable evidence-backed control", () => {
  const session = createSession("session-test-accord");

  const early = applyCommand(session, "attune");
  assert.match(early.reply.join("\n"), /Accord holds/i);
  assert.equal(early.snapshot.accord.completed, false);

  applyCommand(session, "pager off");
  applyCommand(session, "scan");
  applyCommand(session, "enter archive");
  applyCommand(session, "history");
  applyCommand(session, "cat 2001.NOTE");
  applyCommand(session, "decode 2001.NOTE");
  applyCommand(session, "pin 2001.NOTE");
  applyCommand(session, "back");

  applyCommand(session, "deploy");
  applyCommand(session, "scan");
  applyCommand(session, "sync");
  applyCommand(session, "sync");
  applyCommand(session, "install");
  applyCommand(session, "compile");
  applyCommand(session, "runbook desk");

  applyCommand(session, "login Boden");
  applyCommand(session, "porthack phonebook");
  applyCommand(session, "enter phonebook");
  applyCommand(session, "trace bbs");
  applyCommand(session, "mark bbs");
  applyCommand(session, "root");
  applyCommand(session, "audit");
  applyCommand(session, "patch");
  applyCommand(session, "firewall");
  applyCommand(session, "snapshot");
  applyCommand(session, "secure");
  applyCommand(session, "deploy");
  applyCommand(session, "scan");
  applyCommand(session, "sync");
  applyCommand(session, "sync");
  applyCommand(session, "install");
  applyCommand(session, "compile");
  applyCommand(session, "runbook phonebook");
  applyCommand(session, "trace desk");
  applyCommand(session, "maintain desk");
  applyCommand(session, "maintain desk");
  applyCommand(session, "rotate desk");
  applyCommand(session, "link desk");
  applyCommand(session, "rekey desk");
  applyCommand(session, "accept warm-copy");
  applyCommand(session, "submit warm-copy");
  applyCommand(session, "maintain phonebook");
  applyCommand(session, "runbook phonebook");
  applyCommand(session, "maintain desk");
  applyCommand(session, "runbook desk");
  applyCommand(session, "stabilize");
  applyCommand(session, "claim-sector foyer");
  applyCommand(session, "sweep-sector foyer");

  const accord = applyCommand(session, "accord");
  assert.equal(accord.snapshot.accord.ready, true);
  assert.equal(accord.snapshot.accord.score, 100);
  assert.match(accord.reply.join("\n"), /Fragment understood/);

  const closed = applyCommand(session, "attune");
  assert.match(closed.reply.join("\n"), /Accord closed/i);
  assert.equal(closed.snapshot.accord.completed, true);
  assert.ok(closed.snapshot.badges.includes("accord:clear"));
});

test("presence roster pages and assigns known contacts server-side", () => {
  const session = createSession("session-test-presence");

  applyCommand(session, "pager off");
  const earlyRoster = applyCommand(session, "roster");
  assert.match(earlyRoster.reply.join("\n"), /nora/i);

  const earlyPage = applyCommand(session, "page nora");
  assert.match(earlyPage.reply.join("\n"), /Trace bbs first/i);

  applyCommand(session, "enter bbs");
  const paged = applyCommand(session, "page nora");
  assert.match(paged.reply.join("\n"), /Nora answers/i);
  assert.equal(paged.snapshot.presence.find((entry) => entry.id === "nora")?.state, "available");

  applyCommand(session, "enter bbs");
  applyCommand(session, "camp");
  applyCommand(session, "tunnel");
  const before = buildSnapshot(session).pressure.find((entry) => entry.room === "bbs")?.level ?? 0;
  const assigned = applyCommand(session, "assign nora bbs");
  const after = assigned.snapshot.pressure.find((entry) => entry.room === "bbs")?.level ?? 0;

  assert.match(assigned.reply.join("\n"), /Nora watches BBS Lobby/i);
  assert.ok(after < before);
  assert.equal(assigned.snapshot.presence.find((entry) => entry.id === "nora")?.state, "helping");
  assert.equal(assigned.snapshot.presence.find((entry) => entry.id === "nora")?.taskRoom, "bbs");
});

test("room folds reveal from context and smooth through backend checks", () => {
  const session = createSession("session-test-folds");

  applyCommand(session, "pager off");
  const quiet = applyCommand(session, "folds");
  assert.match(quiet.reply.join("\n"), /No visible folds/i);

  applyCommand(session, "enter archive");
  applyCommand(session, "history");
  const visible = applyCommand(session, "folds");
  assert.match(visible.reply.join("\n"), /archive-blue-shift/i);

  const inspected = applyCommand(session, "fold archive-blue-shift");
  assert.match(inspected.reply.join("\n"), /Blue Shift/i);
  assert.ok(inspected.snapshot.notebook.some((entry) => entry.source === "archive-blue-shift"));

  const blocked = applyCommand(session, "smooth archive-blue-shift");
  assert.match(blocked.reply.join("\n"), /still catches/i);

  applyCommand(session, "cat 2001.NOTE");
  applyCommand(session, "decode 2001.NOTE");
  applyCommand(session, "pin 2001.NOTE");
  const smoothed = applyCommand(session, "smooth archive-blue-shift");

  assert.match(smoothed.reply.join("\n"), /Blue Shift smoothed/i);
  assert.equal(smoothed.snapshot.anomalies.find((entry) => entry.id === "archive-blue-shift")?.state, "stabilized");
  assert.ok(smoothed.snapshot.badges.includes("fold:archive-blue-shift"));
});

test("controlled copies drift and can be maintained", () => {
  const session = createSession("session-test-daemons");

  const deployed = applyCommand(session, "deploy");
  assert.equal(deployed.snapshot.daemons.find((daemon) => daemon.room === "desk")?.state, "quiet");

  for (let index = 0; index < 15; index += 1) {
    applyCommand(session, "time");
  }

  const watched = applyCommand(session, "watch");
  const daemon = watched.snapshot.daemons.find((entry) => entry.room === "desk");
  const replica = watched.snapshot.replicas.find((entry) => entry.room === "desk");

  assert.match(watched.reply.join("\n"), /Desktop: noisy|Desktop copy drifted/i);
  assert.ok((daemon?.load ?? 0) >= 3);
  assert.ok((replica?.integrity ?? 55) < 55);

  const blockedRotate = applyCommand(session, "rotate");
  assert.match(blockedRotate.reply.join("\n"), /too noisy/i);

  applyCommand(session, "maintain");
  const maintained = applyCommand(session, "maintain");
  assert.match(maintained.reply.join("\n"), /maintenance complete/i);
  assert.ok((maintained.snapshot.daemons.find((entry) => entry.room === "desk")?.load ?? 6) <= 1);

  const beforeRotate = maintained.snapshot.replicas.find((entry) => entry.room === "desk")?.integrity ?? 0;
  const rotated = applyCommand(session, "rotate");
  assert.match(rotated.reply.join("\n"), /rotation complete/i);
  assert.ok((rotated.snapshot.replicas.find((entry) => entry.room === "desk")?.integrity ?? 0) > beforeRotate);
  assert.equal(rotated.snapshot.daemons.find((entry) => entry.room === "desk")?.load, 0);
});

test("copy faults open incidents that require triage and restore", () => {
  const session = createSession("session-test-incidents");

  applyCommand(session, "deploy");
  for (let index = 0; index < 25; index += 1) {
    applyCommand(session, "time");
  }

  const incidents = applyCommand(session, "incidents");
  assert.match(incidents.reply.join("\n"), /incident:desk/);
  assert.equal(incidents.snapshot.incidents.find((incident) => incident.room === "desk")?.status, "open");

  const rotateBlocked = applyCommand(session, "rotate");
  assert.match(rotateBlocked.reply.join("\n"), /too noisy|unresolved incident/i);

  const restoreBlocked = applyCommand(session, "restore-node desk");
  assert.match(restoreBlocked.reply.join("\n"), /Triage Desktop/i);

  const triaged = applyCommand(session, "triage desk");
  assert.match(triaged.reply.join("\n"), /incident triaged/i);
  assert.equal(triaged.snapshot.incidents.find((incident) => incident.room === "desk")?.status, "triaged");

  const restored = applyCommand(session, "restore-node desk");
  assert.match(restored.reply.join("\n"), /Desktop restored/);
  assert.equal(restored.snapshot.incidents.find((incident) => incident.room === "desk")?.status, "restored");
  assert.equal(restored.snapshot.daemons.find((daemon) => daemon.room === "desk")?.load, 0);
});

test("briefs evaluate route and evidence progress server-side", () => {
  const session = createSession("session-test-briefs");

  const listed = applyCommand(session, "briefs");
  assert.match(listed.reply.join("\n"), /line-check/);

  applyCommand(session, "accept line-check");
  const earlyLineCheck = applyCommand(session, "submit line-check");
  assert.match(earlyLineCheck.reply.join("\n"), /not ready/i);
  assert.match(earlyLineCheck.reply.join("\n"), /route to Phonebook/i);

  applyCommand(session, "login Boden");
  applyCommand(session, "porthack phonebook");
  applyCommand(session, "enter phonebook");
  const lineCheck = applyCommand(session, "submit line-check");
  assert.match(lineCheck.reply.join("\n"), /Line Check complete/);

  applyCommand(session, "back");
  applyCommand(session, "enter archive");
  applyCommand(session, "history");
  applyCommand(session, "cat 2001.NOTE");
  applyCommand(session, "decode 2001.NOTE");
  applyCommand(session, "pin 2001.NOTE");
  applyCommand(session, "accept shelf-card");
  const shelfCard = applyCommand(session, "submit shelf-card");

  assert.match(shelfCard.reply.join("\n"), /Shelf Card complete/);
  assert.ok(shelfCard.snapshot.rooms.find((room) => room.id === "qotd")?.unlocked);
  assert.equal(shelfCard.snapshot.briefs.find((brief) => brief.id === "shelf-card")?.status, "complete");
});

test("hosts and rootkit aliases stay wired to the host graph and root flow", () => {
  const session = createSession("session-test-8a");

  applyCommand(session, "pager off");
  const hosts = applyCommand(session, "hosts");
  const netstat = applyCommand(session, "netstat");
  assert.equal(hosts.reply.join("\n"), netstat.reply.join("\n"));

  applyCommand(session, "login Boden");
  applyCommand(session, "porthack phonebook");
  applyCommand(session, "enter phonebook");
  const rootkit = applyCommand(session, "rootkit");
  assert.match(rootkit.reply.join("\n"), /Phonebook is now rooted/);
});

test("the play store persists sessions to disk", () => {
  const originalStorePath = process.env.PLAY_SESSION_STORE_PATH;
  const storePath = path.join(process.cwd(), "data", "play-sessions-test.json");
  process.env.PLAY_SESSION_STORE_PATH = storePath;
  resetPlayStoreForTests();
  if (existsSync(storePath)) {
    unlinkSync(storePath);
  }

  const session = createAndStoreSession("session-test-8b");

  runCommand(session.sessionId, "login Boden");
  runCommand(session.sessionId, "hosts");
  runCommand(session.sessionId, "enter archive");
  runCommand(session.sessionId, "camp");

  assert.equal(existsSync(storePath), true);

  const persisted = JSON.parse(readFileSync(storePath, "utf8")) as {
    sessions?: Record<string, {
      sessionId?: string;
      hostPressure?: { archive?: { level?: number } };
      notebook?: Record<string, { kind?: string }>;
      replicas?: { desk?: { integrity?: number } };
      briefs?: { "line-check"?: { status?: string } };
      daemons?: { desk?: { load?: number } };
      incidents?: { "incident:desk"?: { status?: string } };
      waypoints?: { bbs?: { hops?: string[] } };
      meshStabilized?: boolean;
      trustLinks?: Record<string, { integrity?: number }>;
      services?: { phonebook?: { health?: number } };
      runbooks?: { phonebook?: { runs?: number } };
      sectors?: { foyer?: { sweeps?: number } };
      accord?: { completedAtCommand?: number };
      presence?: { nora?: { state?: string; taskRoom?: string } };
      anomalies?: { "archive-blue-shift"?: { state?: string } };
      anchors?: { "anchor:foyer"?: { heartbeat?: number } };
      circuits?: { "circuit:loop"?: { uses?: number } };
    }>;
  };
  assert.equal(persisted.sessions?.[session.sessionId]?.sessionId, session.sessionId);
  assert.equal(persisted.sessions?.[session.sessionId]?.hostPressure?.archive?.level, 2);
  assert.equal(persisted.sessions?.[session.sessionId]?.meshStabilized, false);
  runCommand(session.sessionId, "back");
  runCommand(session.sessionId, "deploy");
  const persistedAfterDeploy = JSON.parse(readFileSync(storePath, "utf8")) as {
    sessions?: Record<string, {
      replicas?: { desk?: { integrity?: number } };
      daemons?: { desk?: { load?: number } };
    }>;
  };
  assert.equal(persistedAfterDeploy.sessions?.[session.sessionId]?.replicas?.desk?.integrity, 55);
  assert.equal(persistedAfterDeploy.sessions?.[session.sessionId]?.daemons?.desk?.load, 0);
  runCommand(session.sessionId, "accept line-check");
  const persistedAfterBrief = JSON.parse(readFileSync(storePath, "utf8")) as {
    sessions?: Record<string, { briefs?: { "line-check"?: { status?: string } } }>;
  };
  assert.equal(persistedAfterBrief.sessions?.[session.sessionId]?.briefs?.["line-check"]?.status, "accepted");
  runCommand(session.sessionId, "back");
  runCommand(session.sessionId, "enter bbs");
  runCommand(session.sessionId, "mark bbs");
  runCommand(session.sessionId, "trace desk");
  runCommand(session.sessionId, "map-circuit loop: desk bbs");
  runCommand(session.sessionId, "ride-circuit loop");
  runCommand(session.sessionId, "page nora");
  runCommand(session.sessionId, "assign nora bbs");
  const persistedAfterMark = JSON.parse(readFileSync(storePath, "utf8")) as {
    sessions?: Record<string, {
      waypoints?: { bbs?: { hops?: string[] } };
      presence?: { nora?: { state?: string; taskRoom?: string } };
      circuits?: { "circuit:loop"?: { uses?: number } };
    }>;
  };
  assert.deepEqual(persistedAfterMark.sessions?.[session.sessionId]?.waypoints?.bbs?.hops, ["desk", "phonebook", "bbs"]);
  assert.equal(persistedAfterMark.sessions?.[session.sessionId]?.presence?.nora?.state, "helping");
  assert.equal(persistedAfterMark.sessions?.[session.sessionId]?.presence?.nora?.taskRoom, "bbs");
  assert.equal(persistedAfterMark.sessions?.[session.sessionId]?.circuits?.["circuit:loop"]?.uses, 1);
  runCommand(session.sessionId, "back");
  runCommand(session.sessionId, "back");
  runCommand(session.sessionId, "deploy");
  runCommand(session.sessionId, "scan");
  runCommand(session.sessionId, "sync");
  runCommand(session.sessionId, "sync");
  runCommand(session.sessionId, "porthack phonebook");
  runCommand(session.sessionId, "enter phonebook");
  runCommand(session.sessionId, "root");
  runCommand(session.sessionId, "audit");
  runCommand(session.sessionId, "patch");
  runCommand(session.sessionId, "firewall");
  runCommand(session.sessionId, "snapshot");
  runCommand(session.sessionId, "secure");
  runCommand(session.sessionId, "deploy");
  runCommand(session.sessionId, "scan");
  runCommand(session.sessionId, "sync");
  runCommand(session.sessionId, "trace desk");
  runCommand(session.sessionId, "maintain desk");
  runCommand(session.sessionId, "maintain desk");
  runCommand(session.sessionId, "rotate desk");
  runCommand(session.sessionId, "link desk");
  runCommand(session.sessionId, "install");
  runCommand(session.sessionId, "compile");
  runCommand(session.sessionId, "runbook phonebook");
  runCommand(session.sessionId, "claim-sector foyer");
  runCommand(session.sessionId, "plant-anchor foyer");
  runCommand(session.sessionId, "pulse-anchor foyer");
  runCommand(session.sessionId, "sweep-sector foyer");
  const persistedAfterLink = JSON.parse(readFileSync(storePath, "utf8")) as {
    sessions?: Record<string, {
      trustLinks?: Record<string, { integrity?: number }>;
      services?: { phonebook?: { health?: number } };
      runbooks?: { phonebook?: { runs?: number } };
      sectors?: { foyer?: { sweeps?: number } };
      accord?: { completedAtCommand?: number };
      anchors?: { "anchor:foyer"?: { heartbeat?: number } };
    }>;
  };
  assert.ok(Object.values(persistedAfterLink.sessions?.[session.sessionId]?.trustLinks ?? {}).some((link) => (link.integrity ?? 0) > 0));
  assert.ok((persistedAfterLink.sessions?.[session.sessionId]?.services?.phonebook?.health ?? 0) > 0);
  assert.equal(persistedAfterLink.sessions?.[session.sessionId]?.runbooks?.phonebook?.runs, 1);
  assert.equal(persistedAfterLink.sessions?.[session.sessionId]?.sectors?.foyer?.sweeps, 1);
  assert.ok((persistedAfterLink.sessions?.[session.sessionId]?.anchors?.["anchor:foyer"]?.heartbeat ?? 0) > 70);
  runCommand(session.sessionId, "enter archive");
  runCommand(session.sessionId, "enter archive");
  runCommand(session.sessionId, "history");
  runCommand(session.sessionId, "cat 2001.NOTE");
  runCommand(session.sessionId, "decode 2001.NOTE");
  runCommand(session.sessionId, "pin 2001.NOTE");
  runCommand(session.sessionId, "smooth archive-blue-shift");
  runCommand(session.sessionId, "maintain phonebook");
  runCommand(session.sessionId, "runbook phonebook");
  runCommand(session.sessionId, "maintain desk");
  runCommand(session.sessionId, "runbook desk");
  runCommand(session.sessionId, "accept warm-copy");
  runCommand(session.sessionId, "submit warm-copy");
  runCommand(session.sessionId, "enter phonebook");
  runCommand(session.sessionId, "enter phonebook");
  runCommand(session.sessionId, "rekey desk");
  runCommand(session.sessionId, "stabilize");
  runCommand(session.sessionId, "attune");
  const persistedAfterAccord = JSON.parse(readFileSync(storePath, "utf8")) as {
    sessions?: Record<string, {
      accord?: { completedAtCommand?: number };
      anomalies?: { "archive-blue-shift"?: { state?: string } };
    }>;
  };
  assert.ok((persistedAfterAccord.sessions?.[session.sessionId]?.accord?.completedAtCommand ?? 0) > 0);
  assert.equal(persistedAfterAccord.sessions?.[session.sessionId]?.anomalies?.["archive-blue-shift"]?.state, "stabilized");
  runCommand(session.sessionId, "scan");
  const persistedAfterScan = JSON.parse(readFileSync(storePath, "utf8")) as {
    sessions?: Record<string, { notebook?: Record<string, { kind?: string }> }>;
  };
  assert.ok(Object.values(persistedAfterScan.sessions?.[session.sessionId]?.notebook ?? {}).some((entry) => entry.kind === "room"));

  if (originalStorePath === undefined) {
    delete process.env.PLAY_SESSION_STORE_PATH;
  } else {
    process.env.PLAY_SESSION_STORE_PATH = originalStorePath;
  }
  resetPlayStoreForTests();
  if (existsSync(storePath)) {
    unlinkSync(storePath);
  }
});

test("basic mode and legacy launchers behave like a nested shell", () => {
  const session = createSession("session-test-8c");

  const basicDenied = applyCommand(session, "basic");
  assert.match(basicDenied.reply.join("\n"), /Login first/i);

  applyCommand(session, "login Boden");

  const basic = applyCommand(session, "basic");
  assert.equal(basic.snapshot.prompt, ">");
  assert.match(basic.reply.join("\n"), /Classic BASIC interpreter ready/);

  const dir = applyCommand(session, "dir");
  assert.match(dir.reply.join("\n"), /hello\.bas/);

  const load = applyCommand(session, "load hello.bas");
  assert.match(load.reply.join("\n"), /Classic BASIC program: Hello/);

  const list = applyCommand(session, "list");
  assert.match(list.reply.join("\n"), /PRINT "HELLO, WORLD!"/);

  const run = applyCommand(session, "run");
  assert.match(run.reply.join("\n"), /HELLO, WORLD!/);

  const quit = applyCommand(session, "quit");
  assert.equal(quit.snapshot.prompt, "@");

  const usenet = applyCommand(session, "usenet");
  const games = applyCommand(session, "games");
  const zork = applyCommand(session, "zork");
  const uupath = applyCommand(session, "uupath relay");
  const uumap = applyCommand(session, "uumap");
  const dial = applyCommand(session, "dial 3148372840");

  assert.match(usenet.reply.join("\n"), /USENET archive/);
  assert.match(games.reply.join("\n"), /zork\.gam/);
  assert.match(zork.reply.join("\n"), /Running zork\.gam/);
  assert.match(uupath.reply.join("\n"), /Route to Relay/);
  assert.match(uumap.reply.join("\n"), /hosts visible/);
  assert.match(dial.reply.join("\n"), /dialing 3148372840/);
});

test("the low-level monitor opens from the shell and returns cleanly", () => {
  const session = createSession("session-test-8d");

  const denied = applyCommand(session, "call -151");
  assert.match(denied.reply.join("\n"), /Login first/i);

  applyCommand(session, "login Boden");
  const entered = applyCommand(session, "call -151");
  assert.equal(entered.snapshot.prompt, "*");
  assert.match(entered.reply.join("\n"), /Entering monitor/i);

  const dump = applyCommand(session, "d 2000");
  const list = applyCommand(session, "l");
  const regs = applyCommand(session, "r");
  const resume = applyCommand(session, "g");

  assert.match(dump.reply.join("\n"), /^D 2000/m);
  assert.match(list.reply.join("\n"), /JSR/);
  assert.match(regs.reply.join("\n"), /A=00 X=01 Y=00 P=24 SP=FF/);
  assert.match(resume.reply.join("\n"), /Returning to the shell/);
  assert.equal(resume.snapshot.prompt, "@");
});

test("expanded host rooms are part of the visible graph", () => {
  const session = createSession("session-test-9");

  const snapshot = buildSnapshot(session);
  const roomIds = snapshot.rooms.map((room) => room.id);

  assert.ok(roomIds.includes("games"));
  assert.ok(roomIds.includes("lab"));
  assert.ok(roomIds.includes("irc"));
  assert.ok(snapshot.hosts.some((host) => host.id === "games"));
  assert.ok(snapshot.hosts.some((host) => host.id === "lab"));
  assert.ok(snapshot.hosts.some((host) => host.id === "irc"));
});
