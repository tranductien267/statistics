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
  const range = XLSX.utils.decode_range(attendanceWS['!ref']!); // vùng dữ liệu
  // Thêm border cho sheet tổng hợp (có 4 cột)
  const borderStyle = {
    top: { style: 'thin', color: { rgb: '000000' } },
    bottom: { style: 'thin', color: { rgb: '000000' } },
    left: { style: 'thin', color: { rgb: '000000' } },
    right: { style: 'thin', color: { rgb: '000000' } }
  };
  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const cell_address = XLSX.utils.encode_cell({ r, c });
      if (!attendanceWS[cell_address]) continue;
      if (!attendanceWS[cell_address].s) attendanceWS[cell_address].s = {};
      attendanceWS[cell_address].s.border = borderStyle;
      attendanceWS[cell_address].s.alignment = { horizontal: "center", vertical: "center" };
    }
  }

  XLSX.utils.book_append_sheet(wb, attendanceWS, "Cham Cong");
  XLSX.utils.book_append_sheet(wb, summaryWS, "Tong Hop");

  const fileName = `勤怠_${employeeId}_${month}_${year}.xlsx`;
  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
  function s2ab(s: string) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
  saveAs(new Blob([s2ab(wbout)], { type: "application/octet-stream" }), fileName);
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
