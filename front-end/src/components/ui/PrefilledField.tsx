import { MdCancel } from "react-icons/md";

interface PrefilledFieldProps {
  name: string;
  onClick: () => void;
}

export const PrefilledField = ({ name, onClick }: PrefilledFieldProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        backgroundColor: "#EBEBEB",
        padding: 5,
        borderRadius: 5,
        alignItems: "center",
      }}
    >
      {name}
      <button
        style={{
          display: "flex",
          border: "none",
          marginLeft: "auto",
          padding: 0,
          background: "none",
          cursor: "pointer",
        }}
        onClick={() => onClick()}
      >
        <MdCancel />
      </button>
    </div>
  );
};
