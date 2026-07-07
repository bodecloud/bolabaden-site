---
source_url: "https://grok.com/c/8c1ea412-6828-479b-9734-1c6a601b9f57"
conversation_id: "8c1ea412-6828-479b-9734-1c6a601b9f57"
title: "pytest-qt Stops After First Test"
extracted_at: "2026-06-29T16:11:15.784Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# pytest-qt Stops After First Test

Source: [Grok conversation](https://grok.com/c/8c1ea412-6828-479b-9734-1c6a601b9f57)

## User

_Time: 2026-02-03T05:33:24.438Z_

pytest runs only one test then stops, collected 245 items but only executes first test. Windows, pytest-qt Qt GUI tests. Process does not crash - it just stops after first test. Tried: minimal conftest, --cache-clear, removing --ff, disabling pytest-timeout. Test file: test_indoor_builder.py with qtbot fixture. What causes pytest to execute only the first test and exit normally without running remaining tests?

## Assistant

_Time: 2026-02-03T05:36:47.614Z_

### Key Points
- The evidence leans toward the issue being caused by a call to `QApplication.quit()` or `exit()` in the code under test during the first test, affecting the shared `QApplication` instance across the session.<grok:render card_id="0b3e21" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">68</argument>
</grok:render> <grok:render card_id="a2814f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render>
- This can prevent subsequent tests from running their event loops correctly, resulting in immediate failures, timeouts, or the appearance of the test session stopping early.
- On Windows, Qt behavior might exacerbate this, especially if event processing or platform-specific quirks (e.g., offscreen rendering) are involved, though no definitive Windows-only bug matches exactly.<grok:render card_id="21515e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render>
- Configuration like `-x` or `--maxfail=1` in pytest could cause the session to halt after the first test if it subtly fails or triggers an exit state, even if the process "exits normally" (e.g., with exit code 1 but no visible crash).
- The qtbot fixture shares a session-scoped `QApplication`, so state changes (e.g., quitting) carry over unless mitigated.

### Potential Causes
The problem aligns with known pytest-qt limitations where quitting the application in one test disrupts others. If your first test (in `test_indoor_builder.py`) involves GUI actions that trigger a quit—intentionally or via the code under test—it can leave the `QApplication` in an exited state. Subsequent tests may then fail to process events, leading to the session appearing to stop. This is compounded on Windows, where GUI testing without proper event loop management can lead to silent failures or aborts if widgets are created improperly.

### How to Diagnose
- Run pytest with verbose output (`-v` or `-vv`) to see if the first test passes or fails subtly, and check for any Qt-related warnings or errors in the logs.
- Isolate the issue by running only the first test (`pytest test_indoor_builder.py::first_test_name`) and observe if it quits the app (e.g., via debug prints or tracing `QApplication.exit` calls).
- Check for calls to `app.exec_()`, `quit()`, or `exit()` in your test code or the GUI logic; these should be avoided in pytest-qt as qtbot handles event processing via local loops.<grok:render card_id="6df1a3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">59</argument>
</grok:render>
- Verify your pytest command line or `pytest.ini` for options like `-x` that stop on failure, even if you removed `--ff`.
- On Windows, test with `QT_QPA_PLATFORM=windows` (default) vs. `offscreen` to rule out platform plugin issues.<grok:render card_id="cf6dea" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render>

### Recommended Fixes
- **Monkeypatch quit/exit:** In your test or conftest.py, temporarily override `QApplication.quit` and `exit` to prevent actual quitting:
  ```
  import pytest
  from PyQt5.QtWidgets import QApplication  # Adjust for your Qt binding

  @pytest.fixture(autouse=True)
  def no_quit(monkeypatch):
      def fake_quit(*args, **kwargs):
          pass
      monkeypatch.setattr(QApplication, 'quit', fake_quit)
      monkeypatch.setattr(QApplication, 'exit', fake_quit)
  ```
  This allows testing quit behavior without affecting the session.<grok:render card_id="645983" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render>
- Avoid `app.exec_()` in tests; rely on qtbot methods like `waitSignal`, `waitUntil`, or `waitExposed` for event handling.
- If needed, use function-scoped fixtures or run tests in separate processes (e.g., via `pytest-forked`) to isolate QApplication instances.<grok:render card_id="9fd078" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">48</argument>
</grok:render>
- Ensure no sys.exit() or process-aborting calls in your GUI code during tests.
- For Windows-specific quirks, consider adding delays or explicit event processing with `qtbot.wait(100)` to stabilize.

---
### Detailed Survey of pytest-qt Issues Leading to Early Test Session Termination

This section provides a comprehensive overview of the problem, drawing from documentation, GitHub issues, Stack Overflow discussions, and troubleshooting guides related to pytest-qt and Qt GUI testing on Windows. The focus is on why a test session might collect many items (e.g., 245) but only execute the first before stopping, without crashing. We'll cover root causes, related behaviors, diagnostic steps, mitigation strategies, and comparisons to similar issues.

#### Overview of pytest-qt and Qt GUI Testing Mechanics
pytest-qt is a plugin for testing PyQt/PySide applications, providing the `qtbot` fixture to simulate user interactions and manage Qt event loops without manually calling `QApplication.exec_()`.<grok:render card_id="8ff988" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">59</argument>
</grok:render> The `qapp` fixture (session-scoped) creates a single `QApplication` instance shared across all tests to optimize performance. This shared state is efficient but fragile—if one test alters it (e.g., by quitting), others suffer.

In GUI tests using `qtbot`, events are processed via temporary local event loops (e.g., during `waitSignal` or `keyClick`). On Windows, Qt uses the "windows" platform plugin by default, allowing visible windows, but headless mode (`QT_QPA_PLATFORM=offscreen`) can introduce quirks like failed tooltips or event processing.<grok:render card_id="affcd6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render> Unlike Linux (which often requires Xvfb for headless testing), Windows can run GUI tests natively, but event loop issues can still arise.

Your setup (Windows, pytest-qt, qtbot in `test_indoor_builder.py`) suggests the stop occurs due to state corruption after the first test, especially if it involves showing widgets or signals that might trigger quits.

#### Primary Cause: QApplication Quit/Exit in the First Test
The most substantiated cause is a call to `QApplication.quit()` or `exit()` during the first test, often triggered by the GUI code under test (e.g., closing a window or handling an event).<grok:render card_id="8c043a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">68</argument>
</grok:render> <grok:render card_id="a1cda3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render> This posts a quit event, exiting all active event loops and setting an internal flag (`QThreadData.quitNow`) that causes future loops to return immediately with error code -1.

- **Impact on Subsequent Tests:** Methods like `qtbot.waitSignal` or `waitUntil` fail with `TimeoutError` or `AssertionError`, as no events process.<grok:render card_id="fcd055" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render> If pytest is configured to stop on failures (e.g., `-x` or `--maxfail=1`), the session halts after the first test—matching your description of collecting 245 items but executing only one.
- **Why "Exits Normally":** No segfault or crash occurs; the process ends with pytest's exit code (e.g., 1 for failures), appearing normal but incomplete.
- **Windows-Specific Nuances:** On Windows, quitting might interact poorly with the platform plugin, leading to silent aborts if widgets are created post-quit (Qt aborts if no valid app exists).<grok:render card_id="1544ae" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">76</argument>
</grok:render> This differs from Linux, where missing DISPLAY causes immediate crashes.<grok:render card_id="b368d0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">52</argument>
</grok:render>

Similar issues reported:
- In GitHub issue #37, calling `exit()` in one test breaks `waitSignal` in others, with event loops returning -1.<grok:render card_id="7b5163" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">48</argument>
</grok:render>
- Issue #323 notes `QApplication.quit()` causes subsequent `waitCallback` to fail, but succeeds in isolation.<grok:render card_id="e90e56" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">70</argument>
</grok:render>
- Users report tests passing individually but failing in suites due to carried-over quit state.<grok:render card_id="a3367f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">66</argument>
</grok:render>

#### Other Potential Causes
- **Manual app.exec_() Calls:** If your test code includes `QApplication.exec_()`, it runs the main event loop, blocking pytest until quit. If quit happens quickly, the first test finishes, but the quit state affects others. pytest-qt advises against this—use qtbot for non-blocking waits.<grok:render card_id="45a7d2" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">81</argument>
</grok:render>
- **Fixture or State Persistence:** qtbot adds widgets but doesn't always clean state (e.g., QSettings or open windows). If the first test leaves persistent changes, others fail.<grok:render card_id="775877" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render> <grok:render card_id="efd9c9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">66</argument>
</grok:render> Your minimal conftest trial rules out some, but check autouse fixtures.
- **Platform/Headless Issues on Windows:** Headless mode (`offscreen`) fails for certain features (e.g., tooltips), causing timeouts.<grok:render card_id="ff5d52" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render> Event hangs post-test (e.g., ICE errors) can mimic stopping.<grok:render card_id="d161d9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">46</argument>
</grok:render>
- **Configuration-Induced Stops:** Even without `--ff`, hidden `-x` in scripts or `pytest.ini` stops on failure. Verbose runs reveal if later tests are attempted but fail instantly.
- **Rare Edge Cases:** Singleton conflicts (multiple Qt versions) or fatal errors during fixture init can abort after first.<grok:render card_id="63d3d4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">63</argument>
</grok:render> <grok:render card_id="2b8d83" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">41</argument>
</grok:render> Windows-specific import issues (e.g., PyQt5 reloading) affect repeats but not first runs.<grok:render card_id="a4af9a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">87</argument>
</grok:render>

#### Diagnostic and Debugging Strategies
- Add logging: Insert prints before/after each test and around Qt calls to trace execution.
- Run subsets: `pytest -k indoor_builder` to isolate the file; compare with other files.
- Trace quits: Monkeypatch `quit/exit` to log calls without executing.
- Check environment: Run with `QT_DEBUG_PLUGINS=1` for Qt logs; ensure no conflicting packages (e.g., opencv with bundled Qt).<grok:render card_id="68047e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render>
- Use `--pdb` for debugger drop on failure; or `qtbot.stopForInteraction()` to pause and inspect.<grok:render card_id="03fe6c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">16</argument>
</grok:render>

#### Mitigation and Best Practices
- **Monkeypatching:** As above, disable quit/exit globally or per-test.<grok:render card_id="0a06e7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">48</argument>
</grok:render>
- **Isolate State:** Use function-scoped qapp if possible (custom fixture), or `pytest-forked` for process isolation.
- **Avoid Problematic Calls:** Refactor GUI code to avoid quits in test paths; mock exit-triggering functions.
- **Windows Optimizations:** Avoid offscreen if possible; add short waits (`qtbot.wait(10)`) for stability.<grok:render card_id="abd269" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render>
- **Update Dependencies:** Ensure latest pytest-qt (supports PyQt5/6, PySide); test with minimal env.

#### Comparison of Related Issues
Here's a table summarizing similar reported issues and their resolutions:

| Issue Description | Platform | Symptom | Cause | Resolution | Source |
|--------------------|----------|---------|-------|------------|--------|
| Stops after first test, collects all | Windows | Executes one, then stops | Possible quit in first test + -x | Monkeypatch quit; remove -x | This query;  |
| Subsequent tests fail after exit call | Any | Event loops fail (-1 return) | QApplication.exit() in test | Monkeypatch exit; document avoidance | ,  |
| Hangs post-test | Any | No success dot, Ctrl+C aborts with IO error | Unspecified Qt hang | Troubleshoot event loops; add window manager in CI |  |
| Fails in headless on Windows | Windows | Timeout/AssertionError in waits | Offscreen platform limitations | Switch to windowed or add delays |  |
| Aborts without error | Any | Process crashes on widget create | No QApplication/DISPLAY | Use pytest-xvfb or ensure qapp | ,  |
| State persists across tests | Any | Changes carry over, causing failures | Shared qapp + QSettings | Autouse fixture to reset env (e.g., unset HOME) | ,  |

This table highlights patterns: quit-related issues are common in shared app scenarios, often fixed via patching or isolation.

In summary, your issue fits a pattern of QApplication state corruption from quits, amplified by pytest config and Windows Qt handling. Implementing the monkeypatch should resolve it, allowing all 245 tests to run. If not, verbose logs and isolated runs will pinpoint further.

### Key Citations
- [pytest-qt Documentation: Testing QApplication.exit()](https://pytest-qt.readthedocs.io/en/latest/qapplication.html)<grok:render card_id="5de4c3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">71</argument>
</grok:render>
- [GitHub Issue #37: QApplication.exit in test makes subsequent tests fail](https://github.com/pytest-dev/pytest-qt/issues/37)<grok:render card_id="51ce5c" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">48</argument>
</grok:render> <grok:render card_id="90df53" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">68</argument>
</grok:render>
- [pytest-qt Troubleshooting Guide](https://pytest-qt.readthedocs.io/en/latest/troubleshooting.html)<grok:render card_id="c33d1d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">49</argument>
</grok:render> <grok:render card_id="d51242" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">52</argument>
</grok:render>
- [GitHub Issue #426: PyQt5 Cannot Test for ToolTip in Headless Mode on Windows](https://github.com/pytest-dev/pytest-qt/issues/426)<grok:render card_id="703bc7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">86</argument>
</grok:render>
- [pytest-qt Introduction and Reference](https://pytest-qt.readthedocs.io/en/latest/reference.html)<grok:render card_id="5a7c80" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">59</argument>
</grok:render>
- [GitHub Issue #223: How to troubleshoot post-test hang?](https://github.com/pytest-dev/pytest-qt/issues/223)<grok:render card_id="47039a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">46</argument>
</grok:render>
- [GitHub Issue #346: Application changes persist through tests](https://github.com/pytest-dev/pytest-qt/issues/346)<grok:render card_id="469b11" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">19</argument>
</grok:render> <grok:render card_id="fa720d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">66</argument>
</grok:render>
