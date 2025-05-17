import React,{ useEffect,useState } from "react";

interface SidebarProps {
  onSelectEmployee: (id: string) => void;
  selectedEmployeeId?: string;
  onSidebarChange: (y: boolean) => void;
}

interface Employee {
  _id: string,
  usercode:string,
  username:string
};
const Sidebar = ({ onSelectEmployee,onSidebarChange, selectedEmployeeId }: SidebarProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/api/users")
      .then((res) => res.json())
      .then(setEmployees);
  }, []);
  
  return (
    <>
      {/* Nút toggle khi ẩn sidebar */}
      {!isOpen && (
        <button
          onClick={() => {onSidebarChange(true) ;setIsOpen(true)}}
          className="fixed top-4 left-2 z-50 bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600"
        >
          ☰
        </button>
      )}
      <div className={`bg-gray-100 h-full transition-all duration-300 ${isOpen ? "w-60 p-4" : "w-0 p-0 overflow-hidden"}`}>
      {isOpen && (
      <div className="relative h-full">
      {/* Nút toggle khi sidebar đang mở */}
      <button
        onClick={() =>  {onSidebarChange(false) ;setIsOpen(false)}}
        className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 rounded shadow hover:bg-blue-600"
      >
        ☰
      </button>
      <h2 className="font-bold text-lg mb-4">社員</h2>
      <ul className="space-y-2">
        {employees.map((emp) => {
          const isSelected = emp._id === selectedEmployeeId;
          return (
            <li
              key={emp._id}
              className={`cursor-pointer p-2 pl-3 rounded-r transition-all border-l-4
                ${isSelected
                  ? "bg-blue-100 text-blue-700 font-semibold border-blue-500 underline"
                  : "hover:bg-blue-50 border-transparent"}
              `}
              onClick={() => onSelectEmployee(emp._id)}
            >
              {emp.username}
            </li>
          );
        })}
      </ul>
      </div>
        )}
    </div>
    </>
  );
};

export default Sidebar;
