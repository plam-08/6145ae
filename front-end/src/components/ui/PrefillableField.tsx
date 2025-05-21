import { GoDatabase } from "react-icons/go";

interface PrefillableFieldProps {
  name: string;
  onClick: () => void;
}

export const PrefillableField = ({ name, onClick }: PrefillableFieldProps) => {
  return (
    <button
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#EBEBEB",
        border: "1.5px dashed #D5D5D5",
        boxSizing: "border-box",
        gap: 5,
        padding: 5,
        borderRadius: 5,
        alignItems: "center",
      }}
      onClick={onClick}
    >
      <GoDatabase />
      {name}
    </button>
  );
};
