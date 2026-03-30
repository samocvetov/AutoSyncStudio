# Changelog

All notable changes to this project are recorded in this file.

## [1.0.39] - 2026-03-31

### Fixed
- Fixed the multicam render coordinate bug introduced in 1.0.38: after trimming leading empty timeline time, shot segments now stay in original master-audio coordinates instead of being shifted a second time, so the first real camera no longer disappears and later shots no longer freeze from negative source trims.

## [1.0.38] - 2026-03-31

### Fixed
- Normalized final multicam shot segments against real camera availability before rendering: delayed cameras are no longer allowed to start a shot before they actually have footage, and tiny timing gaps are now reassigned or extended instead of being rendered as black `tpad` inserts between cuts.
- Trimmed the leading empty portion of the final multicam output when the first usable camera starts later than master audio, so the exported video no longer begins with artificial empty pre-roll.

## [1.0.37] - 2026-03-31

### Fixed
- Updated exported multicam aligned-camera commands to match the actual aligned-render implementation: delayed cameras now use black `tpad` lead-in (`start_mode=add:color=black`) instead of cloning the first frame.

## [1.0.36] - 2026-03-31

### Fixed
- Reverted the incorrect 1.0.35 multicam baseline shift. Master audio now remains anchored at timeline zero again, matching the Premiere layout where all cameras start later than the external audio.

## [1.0.35] - 2026-03-31

### Fixed
- Changed final multicam rendering to trim the master audio by the earliest positive camera offset and shift all camera delays relative to that baseline, matching the working single-cam sync model instead of keeping full audio pre-roll and padding video from absolute master time zero.

## [1.0.34] - 2026-03-31

### Fixed
- Restored the Russian UTF-8 UI strings in the desktop interface after the 1.0.33 encoding regression in `main.js`.
- Reapplied the clean multicam fallback completion report without the misleading log-break warning, this time without damaging file encoding.
## [1.0.33] - 2026-03-31

### Fixed
- Stopped the fast multicam planner from blindly falling back to the primary camera for windows that no camera fully covers, which had still been producing bad cuts and apparent desync on large-offset timelines.
- Restored per-shot black lead-in inside the fast multicam render path for ranges that begin before a delayed camera actually starts, preserving timeline timing without reviving the slow aligned pre-render stage.
- Removed the leftover multicam fallback message claiming the log stream had broken after completion; successful fallback completion now shows a clean finish report instead of an error-like warning.

## [1.0.32] - 2026-03-31

### Fixed
- Removed the accidental per-camera aligned pre-render step from final multicam rendering, restoring the fast direct-edit pipeline instead of creating mandatory temporary mezzanine files before every render.
- Tightened camera eligibility in multicam shot selection so the fast path only uses cameras that fully cover the requested shot window, avoiding the earlier fake lead-in behavior without bringing back slow aligned staging.

## [1.0.31] - 2026-03-30

### Fixed
- Fixed multicam aligned-mezzanine generation after the 1.0.29 render rewrite by staging intermediate aligned outputs through the same Windows-safe output path handling used elsewhere, avoiding `Error opening output files` on Cyrillic paths.

## [1.0.30] - 2026-03-30

### Fixed
- Restored the broken Russian UI strings in the desktop multicam interface after the previous encoding regression in `main.js`.

## [1.0.29] - 2026-03-30

### Fixed
- Switched final multicam rendering to pre-render per-camera aligned mezzanine files and cut the final timeline from those aligned sources instead of trimming raw delayed camera inputs directly.
- Changed internal multicam aligned lead-in from frozen first-frame padding to black padding, matching the practical “camera is not on the timeline yet” behavior more closely for delayed sources.
- Removed the alarming multicam fallback text about the log stream breaking after completion so successful renders now end with a clean completion report.

## [1.0.28] - 2026-03-30

### Fixed
- Prevented `Smart AI` multicam from choosing cameras for timeline ranges they do not actually cover yet, which had been causing frozen lead-in frames and severe apparent desync on sources with large positive offsets.
- Added coverage-aware camera selection for utterance segments, silent gaps, and long cutaway insertion so delayed cameras only enter the edit when they have enough real footage for that portion of the timeline.

## [1.0.27] - 2026-03-30

### Fixed
- Reworked `Smart AI` multicam shot planning so it no longer behaves like a hardcoded two-camera interview mode when three or more cameras are present.
- Added camera-aware alternate shot selection for non-primary speakers and stable cutaway insertion inside long primary-camera segments, allowing extra cameras to appear without chaotic switching.

## [1.0.26] - 2026-03-30

### Changed
- Cleaned the project root by removing the legacy `OLD` tree from version control and tightening `.gitignore` for cache folders, runtime state, Windows thumbnails, and obsolete local build artifacts.

## [1.0.25] - 2026-03-30

### Added
- Added a Russian `README.md` with an overview of the desktop apps, key features, build flow, project structure, and bundled Windows dependencies.

## [1.0.24] - 2026-03-30

### Changed
- Installed the new user-provided app icon into the Windows build asset.
- Reworked the Windows resource generation so Wails desktop builds place the icon under the resource ID expected by the native window title bar, with a dedicated 16x16 variant for the small system icon.

## [1.0.23] - 2026-03-30

### Changed
- Replaced the placeholder Wails app icon with a project icon asset for Windows desktop builds.
- Switched the Windows resource build to use a generated project icon PNG instead of the old placeholder `.ico`.
- Added an upstream sync script for `ffmpeg-over-ip` Windows release zips and stopped treating those large zip artifacts as files that belong in Git.

## [1.0.22] - 2026-03-30

### Added
- Added Windows resource generation with the project icon so desktop builds embed the app icon into the executable.
- Added a repository `.gitignore` to keep local caches, runtime state, generated resources, and Windows build artifacts out of Git.

## [1.0.21] - 2026-03-30

### Fixed
- Fixed the multicam completion report using the streamed `totalTime` field so timeline duration no longer shows `undefined сек`.

## [1.0.20] - 2026-03-30

### Fixed
- Moved desktop API key persistence from iframe localStorage to backend settings storage, so AssemblyAI and AI keys now survive full app restarts even when the embedded UI runs on a different localhost port each session.

## [1.0.19] - 2026-03-30

### Fixed
- Restored multicam completion fallback after switching output selection to folder mode by resolving the final output file path in the UI the same way as the backend.
- Added a short post-stream flush delay so the final multicam completion event is less likely to be lost before the HTTP stream closes.

## [1.0.18] - 2026-03-30

### Changed
- Reworked the multicam UI to match the single-cam flow more closely: output picking now uses folder selection, render quality/speed use the same style of presets, and AI settings moved to the Render Backend tab.
- Removed the extra multicam explanatory texts and hid the internal shot-window/min-shot tuning from the UI, keeping stable defaults in code.

## [1.0.17] - 2026-03-30

### Fixed
- Added a final output existence check so the UI no longer reports a fatal `network error` when the streamed log drops after a successful multicam render.
- Empty derived `aligned` folders are now removed after multicam render completion.

## [1.0.16] - 2026-03-30

### Fixed
- Updated the AssemblyAI pre-recorded transcription request to use the required `speech_models` array with language detection, replacing the deprecated `speech_model` field.

## [1.0.15] - 2026-03-30

### Added
- Persisted AssemblyAI and LLM API keys locally in the desktop UI so they survive app restarts.

### Fixed
- Improved AssemblyAI upload and transcript-start diagnostics by surfacing the real API response text instead of a generic failure message.

## [1.0.14] - 2026-03-30

### Changed
- Reworked AI multicam editing to a steadier speaker-driven plan: the dominant speaker stays on the main camera, and secondary speakers switch only on longer utterances.

### Fixed
- Fixed AssemblyAI preparation on Windows by staging master audio through Windows-safe paths before ffmpeg converts it to WAV.
- Improved the `prepare wav` error message so ffmpeg stderr is shown instead of a raw exit status code.

## [1.0.13] - 2026-03-30

### Changed
- Made classic multicam switching less jittery by preferring the current camera unless another view has a clearly stronger score.
- Stopped creating the derived `aligned` directory during command export alone.

### Fixed
- Respected video rotation metadata when probing source streams so vertical phone footage keeps a vertical render canvas.
- Avoided false final `network error` reports in the UI when the render stream has already delivered a completed event.

## [1.0.12] - 2026-03-30

### Fixed
- Reworked the desktop shell to launch the embedded HTTP backend on a pre-bound free localhost port and inject that exact address into the window, removing the fixed-port startup hang.

## [1.0.11] - 2026-03-30

### Fixed
- Made the desktop shell wait for the embedded local backend before loading the UI, avoiding startup `network error` screens when the HTTP service is not ready yet.

## [1.0.10] - 2026-03-30

### Changed
- Removed the separate multicam aligned-output field from the UI and now derive the aligned clip folder automatically from the final output path.
- Added multicam preview length modes for render checks: full file, 2 minutes, or 5 minutes.

## [1.0.9] - 2026-03-30

### Changed
- Simplified the multicam screen by keeping the main workflow visible and moving render tuning plus AI/Shorts options into collapsible sections.

### Fixed
- Fixed multicam preprocessing on Windows so envelope extraction and video probing also use staged Windows-safe paths for files with Cyrillic names.

## [1.0.8] - 2026-03-30

### Changed
- Returned action buttons to a neutral default look, with role colors shown only on interaction.
- Added the app version to the window title, in-app title, and versioned desktop output filename.

## [1.0.7] - 2026-03-30

### Changed
- Updated primary single-cam action buttons to fixed role colors: green for Analyze, blue for Render, red for Cancel.
- Renamed the single-cam action labels to shorter button titles.

## [1.0.6] - 2026-03-30

### Changed
- Switched the single-cam folder picker to an explorer-style folder selection flow instead of the old tree dialog.
- Restored the previous single-cam output field copy and browse button styling.

## [1.0.5] - 2026-03-30

### Changed
- Simplified the single-cam output folder UI so it behaves like a plain folder picker without showing a file name in the control copy.

## [1.0.4] - 2026-03-30

### Changed
- Switched single-cam output selection back to folder picking with automatic output file naming.
- Single-cam default output names now follow the pattern `source_creationtime_sync.ext`.

### Fixed
- `.autosync-temp` is now cleaned up after staged render work completes.

## [1.0.3] - 2026-03-30

### Changed
- Avoided full render-time staging copies when Windows short paths are available for source files and output directories.

### Fixed
- Reduced disk-heavy pre-render copying that made renders look frozen before ffmpeg progress appeared.

## [1.0.2] - 2026-03-30

### Fixed
- Routed ffmpeg progress to the same output stream that the desktop UI reads, restoring live render updates.
- Continued Windows-safe render path handling for single-cam output and source staging fixes.

## [1.0.1] - 2026-03-30

### Changed
- Switched desktop builds to Windows GUI production mode so Wails apps no longer open a console window.
- Added a local build workflow in `build-local.ps1` with isolated cache and profile directories inside the workspace.
- Aligned multicam final output naming and save-path behavior with single-cam sync.
- Optimized Windows input handling by preferring short paths before falling back to staging copies.
- Fixed single-cam and multicam render paths so Windows-safe staging applies during render, not only during analysis.
- Restored ffmpeg progress streaming through the desktop UI.
- Replaced the single-cam output picker with a save-file dialog instead of a folder-only picker.

### Added
- Added explicit project version tracking via `VERSION`.
- Added Wails desktop config files for desktop targets.

### Fixed
- Fixed Wails desktop binaries being built without the required production tags.
- Fixed render failures on Windows when source or output paths contain non-ASCII characters.
