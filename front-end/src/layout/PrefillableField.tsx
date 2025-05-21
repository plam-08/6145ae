import { GoDatabase } from "react-icons/go";

export const PrefillableField = ({
  keyName,
  openPrefillDialog,
  forceUpdate,
}) => {
  return (
    <button
      key={`${keyName}-${forceUpdate}`}
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        background: "#EBEBEB",
        border: "1.5px dashed #D5D5D5",
        boxSizing: "border-box",
        gap: 5,
        padding: 5,
        borderRadius: 5,
      }}
      onClick={() => openPrefillDialog(keyName)}
    >
      <GoDatabase />
      {keyName}
    </button>
  );
};
