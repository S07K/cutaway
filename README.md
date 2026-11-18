<div align="center">

# Cutaway

An open-source, local-first, AI-ready video editor for creators — running
entirely in your browser.

<!-- Project status -->

[![CI](https://github.com/S07K/cutaway/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/S07K/cutaway/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/github/license/S07K/cutaway?color=blue)](LICENSE)
[![Live demo](https://img.shields.io/badge/demo-cutaway--one.vercel.app-black?logo=vercel)](https://cutaway-one.vercel.app)
[![Status](https://img.shields.io/badge/status-active%20development-orange)](https://github.com/S07K/cutaway/issues)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Good first issues](https://img.shields.io/github/issues/S07K/cutaway/good%20first%20issue?label=good%20first%20issues&color=7057ff)](https://github.com/S07K/cutaway/labels/good%20first%20issue)

<!-- Community -->

[![GitHub stars](https://img.shields.io/github/stars/S07K/cutaway?style=flat&logo=github)](https://github.com/S07K/cutaway/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/S07K/cutaway?style=flat&logo=github)](https://github.com/S07K/cutaway/network/members)
[![Open issues](https://img.shields.io/github/issues/S07K/cutaway)](https://github.com/S07K/cutaway/issues)
[![Open PRs](https://img.shields.io/github/issues-pr/S07K/cutaway)](https://github.com/S07K/cutaway/pulls)
[![Contributors](https://img.shields.io/github/contributors/S07K/cutaway)](https://github.com/S07K/cutaway/graphs/contributors)
[![Last commit](https://img.shields.io/github/last-commit/S07K/cutaway)](https://github.com/S07K/cutaway/commits/main)
[![Repo size](https://img.shields.io/github/repo-size/S07K/cutaway)](https://github.com/S07K/cutaway)

<!-- Stack -->

[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![PixiJS](https://img.shields.io/badge/PixiJS-8-E72264?logo=pixijs&logoColor=white)](https://pixijs.com)
[![WebCodecs](https://img.shields.io/badge/WebCodecs-encode%20%2B%20decode-4285F4?logo=googlechrome&logoColor=white)](https://developer.mozilla.org/docs/Web/API/WebCodecs_API)
[![Node](https://img.shields.io/badge/node-%3E%3D20-339933?logo=nodedotjs&logoColor=white)](package.json)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![Turborepo](https://img.shields.io/badge/Turborepo-monorepo-EF4444?logo=turborepo&logoColor=white)](https://turbo.build)
[![Tested with Vitest](https://img.shields.io/badge/tested%20with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)
[![Code style: Prettier](https://img.shields.io/badge/code%20style-prettier-ff69b4?logo=prettier&logoColor=white)](https://prettier.io)

<!-- Principles -->

![Local-first](https://img.shields.io/badge/local--first-no%20cloud-success)
![No account](https://img.shields.io/badge/account-not%20required-success)
![No API keys](https://img.shields.io/badge/API%20keys-not%20required-success)
![On-device AI](https://img.shields.io/badge/AI-on--device%20Whisper-8A2BE2)

</div>

Not a Premiere clone. The goal is the simplicity of CapCut, the motion of After
Effects, the UX of Figma, and the openness of Blender.

> **Status: in active development.** The full editing loop works — import,
> multi-track timeline, WebGL preview, playback, undo/redo, masking, captions,
> **on-device Whisper transcription**, color, effects, chroma key, transitions,
> and **frame-exact export to MP4/WebM with audio**. See
> [open issues](https://github.com/S07K/cutaway/issues) for what's next.

## Try it

**<https://cutaway-one.vercel.app>** — no signup, no install. Your footage never
leaves your machine; the page is static and there is no backend to send it to.

## Quick start

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000> and start editing. No account. No cloud. No API
keys. Your footage never leaves your machine.

## What it does

- **Multi-track timeline** — layer video/image clips (backgrounds, overlays,
  picture-in-picture, watermarks) and audio tracks. Canvas-rendered for speed,
  with snapping, ripple delete, split, and drag-to-trim. Add tracks as you need
  them.
- **Media, local** — import video, audio, and images; everything is stored in
  IndexedDB and autosaves. Projects save to / open from plain-JSON `.cutaway`
  files you can diff in git.
- **WebGL preview** — a PixiJS compositor renders the timeline in realtime. It
  consumes the _same_ resolved scene the exporter does, so **what you export is
  what you previewed**.
- **Motion** — every property is keyframeable, with easing and one-click
  entrance/exit presets (Fade / Pop / Slide).
- **Masking & compositing** — rectangle, ellipse, and freeform masks with
  invert and feather. Mask a clip to reveal the layer behind it.
- **Captions** — type a caption and it drops onto the timeline as a styled,
  animated block (TikTok / Hormozi / MrBeast / Instagram / Ali Abdaal styles,
  with word-by-word highlighting). Blocks are draggable, snap, and trim on the
  timeline so you can sync them to the audio. Auto-transcription runs on-device
  with Whisper (transformers.js — WebGPU when available, WASM otherwise) behind a
  swappable provider interface, so nothing leaves your machine and no account or
  API key is ever required.
- **Color & effects** — color grading (exposure, contrast, saturation, and more)
  with look presets, plus an open-world effects registry (Gaussian blur, noise,
  and anything a plugin adds).
- **Transitions** — crossfade or dip-to-black between adjacent clips.
- **Export** — WebCodecs encoding muxed to MP4 or WebM, with a mixed audio
  track, choosable resolution / frame rate / quality, an in/out range, live
  progress, and cancel. Runs entirely in the browser.

## Principles

**Local-first, permanently.** The editor must stay fully usable without paying
for any service. No OpenAI, Anthropic, Gemini, ElevenLabs, or AssemblyAI
dependency in core — AI features run on local Whisper, ONNX, and WASM. Cloud
providers are opt-in plugins behind a provider interface; they can never become
required.

**Everything is data.** Projects are plain JSON. Caption presets are JSON.
Animation presets are JSON. Effects are registry keys plus parameter bags. If a
feature can be authored as data instead of code, it is — that is what lets the
community extend the editor without forking it.

**Plugins use the same road as core.** A plugin-provided effect and a built-in
effect are indistinguishable to the document. There is no privileged side
entrance.

## Architecture

The editor is a pure function of a JSON document. Preview and export walk the
**same** scene graph, so what you export is what you previewed.

Dependencies point downward only:

| Layer        | Packages                                                         | Constraint                      |
| ------------ | ---------------------------------------------------------------- | ------------------------------- |
| Domain       | `types`, `utils`                                                 | Zero dependencies, pure TS      |
| Engines      | `timeline-engine`, `animation-engine`, `render-engine`, …        | Pure logic — no React, no DOM   |
| Adapters     | `media-engine`, `export-engine`, `project-io`, `playback-engine` | Browser APIs, behind interfaces |
| Presentation | `ui`, `apps/web`                                                 | React — owns no business logic  |

Engines never import React. That is what makes the export path runnable headless
in Node and keeps the timeline test suite running in milliseconds.

**Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) before making structural
changes** — most constraints there exist to avoid a specific known failure mode.

## Stack

Next.js · React · TypeScript · Tailwind · Zustand · PixiJS (WebGL) · WebCodecs
with `mp4-muxer` / `webm-muxer` · IndexedDB · pnpm workspaces · Turborepo ·
Vitest

## Contributing

Cutaway is built in the open, and contributions of any size are welcome: code,
docs, testing on other browsers, bug reports, and design feedback.

- **New here?** Pick a
  [`good first issue`](https://github.com/S07K/cutaway/labels/good%20first%20issue).
  Most of them follow an existing pattern (a new effect, caption style, or
  animation preset) and fit in one small PR.
- **Want something bigger?** Browse
  [`help wanted`](https://github.com/S07K/cutaway/labels/help%20wanted) or
  filter by area (`area: preview`, `area: masks`, `area: export`, …).
- **Have an idea or question?** Start a
  [discussion](https://github.com/S07K/cutaway/discussions).

Comment on an issue to claim it, then read [`CONTRIBUTING.md`](CONTRIBUTING.md)
for setup and the few rules that matter. Please follow the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Development

```bash
pnpm dev         # run the editor
pnpm test        # unit tests across all packages
pnpm typecheck   # type check everything
pnpm lint        # lint
pnpm format      # format (run before committing)
pnpm build       # production build
```

### Shortcuts

| Key              | Action                           |
| ---------------- | -------------------------------- |
| `Space`          | Play / pause                     |
| `←` / `→`        | Step one frame (`Shift` for ten) |
| `S`              | Split at playhead                |
| `N`              | Toggle snapping                  |
| `I` / `O`        | Set export in-point / out-point  |
| `Delete`         | Ripple delete selection          |
| `Cmd/Ctrl` + `Z` | Undo (`Shift` to redo)           |
| `Cmd/Ctrl` + `S` | Save now                         |
| `+` / `-`        | Zoom timeline                    |
| `Home` / `End`   | Jump to start / end              |
| `?`              | Show the shortcut reference      |

## License

[MIT](LICENSE)
