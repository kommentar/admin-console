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

  if (!adminKey || !adminSecret) {
    throw createError({
      status: 401,
      message: "Invalid credentials",
      data: null
    });
  }

  const { id } = getQuery(event);

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

  const { status, message, data } = await response.json();

  return {
    status,
    message,
    data
  };
});

export type { DeleteConsumerResponse };
