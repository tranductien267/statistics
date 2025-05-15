// src/components/AttendanceTable.tsx
import { useEffect, useState } from "react";
import { getDaysInMonth, AttendanceEntry, getWeekdayName, calculateOvertimeHours } from "../utils/timeUtils";

interface Props {
  employeeId: string;
  month: number;
  year: number;
  onDataLoaded: (data: AttendanceEntry[]) => void;
}

const AttendanceTable = ({ employeeId, month, year ,onDataLoaded}: Props) => {
  const [data, setData] = useState<AttendanceEntry[]>([]);

  useEffect(() => {
    // Mock data – có thể thay bằng API fetch
    const fetchData = async () => {
      try {
        const queryParams ="userId=" + employeeId + "&year=" + year + "&month=" + month
        const response = await fetch(process.env.REACT_APP_API_URL +  "/api/timesheetByUser?" + queryParams);
        const data = await response.json();
        setData(data);
        onDataLoaded(data)
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();

  }, [employeeId, month, year]);

  const days = getDaysInMonth(month, year);

  return (
    <div className="overflow-auto">
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">日付</th>
            <th className="border px-2 py-1">曜日</th>
            <th className="border px-2 py-1">始業時間</th>
            <th className="border px-2 py-1">終業時間</th>
            <th className="border px-2 py-1">残業</th>
            <th className="border px-2 py-1">内容</th>
            <th className="border px-2 py-1">現場</th>
          </tr>
        </thead>
        <tbody>
          {days.map((day:string) => {
            const record = data.find((r) => r.date.split('T')[0] === day);
            return (
              <tr key={day} className="text-center">
                <td className="border px-2 py-1">{day.split("-")[2]}</td>
                <td className="border px-2 py-1">{getWeekdayName(day)}</td>
                <td className="border px-2 py-1">{record?.startTime || "-"}</td>
                <td className="border px-2 py-1">{record?.endTime || "-"}</td>
                <td className="border px-2 py-1">
                  {record ? calculateOvertimeHours(record.startTime, record.endTime) : "-"}
                </td>
                <td className="border px-2 py-1">{record?.task || "-"}</td>
                <td className="border px-2 py-1">{record?.location || "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
