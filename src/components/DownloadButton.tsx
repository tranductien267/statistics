// src/components/DownloadButton.tsx.
import { calculateWorkingStats, AttendanceEntry,getWeekdayName,calculateOvertimeHours,getDaysInMonth } from "../utils/timeUtils";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
interface Props {
  attendanceData: AttendanceEntry[];
  employeeId?: string;
  month: number;
  year: number;
}

const DownloadButton = ({ attendanceData,employeeId,month,year }: Props) => {
  const handleDownload = () => {
    const days = getDaysInMonth(month, year);
    console.log("dayweek",days)
     // Tạo sheet chấm công
    const attendanceSheetData = [
      ["日付", "曜日", "始業時間", "終業時間", "残業", "作業内容", "現場"],
      ...days.map((day:string) => {
        const record = attendanceData.find((r) => r.date.split('T')[0] == day)
        return [
        day.split("-")[2],
        getWeekdayName(day),
        record? record.startTime: "-",
        record? record.endTime: "-",
        record? calculateOvertimeHours(record.startTime, record.endTime): "-",
        record?.task,
        record?.location
        ]
      })
    ];
  // Tạo sheet tổng hợp
  const stats = calculateWorkingStats(attendanceData);
  const summarySheetData = [
    ["出勤", "時間内", "時間外", "承認"],
    [
      stats.totalDays,
      stats.totalWorkHours,
      stats.totalOvertimeHours,
       "",
    ],
  ];

  const wb = XLSX.utils.book_new();
  const attendanceWS = XLSX.utils.aoa_to_sheet(attendanceSheetData);
  const summaryWS = XLSX.utils.aoa_to_sheet(summarySheetData);
  XLSX.utils.sheet_add_aoa(summaryWS, summarySheetData, { origin: "G2" });
  // Thêm border cho sheet tổng hợp (có 4 cột)
  const borderStyle = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  for (let r = 1; r <= 31; r++) {
    for (let c = 1; c <= 7; c++) {
      const cellRef = XLSX.utils.encode_cell({ r, c });
      if (!attendanceWS[cellRef]) continue;
      if (!attendanceWS[cellRef].s) attendanceWS[cellRef].s = {};
      attendanceWS[cellRef].s.border = borderStyle;
    }
  }

  XLSX.utils.book_append_sheet(wb, attendanceWS, "Cham Cong");
  XLSX.utils.book_append_sheet(wb, summaryWS, "Tong Hop");

  const fileName = `勤怠_${employeeId}_${month}_${year}.xlsx`;
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), fileName);

  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
    >
      📥 Tải xuống
    </button>
  );
};

export default DownloadButton;
