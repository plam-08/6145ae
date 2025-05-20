import { useRef } from "react";
import { GoDatabase } from "react-icons/go";
import { MdCancel } from "react-icons/md";
import type { GraphDataResponse } from "../services/api";

export const PrefillModal = (props: {
  properties: GraphDataResponse["forms"][number]["field_schema"]["properties"];
  graphData: GraphDataResponse;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <h3>Prefill</h3>
      <p>Prefill fields for this form</p>

      {Object.entries(props.properties).map(([key, value], index) =>
        value == null ? (
          <button
            key={index}
            style={{
              display: "flex",
              flexDirection: "row",
              width: "100%",
              margin: "5px 0",
              background: "#EBEBEB",
              border: "2px dashed #D5D5D5",
              boxSizing: "border-box",
              gap: 5,
              padding: 5,
              borderRadius: 5,
            }}
            onClick={() => {
              dialogRef.current?.showModal();
            }}
          >
            <GoDatabase />
            {key}
          </button>
        ) : (
          <div
            key={index}
            style={{
              display: "flex",
              gap: 10,
              background: "#EBEBEB",
              padding: 5,
              borderRadius: 5,
              margin: "5px 0",
            }}
          >
            {key}: {"Form A.email"}
            <button
              style={{
                display: "flex",
                border: "none",
                margin: "auto 0 auto auto",
                padding: 0,
              }}
              onClick={() => dialogRef.current?.showModal()}
            >
              <MdCancel />
            </button>
          </div>
        ),
      )}

      <dialog ref={dialogRef}>
        {props.graphData.forms.map((form, index: number) => (
          <details key={index}>
            <summary>{form.id}</summary>
            {Object.entries(form.field_schema.properties).map(
              ([key, value]) => (
                <button
                  style={{ display: "block", margin: 5 }}
                  onClick={() => console.log(value)}
                >
                  {key}
                </button>
              ),
            )}
          </details>
        ))}
        <button
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          close
        </button>
      </dialog>
    </>
  );
};
