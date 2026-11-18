# Getting started

Cutaway is a video editor that runs in your browser. Your footage stays on your
device: the page is static and there is no backend to upload to.

## Open the editor

- **Hosted:** <https://cutaway-one.vercel.app> — no signup, no install.
- **From source:** you need Node 20+ and pnpm 10+.

  ```bash
  pnpm install
  pnpm dev
  ```

  Then open <http://localhost:3000>.

## Your first edit

1. **Import media.** Click **Import** in the top toolbar (or **Import media** in
   the Media panel), or drop files anywhere on the editor. Video, audio, and
   image files are accepted.
2. **Add it to the timeline.** In the Media panel, click a file's card (or the
   `+` button that appears on it). The clip lands on the first unlocked track of
   the matching kind, after that track's last clip, and becomes selected. If
   there is no such track, one is created.
3. **Preview it.** Press `Space` (or the play button under the preview) to play
   and pause. `←` / `→` step one frame, `Shift` + arrow steps ten, and
   `Home` / `End` jump to the start or end.
4. **Trim and cut.** Move the playhead and press `S` to split the clip there.
   Select a clip and press `Delete` to remove it (the timeline button is
   labelled "Ripple delete selection").
5. **Export.** Click **Export** at the top right, pick settings, and click
   **Export** in the dialog. See [Editing basics](editing-basics.md#export).

Made a mistake? `Ctrl`/`Cmd` + `Z` undoes and `Ctrl`/`Cmd` + `Shift` + `Z`
redoes. The toolbar also has undo and redo buttons.

## Saving your work

- The project autosaves in your browser; the status bar shows "Saved locally"
  once it has.
- To keep a copy as a file, click **Save project to a file** in the toolbar
  (`Ctrl`/`Cmd` + `S` saves immediately). Reopen it later with **Open project
  file**. Project files use the `.cutaway` extension.

## Layout

- **Left rail:** **Media** (your imported files) and **Captions**.
- **Center:** the preview, with transport controls below it.
- **Right sidebar:** **Properties**, **Masks**, **Color**, and **Effects** for the
  selected clip.
- **Bottom:** the timeline.
- **Top toolbar:** import, undo/redo, project name, aspect ratio, project
  resolution and frame rate, the keyboard shortcut list (`?`), open/save, and
  export.

Press `?` at any time to see every keyboard shortcut.

Next: [Editing basics](editing-basics.md).
