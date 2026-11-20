export const CLUB_TIMEZONE = 'Europe/Kyiv';

export const getClubCurrentDateTime = () => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: CLUB_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  const partMap = {};
  for (const p of parts) {
    if (p.type !== 'literal') {
      partMap[p.type] = p.value;
    }
  }

  const year = partMap.year;
  const month = partMap.month;
  const day = partMap.day;
  const hour = partMap.hour === '24' ? '00' : partMap.hour;
  const minute = partMap.minute;

  return {
    currentDateStr: `${year}-${month}-${day}`,
    currentTimeStr: `${hour}:${minute}`,
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
    hour: parseInt(hour, 10),
    minute: parseInt(minute, 10),
    timezone: CLUB_TIMEZONE
  };
};

export const hasSessionStarted = (bookingDateStr, timeSlotStr) => {
  if (!bookingDateStr || !timeSlotStr) return false;
  const { currentDateStr, currentTimeStr } = getClubCurrentDateTime();

  if (bookingDateStr < currentDateStr) {
    return true;
  }
  if (bookingDateStr === currentDateStr) {
    return timeSlotStr <= currentTimeStr;
  }
  return false;
};

export const isSessionCompleted = (bookingDateStr, timeSlotStr) => {
  if (!bookingDateStr || !timeSlotStr) return false;
  const { currentDateStr, currentTimeStr } = getClubCurrentDateTime();

  if (bookingDateStr < currentDateStr) {
    return true;
  }
  if (bookingDateStr === currentDateStr) {
    const startHour = parseInt(timeSlotStr.split(':')[0], 10);
    const endHourStr = `${String(startHour + 1).padStart(2, '0')}:00`;
    return endHourStr <= currentTimeStr;
  }
  return false;
};
