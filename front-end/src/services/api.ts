const API_BASE_URL = "http://localhost:3000/api/v1";

export type GraphDataQuery = {
  tenantId: string;
  blueprintVersionId: string;
};

export type GraphDataResponse = {
  branches: [];
  triggers: [];
  forms: {
    id: string;
    name: string;
    description: string;
    is_reusable: boolean;
    field_schema: {
      type: object;
      properties: {
        button: object;
        dynamic_checkbox_group: object;
        dynamic_object: object;
        email: object;
        id: object;
        multi_select: object;
        name: object;
        notes: object;
      } | null;
    };
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

export const getGraphData = (
  query: GraphDataQuery = {
    tenantId: "tenantId",
    blueprintVersionId: "blueprintVersionId",
  },
): Promise<GraphDataResponse> =>
  fetch(
    `${API_BASE_URL}/${query.tenantId}/actions/blueprints/${query.blueprintVersionId}/graph`,
    {
      headers: {
        Accept: "application/json, application/problem+json",
      },
    },
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching graph data:", error);
      throw error;
    });
