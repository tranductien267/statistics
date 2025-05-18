// // src/components/AttendanceTable.tsx
// import { useEffect, useState } from "react";
// import { getDaysInMonth, AttendanceEntry, getWeekdayName, calculateOvertimeHours } from "../utils/timeUtils";

// interface Props {
//   employeeId: string;
//   month: number;
//   year: number;
//   onDataLoaded: (data: AttendanceEntry[]) => void;
// }

// const AttendanceTable = ({ employeeId, month, year ,onDataLoaded}: Props) => {
//   const [data, setData] = useState<AttendanceEntry[]>([]);

//   useEffect(() => {
//     // Mock data – có thể thay bằng API fetch
//     const fetchData = async () => {
//       try {
//         const queryParams ="userId=" + employeeId + "&year=" + year + "&month=" + month
//         const response = await fetch(process.env.REACT_APP_API_URL +  "/api/timesheetByUser?" + queryParams);
//         const data = await response.json();
//         setData(data);
//         onDataLoaded(data)
//       } catch (error) {
//         console.error("Lỗi khi lấy dữ liệu:", error);
//       }
//     };
//     fetchData();

//   }, [employeeId, month, year]);

//   const days = getDaysInMonth(month, year);

//   return (
//     <div className="overflow-auto">
//       <table className="w-full border border-gray-300">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border px-2 py-1">日付</th>
//             <th className="border px-2 py-1">曜日</th>
//             <th className="border px-2 py-1">始業時間</th>
//             <th className="border px-2 py-1">終業時間</th>
//             <th className="border px-2 py-1">残業</th>
//             <th className="border px-2 py-1">内容</th>
//             <th className="border px-2 py-1">現場</th>
//           </tr>
//         </thead>
//         <tbody>
//           {days.map((day:string) => {
//             const record = data.find((r) => r.date.split('T')[0] === day);
//             return (
//               <tr key={day} className="text-center">
//                 <td className="border px-2 py-1">{day.split("-")[2]}</td>
//                 <td className="border px-2 py-1">{getWeekdayName(day)}</td>
//                 <td className="border px-2 py-1">{record?.startTime || "-"}</td>
//                 <td className="border px-2 py-1">{record?.endTime || "-"}</td>
//                 <td className="border px-2 py-1">
//                   {record ? calculateOvertimeHours(record.startTime, record.endTime) : "-"}
//                 </td>
//                 <td className="border px-2 py-1">{record?.task || "-"}</td>
//                 <td className="border px-2 py-1">{record?.location || "-"}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default AttendanceTable;
import { useEffect, useState } from "react";
import {
  getDaysInMonth,
  AttendanceEntry,
  getWeekdayName,
  calculateOvertimeHours,
} from "../utils/timeUtils";

interface Props {
  onChangeAttendanceData:(ar:AttendanceEntry[]) =>void;
  employeeId: string;
  month: number;
  year: number;
  onDataLoaded: (data: AttendanceEntry[]) => void;
}

const AttendanceTable = ({ onChangeAttendanceData,employeeId, month, year, onDataLoaded }: Props) => {
  const [data, setData] = useState<AttendanceEntry[]>([]);
  const [editedData, setEditedData] = useState<AttendanceEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryParams = `userId=${employeeId}&year=${year}&month=${month}`;
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/timesheetByUser?${queryParams}`);
        const fetchedData = await response.json();
        setData(fetchedData);
        setEditedData(fetchedData); // khởi tạo editedData giống data
        onDataLoaded(fetchedData);
      } catch (error) {
        console.error("get data error:", error);
      }
    };
    fetchData();
  }, [employeeId, month, year]);

  const handleChange = (date: string, field: keyof AttendanceEntry, value: string) => {
    const updated = editedData.map((entry) =>
      entry.date.startsWith(date)
        ? { ...entry, [field]: value }
        : entry
    );
    setEditedData(updated);
    onChangeAttendanceData(updated);
  };

  // const handleUpdate = async () => {
  //   try {
  //     const response = await fetch(`${process.env.REACT_APP_API_URL}/api/updateTimesheet`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(editedData),
  //     });

  //     if (!response.ok) throw new Error("update failed!!");
  //     setTitle('更新完了');
  //     setMsg('勤務時間の更新が完了しました。');
  //     setIsModalOpen(true);
  //   } catch (error) {
  //     console.error("error:", error);
  //     setTitle('更新失敗');
  //     setMsg('勤怠更新に失敗しました。');
  //     setIsModalOpen(true);
  //   }
  // };

  const days = getDaysInMonth(month, year);

  return (
    <div className="overflow-auto">
      <table className="w-full border border-gray-300 mb-4">
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
          {days.map((day) => {
            const record = editedData.find((r) => r.date.startsWith(day));
            return (
              <tr key={day} className="text-center">
                <td className="border px-2 py-1">{day.split("-")[2]}</td>
                <td className="border px-2 py-1">{getWeekdayName(day)}</td>
                <td className="border px-2 py-1">
                  <input
                    value={record?.startTime || ""}
                    onChange={(e) => handleChange(day, "startTime", e.target.value)}
                    className="w-full border-none text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    value={record?.endTime || ""}
                    onChange={(e) => handleChange(day, "endTime", e.target.value)}
                    className="w-full border-none text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  {record ? calculateOvertimeHours(record.startTime, record.endTime) : "-"}
                </td>
                <td className="border px-2 py-1">
                  <input
                    value={record?.task || ""}
                    onChange={(e) => handleChange(day, "task", e.target.value)}
                    className="w-full border-none text-center"
                  />
                </td>
                <td className="border px-2 py-1">
                  <input
                    value={record?.location || ""}
                    onChange={(e) => handleChange(day, "location", e.target.value)}
                    className="w-full border-none text-center"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* <div className="text-right">
        <button
          onClick={handleUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          更新
        </button>
      </div> */}
    </div>
  );
};

export default AttendanceTable;
