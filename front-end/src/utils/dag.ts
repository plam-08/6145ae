import type { GraphDataResponse } from "../services/api";

export class DAG {
  private adjacencyList: Map<string, string[]> = new Map();
  private inDegree: Map<string, number> = new Map();

  constructor(private graph: GraphDataResponse) {
    this.buildGraph();
  }

  private buildGraph(): void {
    // Initialize all nodes
    for (const node of this.graph.nodes) {
      this.adjacencyList.set(node.id, []);
      this.inDegree.set(node.id, 0);
    }

    // Populate edges
    for (const edge of this.graph.edges) {
      const neighbors = this.adjacencyList.get(edge.source);
      if (neighbors) {
        neighbors.push(edge.target);
      }

      // Increment in-degree for target
      this.inDegree.set(edge.target, (this.inDegree.get(edge.target) || 0) + 1);
    }
  }

  /**
   * Topologically traverses the DAG
   */
  public traverse(): string[] {
    const result: string[] = [];
    const zeroInDegreeQueue: string[] = [];

    // Start with nodes that have no dependencies
    for (const [nodeId, degree] of this.inDegree) {
      if (degree === 0) {
        zeroInDegreeQueue.push(nodeId);
      }
    }

    while (zeroInDegreeQueue.length > 0) {
      const current = zeroInDegreeQueue.shift()!;
      result.push(current);

      for (const neighbor of this.adjacencyList.get(current) || []) {
        const newInDegree = (this.inDegree.get(neighbor) || 0) - 1;
        this.inDegree.set(neighbor, newInDegree);
        if (newInDegree === 0) {
          zeroInDegreeQueue.push(neighbor);
        }
      }
    }

    if (result.length !== this.graph.nodes.length) {
      throw new Error("Cycle detected or graph is malformed");
    }

    return result;
  }

  /**
   * Utility to get node data by ID
   */
  public getNodeData(id: string) {
    return this.graph.nodes.find((n) => n.id === id);
  }
}
