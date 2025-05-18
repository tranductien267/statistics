// src/components/UpdateButton.tsx
import React, { useState } from 'react';
import { AttendanceEntry } from "../utils/timeUtils";
import Modal from '../Page/Modal'
interface Props {
  dataUpdate: AttendanceEntry[];
}

const UpdateButton: React.FC<Props> = ({ dataUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [title,setTitle] = useState('')
  const [msg,setMsg] = useState('')
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle('');
    setMsg('');
  };
  const handleUpdate = async () => {
    try {
      console.log(dataUpdate[0])
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/updateTimesheet`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataUpdate),
      });
      if (!response.ok) throw new Error("update failed!!");
      setTitle('更新完了');
      setMsg('勤務時間の更新が完了しました。');
      setIsModalOpen(true);
    } catch (error) {
      console.error("error:", error);
      setTitle('更新失敗');
      setMsg('勤怠更新に失敗しました。');
      setIsModalOpen(true);
    }
  };


  return (
    <div>
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        更新
      </button>
      <Modal
          isOpen={isModalOpen}
          title={title}
          msg={msg}
          onClose={closeModal}
        />
    </div>
  );
};

export default UpdateButton;
