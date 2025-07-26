import type { Consumer } from "~/types";

interface CreateConsumerResponse {
  status: number;
  message: string;
  data: Consumer;
}

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const {
    adminApiBaseUrl,
    adminKey,
    adminSecret
  } = runtimeConfig;

  const body = await readBody(event);
  const { consumer } = JSON.parse(body);

  const response = await fetch(
    `${adminApiBaseUrl}/consumer`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
        "x-admin-secret": adminSecret
      },
      body: JSON.stringify(consumer)
    }
  );

  const jsonResponse = await response.json();

  return {
    status: response.status,
    message: response.statusText,
    data: jsonResponse
  };
});

export type { CreateConsumerResponse };
