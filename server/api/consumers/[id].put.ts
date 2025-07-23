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

  if (!adminKey || !adminSecret) {
    throw createError({
      status: 401,
      message: "Invalid credentials",
      data: null
    });
  }

  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const jsonBody = JSON.parse(body);
  console.log(jsonBody.consumer);

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

  const { status, message, data } = await response.json();

  return {
    status,
    message,
    data
  };
});

export type { UpdateConsumerResponse };
