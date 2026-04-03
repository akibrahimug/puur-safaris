/**
 * Determines the new start/end dates when a user clicks a day
 * on the range picker.
 *
 * Rules:
 * 1. No existing range → clicked date becomes start
 * 2. Start exists, no end → clicked date becomes end (or new start if before current start)
 * 3. Complete range exists → reset: clicked date becomes new start, end is cleared
 *
 * We need `clickedDate` explicitly because react-day-picker's `onSelect`
 * range may extend the previous selection instead of giving us the raw click.
 */
export function resolveRangeSelection(
  clickedDate: Date,
  currentStart: Date | undefined,
  currentEnd: Date | undefined,
): { from: Date; to: Date | undefined } {
  // Rule 3: complete range exists → reset
  if (currentStart && currentEnd) {
    return { from: clickedDate, to: undefined }
  }

  // Rule 1: nothing selected → new start
  if (!currentStart) {
    return { from: clickedDate, to: undefined }
  }

  // Rule 2: start exists, no end
  if (clickedDate < currentStart) {
    // Clicked before current start → becomes new start
    return { from: clickedDate, to: undefined }
  }

  // Clicked same day as start → reset
  if (clickedDate.getTime() === currentStart.getTime()) {
    return { from: clickedDate, to: undefined }
  }

  // Clicked after start → becomes end
  return { from: currentStart, to: clickedDate }
}
