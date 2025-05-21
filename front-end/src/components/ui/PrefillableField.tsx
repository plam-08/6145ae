import { GoDatabase } from "react-icons/go";

interface PrefillableFieldProps {
  fieldName: string;
  onOpenPrefillDialog: (fieldName: string) => void;
  updateKey: number;
}

export const PrefillableField = ({
  fieldName,
  onOpenPrefillDialog,
  updateKey,
}: PrefillableFieldProps) => {
  return (
    <button
      key={`${fieldName}-${updateKey}`}
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
      onClick={() => onOpenPrefillDialog(fieldName)}
    >
      <GoDatabase />
      {fieldName}
    </button>
  );
};
