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
  prefillFormId,
  forceUpdate,
}: PrefillFormModalProps) => {
  const selectionDialogRef = useRef<HTMLDialogElement>(null);

  const [sourceNodes, setSourceNodes] = useState<Node[]>([]);
  const [activeFieldName, setActiveFieldName] = useState<string | null>(null);

  const currentNode = dag.getNode(prefillFormId);
  const formFields = currentNode?.formData?.field_schema.properties || {};

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

      {Object.entries(formFields).map(([fieldName, fieldValue], index) =>
        fieldValue == null ? (
          <PrefillableField
            key={`prefillable-${fieldName}-${index}`}
            fieldName={fieldName}
            onOpenPrefillDialog={handleOpenPrefillDialog}
            updateKey={forceUpdate ?? 0}
          />
        ) : (
          <PrefilledField
            key={`prefilled-${fieldName}-${index}`}
            fieldName={fieldName}
            value={fieldValue}
            onClearPrefill={handleClearPrefill}
            updateKey={forceUpdate ?? 0}
          />
        ),
      )}

      <PrefillSelectionModal
        dialogRef={selectionDialogRef}
        nodeCanReachPrefillFormId={sourceNodes}
        handleSubmit={handleSubmitSelection}
      />
    </>
  );
};
