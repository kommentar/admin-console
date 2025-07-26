import type { Consumer } from "~/types";

interface UpdateConsumerResponse {
  status: number;
  message: string;
  data: Consumer | null;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const {
    adminApiBaseUrl,
    adminKey,
    adminSecret
  } = runtimeConfig;

  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const jsonBody = JSON.parse(body);

  const response = await fetch(
    `${adminApiBaseUrl}/consumer/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
        "x-admin-secret": adminSecret
      },
      body: JSON.stringify(jsonBody.consumer)
    }
  );

  const jsonResponse = await response.json();

  return {
    status: response.status,
    message: response.statusText,
    data: jsonResponse
  };
});

export type { UpdateConsumerResponse };
