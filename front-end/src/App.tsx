import { useEffect, useState, useRef, useCallback } from "react";

// Services
import { getGraphData } from "./services/api.ts";

// Components
import { PrefillFormModal } from "./layout/PrefillFormModal.tsx";

// Utils
import DAG from "./utils/dag.ts";

function App() {
  const [graph, setGraph] = useState<DAG | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  const [forceUpdateCounter, setForceUpdateCounter] = useState(0);
  const triggerGraphUpdate = useCallback(() => {
    setForceUpdateCounter((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const loadGraphData = async () => {
      try {
        const graphData = await getGraphData();
        const initializedGraph = new DAG(graphData, triggerGraphUpdate);
        setGraph(initializedGraph);
      } catch {
        console.error("Failed to fetch data from the server.");
      }
    };

    loadGraphData();
  }, [triggerGraphUpdate]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {graph &&
        graph.traverse().map((formNode) => (
          <button
            key={formNode.nodeData.id}
            onClick={() => {
              setSelectedFormId(formNode.nodeData.id);
              modalRef.current?.showModal();
            }}
          >
            {formNode.nodeData.data.name}
          </button>
        ))}

      <dialog ref={modalRef}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {graph && selectedFormId && (
            <PrefillFormModal
              dag={graph}
              forceUpdate={forceUpdateCounter}
              prefillFormId={selectedFormId}
            />
          )}
          <button onClick={() => modalRef.current?.close()}>Close</button>
        </div>
      </dialog>
    </div>
  );
}

export default App;
