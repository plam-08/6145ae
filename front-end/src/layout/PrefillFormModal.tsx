import { useRef, useState, type SetStateAction } from "react";
import type DAG from "../utils/dag";
import type { Node } from "../utils/dag";

import { PrefillSelectionModal } from "./PrefillSelectionModal";
import { PrefillableField } from "../components/ui/PrefillableField";
import { PrefilledField } from "../components/ui/PrefilledField";

interface PrefillFormModalProps {
  dag: DAG;
  prefillFormId: string;
  forceUpdate?: number;
}

export const PrefillFormModal = ({
  dag,
  forceUpdate,
  prefillFormId,
}: PrefillFormModalProps) => {
  const selectionDialogRef = useRef<HTMLDialogElement>(null);

  const [sourceNodes, setSourceNodes] = useState<Node[]>([]);
  const [activeFieldName, setActiveFieldName] = useState<string | null>(null);

  const currentNode = dag.getNode(prefillFormId);
  const formFields = currentNode?.formData?.field_schema.properties;

  // Open dialog to select a node to prefill the field
  const handleOpenPrefillDialog = (
    fieldName: SetStateAction<string | null>,
  ) => {
    selectionDialogRef.current?.showModal();
    setSourceNodes(dag.getNodesThatCanReach(prefillFormId));
    setActiveFieldName(fieldName);
  };

  // Clear an existing prefill value
  const handleClearPrefill = (fieldName: string) => {
    dag.setFieldValueToNull(prefillFormId, fieldName);
  };

  // Handle field selection submission
  const handleSubmitSelection = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    for (const [sourceNodeId, selectedFieldKey] of formData.entries()) {
      if (activeFieldName == null) return;
      if (typeof selectedFieldKey !== "string") return;

      dag.setFieldValue(
        prefillFormId,
        activeFieldName,
        sourceNodeId,
        selectedFieldKey,
      );
    }

    selectionDialogRef.current?.close();
  };

  return (
    <>
      <h3>Prefill</h3>
      <p>Prefill fields for this form</p>

      {formFields &&
        Object.entries(formFields).map(([fieldName, fieldValue], index) => (
          <div key={index}>
            {fieldValue == null ? (
              <PrefillableField
                name={fieldName}
                onClick={() => handleOpenPrefillDialog(fieldName)}
              />
            ) : (
              <PrefilledField
                name={`${fieldName}: ${fieldValue.form_name}`}
                onClick={() => handleClearPrefill(fieldName)}
              />
            )}
          </div>
        ))}

      <PrefillSelectionModal
        dialogRef={selectionDialogRef}
        nodeCanReachPrefillFormId={sourceNodes}
        handleSubmit={handleSubmitSelection}
      />
    </>
  );
};
