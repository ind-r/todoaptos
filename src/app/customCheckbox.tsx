export default function CustomCheckox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center cursor-pointer">
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div
        className={`w-10 h-6 rounded-full shadow-inner transition-colors duration-200 ease-in-out flex items-center justify-center
          ${checked ? "bg-green-300" : "bg-gray-300"}`}
      >
        <div
          className={` w-6 h-6 flex items-center justify-center text-white 
          ${checked ? "right-0" : "left-0"} transition-transform duration-200 ease-in-out`}
        >
          {checked ? "✔" : ""}
        </div>
      </div>
    </label>
  );
}
