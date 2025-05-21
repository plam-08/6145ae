import { MdCancel } from "react-icons/md";

export const PrefilledField = ({
  keyName,
  value,
  clearPrefill,
  forceUpdate,
}) => {
  return (
    <div
      key={`${keyName}-${forceUpdate}`}
      style={{
        display: "flex",
        gap: 10,
        background: "#EBEBEB",
        padding: 5,
        borderRadius: 5,
      }}
    >
      {keyName}: {value.form_name}
      <button
        style={{
          display: "flex",
          border: "none",
          margin: "auto 0 auto auto",
          padding: 0,
        }}
        onClick={() => clearPrefill(keyName)}
      >
        <MdCancel />
      </button>
    </div>
  );
};
