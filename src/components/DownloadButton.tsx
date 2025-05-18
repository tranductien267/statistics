// src/components/DownloadButton.tsx
import { saveAs } from 'file-saver';
import ExcelJS from 'exceljs';
import {
  calculateWorkingStats,
  AttendanceEntry,
  getWeekdayName,
  calculateOvertimeHours,
  getDaysInMonth,
} from '../utils/timeUtils';

interface Props {
  attendanceData: AttendanceEntry[];
  employeeId?: string;
  month: number;
  year: number;
  employeeName?:string
}

const DownloadButton = ({ attendanceData, employeeId, month, year,employeeName }: Props) => {
  const handleDownload = async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(employeeName);

    // Bảng tổng hợp (summary) từ G2
    const stats = calculateWorkingStats(attendanceData);
    const summaryHeaders = ['出勤', '時間内', '時間外', '承認'];
    const summaryValues = [
      stats.totalDays,
      stats.totalWorkHours,
      stats.totalOvertimeHours,
      '',
    ];

    const startCol = 4; // G
    const startRow = 2;

    summaryHeaders.forEach((header, index) => {
      const cell = sheet.getCell(startRow, startCol + index);
      cell.value = header;
      cell.border = getBorderStyle();
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    summaryValues.forEach((val, index) => {
      const cell = sheet.getCell(startRow + 1, startCol + index);
      cell.value = val;
      cell.border = getBorderStyle();
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Bảng chi tiết từ A6
    const days = getDaysInMonth(month, year);
    const detailHeaders = ['日付', '曜日', '始業時間', '終業時間', '残業', '作業内容', '現場'];
    sheet.addRow([]);
    sheet.addRow([]);
    const detailStartRow = 6;
    sheet.getRow(detailStartRow).values = detailHeaders;

    detailHeaders.forEach((_, idx) => {
      const cell = sheet.getRow(detailStartRow).getCell(idx + 1);
      cell.border = getBorderStyle();
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    days.forEach((day, idx) => {
      const record = attendanceData.find((r) => r.date.split('T')[0] === day);
      const rowValues = [
        day.split('-')[2],
        getWeekdayName(day),
        record?.startTime || '-',
        record?.endTime || '-',
        record ? calculateOvertimeHours(record.startTime, record.endTime) : '-',
        record?.task || '',
        record?.location || '',
      ];
      const row = sheet.addRow(rowValues);

      row.eachCell((cell) => {
        cell.border = getBorderStyle();
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });

    // Xuất file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `勤怠_${employeeName}_${month}_${year}.xlsx`);
  };

  const getBorderStyle = () => ({
    top: { style: 'thin' as const },
    left: { style: 'thin' as const },
    bottom: { style: 'thin' as const },
    right: { style: 'thin' as const },
  });

  return (
    <button
      onClick={handleDownload}
      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
    >
      📥 ダウンロード
    </button>
  );
};

export default DownloadButton;
