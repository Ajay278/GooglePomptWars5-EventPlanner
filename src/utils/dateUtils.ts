// Date and calendar calculation utilities

export function formatReadableDate(dateString: string): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatTime12h(time24: string): string {
  if (!time24) return '';
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
}

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get the Monday of the week for a given date
export function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // day 0 is Sunday, 1 is Monday ...
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getWeekDays(startDate: Date): Array<{ dateString: string; dayName: string; dayNumber: number; fullDate: Date }> {
  const days = [];
  const curr = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(curr);
    d.setDate(curr.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = d.getDate();
    days.push({ dateString, dayName, dayNumber, fullDate: d });
  }
  return days;
}

export function getMonthMatrix(year: number, monthIndex: number): Array<{
  dayNumber: number;
  dateString: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}> {
  const todayStr = getTodayDateString();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);

  // 0 = Sunday, 1 = Monday. We want Monday as index 0:
  let startingDayOfWeek = firstDay.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const totalDays = lastDay.getDate();
  const matrix: Array<{ dayNumber: number; dateString: string; isCurrentMonth: boolean; isToday: boolean }> = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const prevDate = new Date(year, monthIndex - 1, dayNum);
    const y = prevDate.getFullYear();
    const m = String(prevDate.getMonth() + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;
    matrix.push({
      dayNumber: dayNum,
      dateString,
      isCurrentMonth: false,
      isToday: dateString === todayStr
    });
  }

  // Current month days
  for (let dayNum = 1; dayNum <= totalDays; dayNum++) {
    const m = String(monthIndex + 1).padStart(2, '0');
    const d = String(dayNum).padStart(2, '0');
    const dateString = `${year}-${m}-${d}`;
    matrix.push({
      dayNumber: dayNum,
      dateString,
      isCurrentMonth: true,
      isToday: dateString === todayStr
    });
  }

  // Next month leading days to complete full grid (multiple of 7)
  const remaining = (7 - (matrix.length % 7)) % 7;
  for (let i = 1; i <= remaining; i++) {
    const nextDate = new Date(year, monthIndex + 1, i);
    const y = nextDate.getFullYear();
    const m = String(nextDate.getMonth() + 1).padStart(2, '0');
    const d = String(i).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;
    matrix.push({
      dayNumber: i,
      dateString,
      isCurrentMonth: false,
      isToday: dateString === todayStr
    });
  }

  return matrix;
}

export function calculateTimeRemaining(dateStr: string, startTimeStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hours, minutes] = startTimeStr.split(':').map(Number);
    const target = new Date(year, month - 1, day, hours, minutes);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();

    if (diffMs < 0) {
      const pastMinutes = Math.floor(Math.abs(diffMs) / 60000);
      if (pastMinutes < 60) return `Started ${pastMinutes}m ago`;
      const pastHours = Math.floor(pastMinutes / 60);
      if (pastHours < 24) return `Started ${pastHours}h ago`;
      return 'Completed or Past';
    }

    const diffMinutes = Math.floor(diffMs / 60000);
    if (diffMinutes < 60) return `Starts in ${diffMinutes}m`;
    const diffHours = Math.floor(diffMinutes / 60);
    const remainMinutes = diffMinutes % 60;
    if (diffHours < 24) return `Starts in ${diffHours}h ${remainMinutes}m`;
    const diffDays = Math.floor(diffHours / 24);
    return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } catch {
    return '';
  }
}
