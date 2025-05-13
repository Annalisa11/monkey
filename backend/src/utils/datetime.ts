export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const formatHourRange = (hourString: string): string => {
  const hour = Number(hourString);
  const startHour = hour.toString().padStart(2, '0');
  const nextHour: number = (hour + 1) % 24;
  const endHour = nextHour.toString().padStart(2, '0');
  return `${startHour}:00-${endHour}:00`;
};

export const formatDateToUnix = (jsDate: Date): number => {
  return Math.floor(jsDate.getTime() / 1000);
};

export const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dateArray: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dateArray.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
};

export const generateWeekIntervals = (
  startDate: Date,
  endDate: Date
): { startDate: Date; endDate: Date; yearWeek: string }[] => {
  const weekIntervals: { startDate: Date; endDate: Date; yearWeek: string }[] =
    [];
  let currentStartDate = new Date(startDate);

  const dayOfWeek = currentStartDate.getDay();
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  currentStartDate.setDate(currentStartDate.getDate() - diff);

  while (currentStartDate < endDate) {
    const weekEndDate = new Date(currentStartDate);
    weekEndDate.setDate(currentStartDate.getDate() + 6);

    const year = currentStartDate.getFullYear();
    const weekNum = getISOWeek(currentStartDate);
    const yearWeek = `${year}${weekNum.toString().padStart(2, '0')}`;

    weekIntervals.push({
      startDate: new Date(currentStartDate),
      endDate: new Date(weekEndDate),
      yearWeek,
    });

    currentStartDate.setDate(currentStartDate.getDate() + 7);
  }

  return weekIntervals;
};

export const getISOWeek = (date: Date): number => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
};

export const formatTime = (seconds: number): string => {
  const date = new Date(seconds * 1000);
  const minutes = date.getUTCMinutes();
  const secondsRemaining = date.getUTCSeconds();
  return `${minutes}m ${secondsRemaining}s`;
};
