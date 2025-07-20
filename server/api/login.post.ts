export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig();
  const {
    adminApiBaseUrl,
    adminKey,
    adminSecret
  } = runtimeConfig;

  if (!adminKey || !adminSecret) {
    throw createError({
      status: 400,
      message: "Invalid input"
    });
  }

  const response = await fetch(
    `${adminApiBaseUrl}/consumers?offset=0&limit=1`,
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
      message: "Login Failed"
    };
  }

  return {
    status: 200,
    message: "Login Successful"
  };
});
