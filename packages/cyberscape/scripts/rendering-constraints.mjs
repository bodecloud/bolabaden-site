import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));

const forbiddenDirectDeps = [
  "lucide-react",
  "three",
  "@react-three/fiber",
  "@react-three/drei",
  "phaser",
  "pixi.js",
  "@pixi/react",
  "babylonjs",
  "@babylonjs/core",
  "playcanvas",
  "unity-webgl",
];

const directDeps = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

const failures = [];

for (const dep of forbiddenDirectDeps) {
  if (Object.hasOwn(directDeps, dep)) {
    failures.push(`Forbidden direct dependency: ${dep}`);
  }
}

const sourcePatterns = [
  [/from\s+["']lucide-react["']/, "Lucide React import"],
  [/from\s+["']three["']/, "Three.js import"],
  [/from\s+["']@react-three\//, "React Three import"],
  [/from\s+["']phaser["']/, "Phaser import"],
  [/from\s+["']pixi\.js["']/, "Pixi import"],
  [/\bWebGLRenderingContext\b|\bwebgl2?\b|getContext\(["']webgl2?["']\)/i, "WebGL usage"],
  [/\bWebAssembly\b|\.wasm\b|wasm-bindgen/i, "WASM usage"],
  [/<canvas\b|document\.createElement\(["']canvas["']\)/i, "Canvas renderer usage"],
  [/<svg\b/i, "Source SVG element"],
  [/\blocalStorage\b|\bsessionStorage\b/, "Browser storage state"],
  [/data-darkreader-inline-stroke/, "DarkReader mutation artifact"],
];

async function collectFiles(dir) {
  const entries = await readdir(dir);
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const info = await stat(full);
    if (info.isDirectory()) {
      if (["node_modules", ".next"].includes(entry)) continue;
      files.push(...await collectFiles(full));
      continue;
    }
    if (/\.(ts|tsx|js|jsx|css|mjs|json)$/.test(entry)) files.push(full);
  }
  return files;
}

const scanRoots = [
  path.join(root, "src"),
  path.join(root, "tests"),
];

for (const scanRoot of scanRoots) {
  for (const file of await collectFiles(scanRoot)) {
    const rel = path.relative(root, file);
    const text = await readFile(file, "utf8");
    for (const [pattern, label] of sourcePatterns) {
      if (pattern.test(text)) {
        failures.push(`${label}: ${rel}`);
      }
    }
  }
}

if (failures.length) {
  console.error("Rendering constraint check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("rendering-constraints-ok");
