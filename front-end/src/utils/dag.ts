import type { GraphDataResponse } from "../services/api";

export type Node = {
  nodeData: GraphDataResponse["nodes"][number];
  formData?: GraphDataResponse["forms"][number];
};

class DAG {
  private adjacencyList = new Map<
    string,
    GraphDataResponse["nodes"][number][]
  >();
  private inDegree = new Map<string, number>();
  private infoMap = new Map<string, Node>();
  private onUpdate?: () => void;

  constructor(
    private graph: GraphDataResponse,
    onUpdate?: () => void,
  ) {
    this.onUpdate = onUpdate;
    this.buildGraph();
  }

  private buildGraph(): void {
    for (const node of this.graph.nodes) {
      this.adjacencyList.set(node.id, []);
      this.inDegree.set(node.id, 0);

      const form = this.graph.forms.find(
        (f) => f.id === node.data.component_id,
      );
      let clonedForm: GraphDataResponse["forms"][number] | undefined;

      if (form?.field_schema?.properties) {
        clonedForm = structuredClone(form);
        for (const [fieldKey, field] of Object.entries(
          clonedForm.field_schema.properties,
        )) {
          if (field) {
            (field as any).form_name = `${node.data.name}.${fieldKey}`;
          }
        }
      }

      this.infoMap.set(node.id, { nodeData: node, formData: clonedForm });
    }

    for (const edge of this.graph.edges) {
      const sourceNeighbors = this.adjacencyList.get(edge.source);
      const targetNode = this.infoMap.get(edge.target)?.nodeData;

      if (sourceNeighbors && targetNode) {
        sourceNeighbors.push(targetNode);
      }

      this.inDegree.set(edge.target, (this.inDegree.get(edge.target) ?? 0) + 1);
    }
  }

  public traverse(): Node[] {
    const result: Node[] = [];
    const queue: string[] = [];

    const inDegreeCopy = new Map(this.inDegree);
    for (const [id, degree] of inDegreeCopy) {
      if (degree === 0) queue.push(id);
    }

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const currentNode = this.infoMap.get(currentId);
      if (!currentNode) continue;

      result.push(currentNode);

      for (const neighbor of this.adjacencyList.get(currentId) || []) {
        const updatedDegree = (inDegreeCopy.get(neighbor.id) ?? 0) - 1;
        inDegreeCopy.set(neighbor.id, updatedDegree);
        if (updatedDegree === 0) queue.push(neighbor.id);
      }
    }

    if (result.length !== this.graph.nodes.length) {
      throw new Error("Cycle detected or malformed graph.");
    }

    return result;
  }

  public getNode(id: string): Node | undefined {
    return this.infoMap.get(id);
  }

  private buildReverseAdjacencyList(): Map<string, Node[]> {
    const reverseList = new Map<string, Node[]>();
    for (const node of this.graph.nodes) {
      reverseList.set(node.id, []);
    }

    for (const { source, target } of this.graph.edges) {
      const sourceNode = this.infoMap.get(source);
      if (sourceNode) {
        reverseList.get(target)?.push(sourceNode);
      }
    }

    return reverseList;
  }

  public getNodesThatCanReach(targetId: string): Node[] {
    const reverseList = this.buildReverseAdjacencyList();
    const visited = new Set<string>();
    const reachable: Node[] = [];

    const dfs = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);

      const node = this.infoMap.get(id);
      if (node) reachable.push(node);

      for (const neighbor of reverseList.get(id) || []) {
        dfs(neighbor.nodeData.id);
      }
    };

    dfs(targetId);
    return reachable.filter((n) => n.nodeData.id !== targetId);
  }

  public setFieldValue(
    targetFormId: string,
    targetFieldKey: string,
    sourceFormId: string,
    sourceFieldKey: string,
  ): void {
    const sourceNode = this.infoMap.get(sourceFormId);
    const sourceField =
      sourceNode?.formData?.field_schema?.properties?.[sourceFieldKey];

    if (!sourceField) return;

    const clonedField = structuredClone(sourceField);
    (clonedField as any).form_name =
      `${sourceNode.nodeData.data.name}.${sourceFieldKey}`;

    const targetNode = this.infoMap.get(targetFormId);
    if (targetNode?.formData?.field_schema?.properties) {
      targetNode.formData.field_schema.properties[targetFieldKey] = clonedField;
    }

    this.onUpdate?.();
  }

  public setFieldValueToNull(id: string, fieldKey: string): void {
    const node = this.infoMap.get(id);
    if (!node?.formData?.field_schema?.properties) return;

    const updatedForm = structuredClone(node.formData);
    updatedForm.field_schema.properties[fieldKey] = null as any;

    this.infoMap.set(id, {
      ...node,
      formData: updatedForm,
    });

    this.onUpdate?.();
  }

  public setUpdateCallback(callback: () => void): void {
    this.onUpdate = callback;
  }
}

export default DAG;
