import { useRef, useState, type SetStateAction } from "react";
import type DAG from "../utils/dag";
import type { Node } from "../utils/dag";
import { PrefillableField } from "./PrefillableField";
import { PrefilledField } from "./PrefilledField";
import { PrefillSelectionModal } from "./PrefillSelectionModal";

export const PrefillFormModal = (props: {
  dag: DAG;
  prefillFormId: string;
  forceUpdate?: number;
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [nodeCanReachPrefillFormId, setNodeCanReachPrefillFormId] = useState<
    Node[]
  >([]);
  const [keyNamePrefillFormId, setKeyNamePrefillFormId] = useState<
    string | null
  >(null);

  const node = props.dag.getNode(props.prefillFormId);
  const formProperties = node?.formData?.field_schema.properties || {};

  // Open the dialog to select data for prefilling
  const openPrefillDialog = (keyName: SetStateAction<string | null>) => {
    dialogRef.current?.showModal();
    setNodeCanReachPrefillFormId(
      props.dag.getNodesThatCanReach(props.prefillFormId),
    );
    setKeyNamePrefillFormId(keyName);
  };

  // Clear a prefilled field
  const clearPrefill = (keyName: string) => {
    props.dag.setFieldValueToNull(props.prefillFormId, keyName);
  };

  // Handle form submission
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    for (const [nodeId, selectedKey] of formData.entries()) {
      if (keyNamePrefillFormId == null) return;
      if (typeof selectedKey !== "string") return;
      props.dag.setFieldValue(
        props.prefillFormId,
        keyNamePrefillFormId,
        nodeId,
        selectedKey,
      );
    }
    dialogRef.current?.close();
  }

  return (
    <>
      <h3>Prefill</h3>
      <p>Prefill fields for this form</p>

      {Object.entries(formProperties).map(([key, value], index) =>
        value == null ? (
          <PrefillableField
            key={`prefillable-${key}-${index}`}
            keyName={key}
            openPrefillDialog={openPrefillDialog}
            forceUpdate={props.forceUpdate}
          />
        ) : (
          <PrefilledField
            key={`prefilled-${key}-${index}`}
            keyName={key}
            value={value}
            clearPrefill={clearPrefill}
            forceUpdate={props.forceUpdate}
          />
        ),
      )}

      <PrefillSelectionModal
        dialogRef={dialogRef}
        nodeCanReachPrefillFormId={nodeCanReachPrefillFormId}
        handleSubmit={handleSubmit}
      />
    </>
  );
};
