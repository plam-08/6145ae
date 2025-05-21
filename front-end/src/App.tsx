import { useEffect, useState, useRef, useCallback } from "react";
import { getGraphData, type GraphDataResponse } from "./services/api.ts";
import { PrefillFormModal } from "./layout/PrefillFormModal.tsx";
import DAG from "./utils/dag.ts";

function App() {
  const [dag, setDag] = useState<DAG | null>(null);
  const [currentPrefillFormId, setCurrentPrefillFormId] = useState<
    string | null
  >(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  // State to force re-renders when DAG is updated
  const [updateCounter, setUpdateCounter] = useState(0);

  // Callback to trigger re-render when DAG is updated
  const handleDagUpdate = useCallback(() => {
    setUpdateCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getGraphData({
          tenantId: "your-tenant-id",
          blueprintVersionId: "your-blueprint-version-id",
        });
        // Pass the update callback to the DAG constructor
        const newDag = new DAG(data, handleDagUpdate);
        setDag(newDag);
      } catch {
        console.error("Failed to fetch data from the server.");
      }
    };
    fetchInitialData();
  }, [handleDagUpdate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {dag &&
        dag.traverse().map((node) => (
          <button
            key={node.nodeData.id}
            onClick={() => {
              setCurrentPrefillFormId(node.nodeData.id);
              dialogRef.current?.showModal();
            }}
          >
            {node.nodeData.data.name}
          </button>
        ))}
      <dialog ref={dialogRef}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {dag && currentPrefillFormId && (
            <PrefillFormModal
              dag={dag}
              forceUpdate={updateCounter}
              prefillFormId={currentPrefillFormId}
            />
          )}
          <button onClick={() => dialogRef.current?.close()}>Close</button>
        </div>
      </dialog>
    </div>
  );
}

export default App;
