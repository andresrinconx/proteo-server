/**
 * Get date (YYYY-MM-DD HH:mm:ss).
 */
export const getFullDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${year}-${String(month).length === 1 ? `0${month}` : `${month}`}-${String(day).length === 1 ? `0${day}` : `${day}`} ${String(hours).length === 1 ? `0${hours}` : `${hours}`}:${String(minutes).length === 1 ? `0${minutes}` : `${minutes}`}:${String(seconds).length === 1 ? `0${seconds}` : `${seconds}`}`;
};