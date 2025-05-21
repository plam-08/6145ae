import { MdCancel } from "react-icons/md";

interface PrefilledFieldProps {
  fieldName: string;
  value: { form_name: string };
  onClearPrefill: (fieldName: string) => void;
  updateKey: number;
}

export const PrefilledField = ({
  fieldName,
  value,
  onClearPrefill,
  updateKey,
}: PrefilledFieldProps) => {
  return (
    <div
      key={`${fieldName}-${updateKey}`}
      style={{
        display: "flex",
        gap: 10,
        backgroundColor: "#EBEBEB",
        padding: 5,
        borderRadius: 5,
        alignItems: "center",
      }}
    >
      {fieldName}: {value.form_name}
      <button
        style={{
          display: "flex",
          border: "none",
          marginLeft: "auto",
          padding: 0,
          background: "none",
          cursor: "pointer",
        }}
        onClick={() => onClearPrefill(fieldName)}
      >
        <MdCancel />
      </button>
    </div>
  );
};
