import type { Consumer } from "~/types";

interface DataReceived {
  consumers: Consumer[];
  total: number;
  pagination: {
    offset: number;
    limit: number;
    hasMore: boolean;
  };
};

interface GetAllConsumersResponse {
  status: number;
  message: string;
  data: Consumer[];
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
      data: []
    });
  }

  const { offset, limit } = getQuery(event);

  const response = await fetch(
    `${adminApiBaseUrl}/consumers?offset=${offset}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey,
        "x-admin-secret": adminSecret
      }
    }
  );

  if (!response.ok) {
    setResponseStatus(event, response.status);
    return {
      status: response.status,
      message: "Failed to fetch consumers",
      data: []
    };
  }

  const parsedResponse = await response.json() as DataReceived;

  while (parsedResponse.pagination.hasMore) {
    const nextOffset = parsedResponse.pagination.offset + parsedResponse.pagination.limit;
    const nextResponse = await fetch(
      `${adminApiBaseUrl}/consumers?offset=${nextOffset}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
          "x-admin-secret": adminSecret
        }
      }
    );

    if (!nextResponse.ok) {
      setResponseStatus(event, nextResponse.status);
      return {
        status: nextResponse.status,
        message: "Failed to fetch next page of consumers",
        data: null
      };
    }

    const nextParsedResponse = await nextResponse.json() as DataReceived;
    parsedResponse.consumers = [...parsedResponse.consumers, ...nextParsedResponse.consumers];
    parsedResponse.pagination.hasMore = nextParsedResponse.pagination.hasMore;
  }

  const mappedConsumers: Consumer[] = parsedResponse.consumers.map((consumer) => ({
    ...consumer,
    description: consumer.description || ""
  }));

  return {
    status: 200,
    message: "Successfully fetched consumers",
    data: mappedConsumers
  };
});

export type { GetAllConsumersResponse };
