/**
 * Height of the summary sheet that stays on screen when it is collapsed.
 *
 * The sheet offsets itself by `sheetHeight - SHEET_PEEK`, so its top edge lands
 * `SHEET_PEEK` above the viewport bottom. The form's sticky prev/next bar rests
 * on that same edge, so both sides read the number from here instead of
 * hard-coding a `bottom-…` utility that can silently drift out of sync.
 */
export const SHEET_PEEK = 72
