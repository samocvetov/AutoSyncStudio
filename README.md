# AutoSync Studio

AutoSync Studio — Windows-приложение для синхронизации видео с внешним мастер-аудио, точного рендера и multicam-монтажа.

Текущая версия: `1.0.25`

## Что умеет проект

- `Single-Cam Sync`: анализирует смещение между видео и отдельным аудиофайлом, затем делает точный sync-рендер.
- `Multicam`: измеряет offset всех камер относительно мастер-аудио и собирает финальный монтаж.
- `Smart AI`: использует AssemblyAI и AI-эвристику для более осмысленного multicam-плана.
- `Render Backend`: отдельный desktop-интерфейс для `ffmpeg-over-ip-server`.
- `Bundled Windows tools`: desktop-сборки работают со встроенными `ffmpeg`, `ffprobe` и `ffmpeg-over-ip`.

## Основные программы

- `AutoSyncStudioDesktop-<version>.exe` — основное desktop-приложение.
- `AutoSyncRenderServerDesktop-<version>.exe` — desktop-приложение render backend.
- `autosync-studio.exe` — консольная сборка основного сервиса.
- `autosync-render-server.exe` — консольная сборка render backend.

## Как собрать проект

Рекомендуемая локальная сборка на Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-local.ps1
```

Скрипт:

- изолирует `GOCACHE`, `TEMP`, `APPDATA` и другие служебные каталоги внутри проекта;
- генерирует Windows-ресурсы и иконки для desktop exe;
- собирает GUI- и console-версии приложений.

## Структура проекта

- [app.go](C:/Admin/AutoSyncStudio/app.go) — основной backend.
- [main.js](C:/Admin/AutoSyncStudio/main.js) и [index.html](C:/Admin/AutoSyncStudio/index.html) — основной UI.
- [cmd/studio-desktop/main.go](C:/Admin/AutoSyncStudio/cmd/studio-desktop/main.go) — desktop-обертка основного приложения.
- [cmd/render-server-desktop/main.go](C:/Admin/AutoSyncStudio/cmd/render-server-desktop/main.go) — desktop-обертка render server.
- [internal/studioapp/app.go](C:/Admin/AutoSyncStudio/internal/studioapp/app.go) — внутренняя реализация studio backend.
- [internal/renderserverapp/app.go](C:/Admin/AutoSyncStudio/internal/renderserverapp/app.go) — внутренняя реализация render backend.
- [internal/bundles/manifest.json](C:/Admin/AutoSyncStudio/internal/bundles/manifest.json) — единый manifest встроенных компонентов.
- [third_party/windows](C:/Admin/AutoSyncStudio/third_party/windows) — Windows-зависимости для bundling.

## Bundled binaries

Подробности по встроенным бинарям:

- [BUNDLED_BINARIES.md](C:/Admin/AutoSyncStudio/BUNDLED_BINARIES.md)
- [third_party/windows/README.md](C:/Admin/AutoSyncStudio/third_party/windows/README.md)

Для обновления upstream-архивов `ffmpeg-over-ip`:

```powershell
powershell -ExecutionPolicy Bypass -File .\third_party\windows\sync-upstream-ffmpeg-over-ip.ps1
```

Источник:

- [steelbrain/ffmpeg-over-ip](https://github.com/steelbrain/ffmpeg-over-ip)

## Версионирование

- текущая версия хранится в [VERSION](C:/Admin/AutoSyncStudio/VERSION)
- история изменений хранится в [CHANGELOG.md](C:/Admin/AutoSyncStudio/CHANGELOG.md)

## Статус

Проект активно развивается. Основной текущий фокус — стабильный Windows desktop workflow, точный sync, multicam и удобный UX без лишней ручной настройки.
