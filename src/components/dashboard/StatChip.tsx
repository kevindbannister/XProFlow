type StatChipProps = {
  label: string;
};

const StatChip = ({ label }: StatChipProps) => {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-600">
      {label}
    </span>
  );
};

export default StatChip;
