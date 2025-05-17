// src/components/MonthPicker.tsx
interface MonthPickerProps {
  month: number;
  year: number;
  onChangeMonth: (m: number) => void;
  onChangeYear: (y: number) => void;
  isShowSider:boolean
}

const MonthPicker = ({ month, year, onChangeMonth, onChangeYear,isShowSider }: MonthPickerProps) => {
  return (
    <div className="flex items-center space-x-2">
      {!isShowSider && (
      <select
        className="border rounded p-1 ml-10"
        value={month}
        onChange={(e) => onChangeMonth(Number(e.target.value))}
      >
        {[...Array(12)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</option>
        ))}
      </select>
      )}
      {isShowSider && (
      <select
        className="border rounded p-1"
        value={month}
        onChange={(e) => onChangeMonth(Number(e.target.value))}
      >
        {[...Array(12)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</option>
        ))}
      </select>
      )}
      <input
        type="number"
        className="border rounded p-1 w-24"
        value={year}
        onChange={(e) => onChangeYear(Number(e.target.value))}
      />
    </div>
  );
};

export default MonthPicker;
