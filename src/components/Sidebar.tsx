import React,{ useEffect,useState } from "react";

interface SidebarProps {
  onSelectEmployee: (id: string) => void;
  selectedEmployeeId?: string;
}

interface Employee {
  _id: string,
  usercode:string,
  username:string
};
const Sidebar = ({ onSelectEmployee, selectedEmployeeId }: SidebarProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL + "/api/users")
      .then((res) => res.json())
      .then(setEmployees);
  }, []);
  
  return (
    <div className="w-60 bg-gray-100 p-4 overflow-y-auto border-r shadow-sm">
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
  );
};

export default Sidebar;
