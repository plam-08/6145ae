const API_BASE_URL = "http://localhost:3000/api/v1";

export type GraphDataQuery = {
  tenantId: string;
  blueprintVersionId: string;
};

type FieldSchema = {
  type: "object";
  properties: Record<
    | "button"
    | "dynamic_checkbox_group"
    | "dynamic_object"
    | "email"
    | "id"
    | "multi_select"
    | "name"
    | "notes",
    object
  > | null;
};

export type GraphDataResponse = {
  branches: unknown[]; // Add specific types when available
  triggers: unknown[];
  forms: {
    id: string;
    name: string;
    description: string;
    is_reusable: boolean;
    field_schema: FieldSchema;
    ui_schema: object;
    dynamic_field_config: object;
  }[];
  edges: {
    source: string;
    target: string;
  }[];
  nodes: {
    id: string;
    type: string;
    position: {
      x: number;
      y: number;
    };
    data: {
      id: string;
      component_key: string;
      component_type: string;
      component_id: string;
      name: string;
      prerequisites: string[];
      permitted_roles: string[];
      input_mapping: object;
      sla_duration: {
        number: number;
        unit: string;
      };
      approval_required: boolean;
      approval_roles: string[];
    };
  }[];
};

export async function getGraphData(
  query: GraphDataQuery = {
    tenantId: "tenantId",
    blueprintVersionId: "blueprintVersionId",
  },
): Promise<GraphDataResponse> {
  const url = `${API_BASE_URL}/${query.tenantId}/actions/blueprints/${query.blueprintVersionId}/graph`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json, application/problem+json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch graph data: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching graph data:", error);
    throw error;
  }
}
