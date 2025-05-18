// src/components/AttendanceSummary.tsx
import { useEffect, useState } from "react";
import { calculateWorkingStats, AttendanceEntry } from "../utils/timeUtils";

interface Props {
  attendanceData: AttendanceEntry[];
}

const AttendanceSummary = ({ attendanceData }: Props) => {
  const [data, setData] = useState<AttendanceEntry[]>([]);

  useEffect(() => {
    setData(attendanceData);
  }, [attendanceData]);
  console.log("entry",data)
  const stats = calculateWorkingStats(data);
  return (
    <div className="bg-blue-50 p-4 rounded shadow mb-4">
      <h2 className="font-semibold mb-2">合計</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>🗓️ 出勤: {stats.totalDays}</div>
        <div>⏰ 時間内: {stats.totalWorkHours}h</div>
        <div>💡 時間外: {stats.totalOvertimeHours}h</div>
        <div>✅ 確認印: </div>
      </div>
    </div>
  );
};

export default AttendanceSummary;
