import { DateTime } from "luxon";

export const getFullDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;   
}

export const getTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
}

export const AlertAt = ( date: string, time: string, timezone: string ) => {
  let finalDate ;

  if (!date) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    finalDate = tomorrow.toISOString().split("T")[0]; 
  } else {
    finalDate = date
  }

  const dt = DateTime.fromISO(
    `${finalDate}T${time}`,
    { zone: timezone }
  );

  if (!dt.isValid) return null;

  return dt.toUTC().toISO();
};

export const getWeekRange = (date: string | Date | number) => {
  const now = new Date(date);

  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - startOfThisWeek.getDay());
  startOfThisWeek.setHours(0, 0, 0, 0);

  const start = new Date(startOfThisWeek)
  start.setDate(startOfThisWeek.getDate() - 7)
  startOfThisWeek.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
}

export const getDayRange = (date: string | Date | number) => {
  const now = new Date(date);

  // Start of day (00:00:00.000)
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  // End = start of next day (00:00:00.000)
  const end = new Date(start);
  end.setDate(start.getDate() + 1);

  return { start, end };
};