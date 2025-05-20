import type { GraphDataResponse } from "../services/api";

export type Node = {
  nodeData: GraphDataResponse["nodes"][number];
  formData?: GraphDataResponse["forms"][number];
};

class DAG {
  private adjacencyList: Map<string, GraphDataResponse["nodes"][number][]> =
    new Map();
  private inDegree: Map<string, number> = new Map();
  private infoMap: Map<string, Node> = new Map();
  private onUpdate?: () => void;

  constructor(
    private graph: GraphDataResponse,
    onUpdate?: () => void,
  ) {
    this.buildGraph();
    this.onUpdate = onUpdate;
  }

  private buildGraph(): void {
    for (const node of this.graph.nodes) {
      this.adjacencyList.set(node.id, []);
      this.inDegree.set(node.id, 0);
      const rawForm = this.graph.forms.find(
        (form) => form.id === node.data.component_id,
      );
      let formWithInjectedName;
      if (rawForm) {
        // Deep clone the form to avoid mutating the original
        formWithInjectedName = structuredClone(rawForm);
        // Inject form_name into each field in field_schema.properties
        const properties = formWithInjectedName.field_schema.properties;
        for (const [fieldKey, fieldValue] of Object.entries(properties)) {
          if (!fieldValue) {
            continue;
          }
          properties[fieldKey].form_name = `${node.data.name}.${fieldKey}`;
        }
      }
      this.infoMap.set(node.id, {
        nodeData: node,
        formData: formWithInjectedName,
      });
    }
    for (const edge of this.graph.edges) {
      const sourceNeighbors = this.adjacencyList.get(edge.source);
      const targetInfo = this.infoMap.get(edge.target);
      if (sourceNeighbors && targetInfo) {
        sourceNeighbors.push(targetInfo.nodeData);
      }
      this.inDegree.set(edge.target, (this.inDegree.get(edge.target) || 0) + 1);
    }
  }

  public traverse(): Node[] {
    const result: Node[] = [];
    const zeroInDegreeQueue: string[] = [];
    const inDegreeClone = new Map(this.inDegree);
    for (const [nodeId, degree] of inDegreeClone) {
      if (degree === 0) zeroInDegreeQueue.push(nodeId);
    }
    while (zeroInDegreeQueue.length > 0) {
      const currentId = zeroInDegreeQueue.shift()!;
      const info = this.infoMap.get(currentId);
      if (!info) continue;
      result.push(info);
      for (const neighbor of this.adjacencyList.get(currentId) || []) {
        const newInDegree = (inDegreeClone.get(neighbor.id) || 0) - 1;
        inDegreeClone.set(neighbor.id, newInDegree);
        if (newInDegree === 0) zeroInDegreeQueue.push(neighbor.id);
      }
    }
    if (result.length !== this.graph.nodes.length) {
      throw new Error("Cycle detected or graph is malformed");
    }
    return result;
  }

  public getNode(id: string): Node | undefined {
    return this.infoMap.get(id);
  }

  public setFieldValueToNull(id: string, keyName: string): void {
    const node = this.infoMap.get(id);
    if (node?.formData) {
      // Create a new copy of the form data
      const updatedFormData = structuredClone(node.formData);
      updatedFormData.field_schema.properties[keyName] = null as any;

      // Update the infoMap with the new form data
      this.infoMap.set(id, {
        ...node,
        formData: updatedFormData,
      });

      // Notify about the update
      if (this.onUpdate) {
        this.onUpdate();
      }
    }
  }

  // Method to register update callback after initialization
  public setUpdateCallback(callback: () => void): void {
    this.onUpdate = callback;
  }
}

export default DAG;
