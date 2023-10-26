/**
 * Returns the string version of the current time in 24 hours format eg. 16:42.
 * 2 digits for hours and 2 digits for minutes.
 */
export function get24HourTime(): string {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours < 10 ? "0" + hours : hours.toString();
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes.toString();
  return formattedHours + ":" + formattedMinutes;
}
