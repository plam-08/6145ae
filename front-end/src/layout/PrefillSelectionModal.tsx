import type { GraphDataResponse } from "../services/api";

export const PrefillSelectionModal = ({
  dialogRef,
  nodeCanReachPrefillFormId,
  handleSubmit,
}) => {
  return (
    <dialog ref={dialogRef}>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <h3>Select data element to map</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {nodeCanReachPrefillFormId.map(
              (node: GraphDataResponse["nodes"][number], index: number) => (
                <details key={index}>
                  <summary>{node.nodeData.data.name}</summary>
                  <fieldset>
                    {Object.keys(
                      node.formData?.field_schema?.properties || {},
                    ).map((key) => (
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
              ),
            )}
            <input type="submit" value="Select" style={{ display: "block" }} />
            <input
              onClick={() => dialogRef.current?.close()}
              type="button"
              value="Cancel"
            />
          </div>
        </form>
      </div>
    </dialog>
  );
};
