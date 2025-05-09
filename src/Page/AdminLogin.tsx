import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import Modal from './Modal'

function Login() {
  const [usercode, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const handleLogin = async() => {
    if (usercode.trim()&& password.trim()) {
      try {
        const data = {
          usercode: usercode,
          password: password
        };
        const res = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const resData = await res.json()
        if (res.ok) {
          setUser(resData.user);
          navigate('/statistics');
        } else {
          setIsModalOpen(true);
        }
      } catch (error) {
        setIsModalOpen(true);
      }
  }  
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <img src="https://susmiraikougyou89-jp.com/wp-content/uploads/2019/05/logo3.png" alt="" className="w-4/5 sm:w-2/3 md:w-1/2 lg:w-1/3 mb-4"/>
      
      <input
        type="text"
        name='usercode'
        value={usercode}
        onChange={(e) => setName(e.target.value)}
        placeholder="社員番号"
        className="border p-2 rounded w-full max-w-sm mb-4"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="パスワード"
        className="border p-2 rounded w-full max-w-sm"
      />
      <button
        onClick={handleLogin}
       className="mt-4 bg-[#ff5316] text-white px-4 py-2 rounded hover:bg-[#ff5316] cursor-pointer"
        
      >
        ログイン
      </button>

      {/* Modal khi login fail */}
      <Modal
        isOpen={isModalOpen}
        title="ログイン失敗"
        msg="社員番号またはパスワードが間違っています。"
        onClose={closeModal}
      />
    </div>
  );
}

export default Login;
