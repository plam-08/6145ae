import { useEffect, useState, useRef } from "react";
import { getGraphData, type GraphDataResponse } from "./services/api.ts";
import { PrefillModal } from "./layout/PrefillModal.tsx";

function App() {
  const [graphData, setGraphData] = useState<GraphDataResponse | null>(null);
  const [prefillModalData, setPrefillModalData] = useState<
    GraphDataResponse["forms"][number]["field_schema"]["properties"] | null
  >(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await getGraphData({
          tenantId: "your-tenant-id",
          blueprintVersionId: "your-blueprint-version-id",
        });
        setGraphData(data);
      } catch {
        console.error("Failed to fetch data from the server.");
      }
    };

    fetchInitialData();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {graphData?.forms.map((form, index) => (
        <button
          key={index}
          onClick={() => {
            setPrefillModalData(form.field_schema.properties);
            dialogRef.current?.showModal();
          }}
        >
          {form.name}
        </button>
      ))}

      <dialog ref={dialogRef}>
        {prefillModalData && graphData && (
          <PrefillModal properties={prefillModalData} graphData={graphData} />
        )}
        <button onClick={() => dialogRef.current?.close()}>Close</button>
      </dialog>

      <pre className="text-left max-w-screen-md overflow-x-auto bg-gray-100 p-4 rounded">
        {graphData ? JSON.stringify(graphData, null, 2) : "Loading..."}
      </pre>
    </div>
  );
}

export default App;
