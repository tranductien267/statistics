import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  msg: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, msg, onClose }) => {
  if (!isOpen) return null; // Nếu modal không mở thì không render gì cả

  return (
    <div className="fixed z-10 inset-0 flex items-center justify-center">
      <div className="bg-black text-white p-6 rounded-lg shadow-xl w-96 transform transition-all scale-95 hover:scale-100 border border-gray-700">
        <div className="text-center border-b-2 border-[#ff5316] pb-4 mb-4">
          <h2 className="text-2xl font-semibold text-[#ff5316]">{title}</h2>
        </div>
        <div className="text-center">
          <p className="mt-2 text-gray-300">{msg}</p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition duration-200 ease-in-out cursor-pointer"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
