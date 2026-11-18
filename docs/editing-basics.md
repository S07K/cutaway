# Editing basics

This guide covers the timeline, keyframes, masks, captions, and export. For a
first walkthrough, see [Getting started](getting-started.md).

## Timeline

The timeline sits at the bottom of the editor. Its toolbar shows the playhead
timecode against the project's total duration.

- **Tracks.** Use the **+ Video** and **+ Audio** buttons under the track
  headers to add tracks. A new video track is placed on top (in front); a new
  audio track goes at the bottom. Each track header has buttons to mute, hide,
  and lock the track.
- **Select.** Click a clip to select it. The toolbar shows how many clips are
  selected. `Esc` clears the selection.
- **Split.** `S` or the scissors button splits the selected clips at the
  playhead. With nothing selected, it splits whatever clip the playhead is over.
- **Delete.** `Delete` (or `Backspace`) removes the selection. The timeline
  button is labelled "Ripple delete selection".
- **Snapping.** `N` or the magnet button toggles snapping.
- **Zoom.** `+` and `-`, or the zoom buttons.
- **Undo / redo.** `Ctrl`/`Cmd` + `Z`, and `Ctrl`/`Cmd` + `Shift` + `Z`.

## Keyframes

Select a single clip and open **Properties** in the right sidebar. Each property
row has a diamond button on its left, labelled "Toggle _property_ keyframe".

1. Move the playhead to the frame you want.
2. Click the diamond. A keyframe is added at the playhead, holding the value the
   property currently shows. Click it again on the same frame to remove it.
3. Move the playhead and change the value, then click the diamond to add another
   keyframe.

A filled diamond means there is a keyframe on the current frame. A tinted
outline means the property is animated but this frame is between keyframes. If
the playhead is outside the clip, the panel shows "Playhead off clip".

The **Animate** section at the top of Properties has one-click presets: Fade In,
Fade Out, Pop In, Pop Out, and Slide In. Applying one writes ordinary keyframes
onto the clip, as a single undo step, and you can edit them afterwards.

## Masks

Select a clip and open the **Masks** tab. Click **Rectangle** or **Ellipse** to
add a mask to the clip. Each mask in the list has controls to invert it, disable
or enable it, and remove it. A mask clips the layer so the layer underneath
shows through.

## Captions

Open **Captions** in the left rail.

- **Type a caption.** Enter text in the "Type a caption…" field and click
  **Add** (or press `Enter`). It is added at the playhead with evenly timed
  words.
- **Generate from audio.** If you have imported media with audio, the panel
  offers **Generate captions**, which transcribes the first such file with
  Whisper running on your device.
- **Pick a style.** Once a caption track exists, the style buttons switch its
  look: TikTok, Hormozi, MrBeast, Instagram, and Ali Abdaal.
- **Retime.** Caption blocks appear on the timeline. Drag a block to move it or
  drag an end handle to trim it, so you can sync it to the audio.

## Color and effects

- **Color** tab: color-grade the selected clip, with **Looks** presets and a
  **Reset** button.
- **Effects** tab: **Add effect** to stack effects on the clip. Each effect can
  be moved up or down, disabled, or removed, and its parameters are editable.

## Export

Click **Export** in the top toolbar. The dialog offers:

| Setting    | Options                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| Format     | MP4 (H.264) or WebM (VP9)                                                        |
| Resolution | The project's, or one of the other listed heights                                |
| Frame rate | The project's, or one of the other listed rates                                  |
| Quality    | High, Medium, or Low                                                             |
| Range      | Shown only when in/out points are set: the In–Out selection or the full timeline |

To export part of the timeline, move the playhead and press `I` to set the in
point and `O` to set the out point (or use the matching timeline buttons).

Click **Export** in the dialog to start. A progress view appears with a
**Cancel** button, and when it finishes the dialog says "Exported — check your
downloads." The video is encoded in the browser and downloaded to your device.
