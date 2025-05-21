import { type Node } from "../utils/dag";

interface PrefillSelectionModalProps {
  nodes: Node[];
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
}

export const PrefillSelectionModal = ({
  nodes,
  handleSubmit,
}: PrefillSelectionModalProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <h3>Select data element to map</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {nodes.map((node, index) => (
            <details key={index}>
              <summary>{node.nodeData.data.name}</summary>
              <fieldset>
                {Object.keys(node.formData?.field_schema?.properties || {}).map(
                  (key) => (
                    <label key={key} style={{ display: "block" }}>
                      <input type="radio" name={node.nodeData.id} value={key} />
                      {key}
                    </label>
                  ),
                )}
              </fieldset>
            </details>
          ))}
          <input type="submit" value="Select" style={{ display: "block" }} />
        </div>
      </form>
    </div>
  );
};
