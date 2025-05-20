import { useRef } from "react";
import { GoDatabase } from "react-icons/go";
import { MdCancel } from "react-icons/md";
import type DAG from "../utils/dag";

export const PrefillFormModal = (props: {
  dag: DAG;
  prefillFormId: string;
  forceUpdate?: number; // Adding forceUpdate prop to trigger re-renders
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Get the current node and its form properties
  const node = props.dag.getNode(props.prefillFormId);
  const formProperties = node?.formData?.field_schema.properties || {};

  return (
    <>
      <h3>Prefill</h3>
      <p>Prefill fields for this form</p>
      {Object.entries(formProperties).map(([key, value], index) => {
        return value == null ? (
          <button
            key={`${key}-${index}-${props.forceUpdate}`} // Add forceUpdate to key for proper re-rendering
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
            onClick={() => {
              dialogRef.current?.showModal();
            }}
          >
            <GoDatabase />
            {key}
          </button>
        ) : (
          <div
            key={`${key}-${index}-${props.forceUpdate}`} // Add forceUpdate to key for proper re-rendering
            style={{
              display: "flex",
              gap: 10,
              background: "#EBEBEB",
              padding: 5,
              borderRadius: 5,
            }}
          >
            {key}: {value.form_name}
            <button
              style={{
                display: "flex",
                border: "none",
                margin: "auto 0 auto auto",
                padding: 0,
              }}
              onClick={() => {
                props.dag.setFieldValueToNull(props.prefillFormId, key);
              }}
            >
              <MdCancel />
            </button>
          </div>
        );
      })}

      <dialog ref={dialogRef}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <h3>Select data element to map</h3>
          <details open="">
            <summary>Form A</summary>
            <fieldset>
              <label>
                <input type="radio" name="radio-group" value="option1" />
                Pick your poison: Option 1
              </label>
              <br />
              <label>
                <input type="radio" name="radio-group" value="option2" />
                Pick your poison: Option 2
              </label>
            </fieldset>
          </details>
          <details open="">
            <summary>Form A</summary>
            <fieldset>
              <label>
                <input type="radio" name="radio-group" value="option1" />
                Pick your poison: Option 1
              </label>
              <br />
              <label>
                <input type="radio" name="radio-group" value="option2" />
                Pick your poison: Option 2
              </label>
            </fieldset>
          </details>
          <button onClick={() => dialogRef.current?.close()}>Close</button>
          <button onClick={() => dialogRef.current?.close()} disabled={true}>
            Select
          </button>
        </div>
      </dialog>
    </>
  );
};
