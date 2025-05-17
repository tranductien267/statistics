// src/pages/AttendancePage.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MonthPicker from "../components/MonthPicker";
import AttendanceSummary from "../components/AttendanceSummary";
import AttendanceTable from "../components/AttendanceTable";
import DownloadButton from "../components/DownloadButton";
import {AttendanceEntry } from "../utils/timeUtils";
const AttendancePage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
  const [isShowSider, setIsShowSider] = useState<boolean>(true);
  return (
    <div className="flex h-screen">
      {/* Sidebar nhân viên */}
      <Sidebar onSelectEmployee={setSelectedEmployee} selectedEmployeeId={selectedEmployee} onSidebarChange={setIsShowSider} />

      {/* Phần phải */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <MonthPicker
            month={selectedMonth}
            year={selectedYear}
            onChangeMonth={setSelectedMonth}
            onChangeYear={setSelectedYear}
            isShowSider={isShowSider}
          />
          <DownloadButton  
            attendanceData={attendanceData}
            employeeId={selectedEmployee}
            month={selectedMonth}
            year={selectedYear}
          />
        </div>

        {selectedEmployee && (
          <>
            <AttendanceSummary
              attendanceData={attendanceData}
            />
            <AttendanceTable
              employeeId={selectedEmployee}
              month={selectedMonth}
              year={selectedYear}
              onDataLoaded={setAttendanceData}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
