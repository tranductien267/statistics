import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal'

function Timesheet() {
  const navigate = useNavigate();
  const today = new Date();
  const defaultDateValue = today.toISOString().split('T')[0];
  const [workDate, setWorkDate] = useState(defaultDateValue);
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [task, setTask] = useState('');
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [title,setTitle] = useState('')
  const [msg,setMsg] = useState('')
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setMsg('');
  };
  const handleLogout = () => {
    // localStorage.removeItem('token'); // hoặc sessionStorage, cookie tùy bạn
    window.location.href = '/login';  // chuyển hướng về trang login
  };
  const handleSubmit = async () => {
    if (!user) {
      setTitle('未ログイン');
      setMsg('勤務打刻のため、再度ログインしてください。');
      setIsModalOpen(true);
      return;
    }
    if (!location || !startTime || !endTime || !task) {
      setTitle('未入力');
      setMsg('必須項目を入力してください。');
      setIsModalOpen(true);
      return;
    }

    const data = {
      userId:user?._id,
      date: workDate,
      location,
      startTime,
      endTime,
      task,
    };

    try {
      console.log(data.date);
      const res = await fetch(process.env.REACT_APP_API_URL + '/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsSuccessModalOpen(true)
      } else {
        setTitle('登録失敗');
        setMsg('勤怠登録に失敗しました。');
        setIsModalOpen(true);
      }
    } catch (error) {
      setTitle('登録失敗');
      setMsg('勤怠登録に失敗しました。');
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg text-sm">
    {/* Hiển thị avatar + tên người dùng */}
    {user && (
      <div className="flex items-center gap-3 mb-4 p-1 border rounded bg-orange-50 shadow-sm relative">
        <img
          src={"https://i.pravatar.cc/42"} // fallback ảnh avatar
          alt="Avatar"
          className="w-10 h-10 rounded-full border"
        />
        <span className="text-base font-semibold text-gray-800">{user.username}</span>
        <span  onClick={handleLogout} className=" absolute right-2 text-sm text-right font-medium underline cursor-pointer">サインアウト</span>
      </div>
    )}
    <h1 className="text-3xl font-bold text-center text-[#ff5316] mb-6">🕒 勤怠打刻</h1>
  
    <div className="mb-5">
      <label className="block text-lg font-medium text-gray-700 mb-2">📅 勤務日</label>
      {/* <div className="p-3 bg-gray-100 rounded-md text-gray-800 font-medium">{dateToday}</div> */}
      <input
        type="date"
        value={workDate}
        onChange={(e) => setWorkDate(e.target.value)}
        className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-[#ff5316] focus:border-[#ff5316] transition duration-300"
      />
    </div>
  
    <div className="mb-5">
      <label className="block text-lg font-medium text-gray-700 mb-2">📍 場所名</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="勤務地入力。。。"
        className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-[#ff5316] focus:border-[#ff5316] transition duration-300"
      />
    </div>
  
    <div className="mb-5">
      <label className="block text-lg font-medium text-gray-700 mb-2">🕘 開始時間</label>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-[#ff5316] focus:border-[#ff5316] transition duration-300"
      />
    </div>
  
    <div className="mb-5">
      <label className="block text-lg font-medium text-gray-700 mb-2">🕔 終了時間</label>
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-[#ff5316] focus:border-[#ff5316] transition duration-300"
      />
    </div>
  
    <div className="mb-5">
      <label className="block text-lg font-medium text-gray-700 mb-2">📝 作業内容</label>
      <textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="作業内容入力。。。"
        className="w-full border-2 border-gray-300 p-3 rounded-md focus:ring-[#ff5316] focus:border-[#ff5316] transition duration-300 h-14"
      />
    </div>
  
    <button
      onClick={handleSubmit}
      className="w-full bg-[#ff5316] text-white px-6 py-3 rounded-md hover:bg-[#e14d12] transition duration-300 font-semibold"
    >
      打刻
    </button>
  
    {/* {message && <p className="mt-4 text-center text-[#ff5316]">{message}</p>} */}
    {/* Modal khi login fail */}
    <Modal
      isOpen={isModalOpen}
      title={title}
      msg={msg}
      onClose={closeModal}
    />

{isSuccessModalOpen &&  (
  <div className="fixed inset-0 flex justify-center items-center z-50  bg-white/50 backdrop-blur-sm">
    <div className="bg-white border rounded-xl shadow-lg p-6 w-[90%] max-w-md">
      <div className="text-center border-b-2 border-[#ff5316] pb-4 mb-4">
        <h2 className="text-2xl font-semibold text-[#ff5316]">登録完了</h2>
      </div>
      <ul className="text-sm text-gray-800 space-y-2 border-b-2 border-[#ff5316] pb-4">
        <li><strong>氏名:</strong> {user?.username}</li>
        <li><strong>日付:</strong> {workDate}</li>
        <li><strong>場所名:</strong> {location}</li>
        <li><strong>時間:</strong> {startTime}-{endTime}</li>
        <li><strong>作業内容:</strong> {task}</li>
      </ul>
      <div className="mt-5 flex justify-center gap-3">
        <button
          onClick={() => {
            // Tiến hành các hành động cần thiết sau khi người dùng xác nhận
            setIsSuccessModalOpen(false);
            navigate('/login');
          }}
          className="px-4 py-2 rounded bg-[#ff5316] text-white hover:opacity-90 cursor-pointer"
        >
          終了
        </button>
      </div>
    </div>
  </div>
)}
  </div>
  
  );
}

export default Timesheet;
