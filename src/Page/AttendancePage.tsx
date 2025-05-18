// src/pages/AttendancePage.tsx
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import MonthPicker from "../components/MonthPicker";
import AttendanceSummary from "../components/AttendanceSummary";
import AttendanceTable from "../components/AttendanceTable";
import DownloadButton from "../components/DownloadButton";
import UpdateButton from "../components/UpdateButton";
import {AttendanceEntry,Employee } from "../utils/timeUtils";
const AttendancePage = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | undefined>(undefined);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
  const [isShowSider, setIsShowSider] = useState<boolean>(true);
  const [attendanceEditData, setAttendanceEditData] = useState<AttendanceEntry[]>([]);
  return (
    <div className="flex h-screen">
      {/* Sidebar nhân viên */}
      <Sidebar onSelectEmployee={setSelectedEmployee} selectedEmployeeId={selectedEmployee?._id} onSidebarChange={setIsShowSider} />

      {/* Phần phải */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col sm:flex-row h-[80px] items-center justify-between mb-1">
          <MonthPicker
            month={selectedMonth}
            year={selectedYear}
            onChangeMonth={setSelectedMonth}
            onChangeYear={setSelectedYear}
            isShowSider={isShowSider}
          />
          <div className="inline-flex justify-between w-[220px]">
            <UpdateButton dataUpdate={attendanceEditData} />
            <DownloadButton  
              attendanceData={attendanceData}
              employeeId={selectedEmployee?._id}
              employeeName={selectedEmployee?.username}
              month={selectedMonth}
              year={selectedYear}
            />
          </div>

        </div>

        {selectedEmployee && (
          <>
            <AttendanceSummary
              attendanceData={attendanceData}
            />
            <AttendanceTable
              onChangeAttendanceData={setAttendanceEditData}
              employeeId={selectedEmployee._id}
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
