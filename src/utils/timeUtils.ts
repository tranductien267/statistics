// src/utils/timeUtils.ts
export interface AttendanceEntry {
  _id:string;
  userId: string; // YYYY-MM-DD
  date: string;
  location: string;
  startTime: string;
  endTime: string;
  task:string
}
export interface Employee {
  _id: string,
  usercode:string,
  username:string
};
export function getDaysInMonth(month: number, year: number): string[] {
  const days: string[] = [];
  const totalDays = new Date(year, month, 0).getDate(); // Lấy số ngày trong tháng

  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month - 1, d);
    const formatted = date.toLocaleDateString('en-CA'); // dạng YYYY-MM-DD
    days.push(formatted);
  }

  return days;
}

export function getWeekdayName(dateStr: string): string {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[new Date(dateStr).getDay()];
}

export function parseHour(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h + m / 60;
}

export function calculateOvertimeHours(start: string, end: string): number {
  const startHour = parseHour(start);
  const endHour = parseHour(end);

  let overtime = 0;
  if (startHour < 8) overtime += 8 - startHour;
  if (endHour > 17) overtime += endHour - 17;

  return Math.round(overtime * 100) / 100;
}

export function calculateWorkingStats(entries: AttendanceEntry[]) {
  let totalDays = 0;
  let totalWorkHours = 0;
  let totalOvertimeHours = 0;
  for (const e of entries) {
    if (!e.startTime || !e.endTime) continue;
    totalDays++;

    const start = parseHour(e.startTime);
    const end = parseHour(e.endTime);

    const regularStart = Math.max(start, 8);
    const regularEnd = Math.min(end, 17);
    const regular = Math.max(0, regularEnd - regularStart);
    const overtime = calculateOvertimeHours(e.startTime, e.endTime);

    totalWorkHours += regular;
    totalOvertimeHours += overtime;
  }

  return {
    totalDays,
    totalWorkHours: Math.round(totalWorkHours * 100) / 100,
    totalOvertimeHours: Math.round(totalOvertimeHours * 100) / 100,
  };
}
