import { useRef, useState } from "react";
import { GoDatabase } from "react-icons/go";
import { MdCancel } from "react-icons/md";
import type DAG from "../utils/dag";
import type { Node } from "../utils/dag";

export const PrefillFormModal = (props: {
  dag: DAG;
  prefillFormId: string;
  forceUpdate?: number; // Adding forceUpdate prop to trigger re-renders
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [nodeCanReachPrefillFormId, setNodeCanReachPrefillFormId] = useState<
    Node[]
  >([]);
  const [keyNamePrefillFormId, setKeyNamePrefillFormId] = useState<
    string | null
  >(null);

  // Get the current node and its form properties
  const node = props.dag.getNode(props.prefillFormId);
  const formProperties = node?.formData?.field_schema.properties || {};

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    for (const [nodeId, selectedKey] of formData.entries()) {
      props.dag.setFieldValue(
        props.prefillFormId,
        keyNamePrefillFormId,
        nodeId,
        selectedKey as string,
      );
    }
    dialogRef.current?.close();
  }

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
              setNodeCanReachPrefillFormId(
                props.dag.getNodesThatCanReach(props.prefillFormId),
              );
              setKeyNamePrefillFormId(key);
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
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {nodeCanReachPrefillFormId.map((node: Node, index: number) => (
                <details key={index}>
                  <summary>{node.nodeData.data.name}</summary>
                  <fieldset>
                    {Object.keys(
                      node.formData?.field_schema?.properties || {},
                    ).map((key: string) => (
                      <label key={key} style={{ display: "block" }}>
                        <input
                          type="radio"
                          name={node.nodeData.id}
                          value={key}
                        />
                        {key}
                      </label>
                    ))}
                  </fieldset>
                </details>
              ))}
              <input
                type="submit"
                value="Select"
                style={{ display: "block" }}
              />
              <input
                onClick={() => dialogRef.current?.close()}
                type="button"
                value="Cancel"
              />
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};
