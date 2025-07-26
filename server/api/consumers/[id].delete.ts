interface DeleteConsumerResponse {
  status: number;
  message: string;
  data: {
    message: string;
  };
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const {
    adminApiBaseUrl,
    adminKey,
    adminSecret
  } = runtimeConfig;

  const id = getRouterParam(event, "id");

  const response = await fetch(
    `${adminApiBaseUrl}/consumer/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
        "x-admin-secret": adminSecret
      }
    }
  );

  const jsonResponse = await response.json();

  return {
    status: response.status,
    message: response.statusText,
    data: jsonResponse
  };
});

export type { DeleteConsumerResponse };
