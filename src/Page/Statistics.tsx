import React, { useState, useEffect, useMemo } from 'react';
import { useTable, Column } from 'react-table';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Modal from './Modal'

interface Timesheet {
  date: string;
  userCode: string;
  userName: string;
  startTime: string;
  endTime: string;
  taskContent: string;
}


const TimesheetPage: React.FC = () => {
  const [data, setData] = useState<Timesheet[]>([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [userCode, setUserCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [title,setTitle] = useState('')
  const [msg,setMsg] = useState('')
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setMsg('');
  };
  const handleLogout = () => {
    // localStorage.removeItem('token'); // hoặc sessionStorage, cookie tùy bạn
    window.location.href = '/admin-login';  // chuyển hướng về trang login
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(process.env.REACT_APP_API_URL + '/api/timesheet?startDate=2025-05-09&endDate=2025-05-09&page=1&limit=10');
      const result = await res.json();
      const arrayResult = result.timesheets
      const arrayTimesheet : Timesheet[] = []
      if (Array.isArray(arrayResult)) {
        for (const item of arrayResult) {
          const defaltData : Timesheet = {
            date: item.date.split('T')[0],
            userCode: item.userId.usercode,
            userName: item.userId.username,
            startTime: item.startTime,
            endTime: item.endTime,
            taskContent: item.task
          }
          arrayTimesheet.push(defaltData)
        }

        setData(arrayTimesheet);
      } else {
        console.error('Invalid data format:', result);
      }
    };

    fetchData();
  }, []);

  // ✅ useMemo để tránh re-render không cần thiết gây lỗi
  const columns: Column<Timesheet>[] = useMemo(() => [
    { Header: '日付', accessor: 'date' },
    { Header: 'ユーザーコード', accessor: 'userCode' },
    { Header: 'ユーザー名', accessor: 'userName' },
    { Header: '開始時間', accessor: 'startTime' },
    { Header: '終了時間', accessor: 'endTime' },
    { Header: '作業内容', accessor: 'taskContent' },
  ], []);

  const memoizedData = useMemo(() => data, [data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable({ columns, data: memoizedData });

  const exportToExcel = () => {
    // Map dữ liệu với tên cột tiếng Nhật
    const exportData = data.map(item => ({
      '日付': item.date,
      'ユーザーコード': item.userCode,
      'ユーザー名': item.userName,
      '開始時間': item.startTime,
      '終了時間': item.endTime,
      '作業内容': item.taskContent,
    }));
  
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Timesheet');
  
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  
    saveAs(file, '勤怠表.xlsx');
  };
  const handleSearch = async() => {
    // Gửi request lọc hoặc filter local từ dữ liệu đã fetch
    if (!startTime && !endTime) {
      setTitle('検索条件入力');
      setMsg('検索期間を入力してください');
      setIsModalOpen(true);
      return;
    }
    let queryParam:string = "&";
    if (userCode) {
      queryParam += "userCode=" + userCode + "&"; 
    }
    console.log(startTime + "-" + endTime)
    queryParam += "startDate=" +  startTime + "&"; 
    queryParam += "endDate=" +  endTime + "&"; 
    queryParam += "page=1&limit=10"
    const res = await fetch(process.env.REACT_APP_API_URL + '/api/timesheet?' + queryParam);
    const result = await res.json();
    const arrayResult = result.timesheets
    const arrayTimesheet : Timesheet[] = []
    if (Array.isArray(arrayResult)) {
      for (const item of arrayResult) {
        const defaltData : Timesheet = {
          date: item.date.split('T')[0],
          userCode: item.userId.usercode,
          userName: item.userId.username,
          startTime: item.startTime,
          endTime: item.endTime,
          taskContent: item.task
        }
        arrayTimesheet.push(defaltData)
      }

      setData(arrayTimesheet);
    } else {
      console.error('Invalid data format:', result);
    }
  };
  return (
<div className="p-6">
<img src="https://susmiraikougyou89-jp.com/wp-content/uploads/2019/05/logo3.png" alt="" className="m-auto w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 mb-4"/>
  {/* <h1 className="text-2xl font-bold text-center mb-6">🕒 勤怠表</h1> */}
  <button
    onClick={handleLogout}
    className="absolute cursor-pointer top-4 right-4 flex items-center gap-2 bg-white text-black border border-gray-300 px-3 py-1.5 rounded-full shadow-md hover:bg-gray-100 transition-all duration-200"
  >
    <span className="text-sm font-medium">サインアウト</span>
  </button>
  <div className="mb-4">
  <button
    onClick={() => setFiltersVisible(prev => !prev)}
    className="bg-[#6EC1E4] hover:bg-[#56A8C1] text-black font-semibold py-2 px-4 rounded-xl shadow-lg transition-all duration-300"
  >
    {filtersVisible ? '🔽 検索バー非表示' : '🔍 検索バー表示'}
  </button>

  <div
    className={`transition-all duration-500 overflow-hidden ${
      filtersVisible ? 'max-h-[350px] opacity-100 mt-4' : 'max-h-0 opacity-0'
    }`}
  >
    <div className="p-2 bg-white border-b border-b-[#ff5316] rounded-xl shadow-lg max-w-6xl mt-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">開始時間</label>
          <input
            type="date"
            placeholder="YYYY"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            className="border border-[#000000] px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6EC1E4] shadow-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">終了時間</label>
          <input
            type="date"
            placeholder="MM"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            className="border border-[#000000] px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6EC1E4] shadow-sm"
          />
        </div>


        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2 text-gray-700">社員番号</label>
          <input
            type="text"
            placeholder="社員番号"
            value={userCode}
            onChange={e => setUserCode(e.target.value)}
            className="border border-[#000000] px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6EC1E4] shadow-sm"
          />
        </div>
        <div className="flex flex-col">
        <label className="text-sm font-medium mb-2 text-gray-700">&nbsp;</label>
        <button
          onClick={handleSearch}
          className="bg-[#333333] hover:bg-[#555555] text-white font-semibold py-2 px-8 rounded-xl shadow-lg transition-all duration-300 cursor-pointer"
        >
          🔎 Tìm kiếm
        </button>
      </div>
      </div>
    </div>
  </div>
</div>


  <div className="overflow-x-auto">
    <table
      {...getTableProps()}
      className="min-w-full table-auto border border-gray-300 rounded shadow-md"
    >
      <thead className="bg-[#209e91]">
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                {...column.getHeaderProps()}
                className="px-4 py-2 border border-gray-300 text-center font-semibold"
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.length === 0 ? (
          <tr>
            <td colSpan={headerGroups[0].headers.length} className="text-center py-4">
              データがありません
            </td>
          </tr>
        ) : (
          rows.map((row,i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.cells.map(cell => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-2 border border-gray-300 text-center"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>

  <div className="flex justify-center mt-6">
    <button
      onClick={exportToExcel}
      className="bg-[#ff5316] hover:bg-[#e04b13] text-white font-semibold py-2 px-6 rounded shadow"
    >
      📥 ダウンロード
    </button>
  </div>
  <Modal
      isOpen={isModalOpen}
      title={title}
      msg={msg}
      onClose={closeModal}
    />
</div>

  );
};

export default TimesheetPage;
