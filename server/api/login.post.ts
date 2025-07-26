export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { adminKey, adminSecret } = JSON.parse(body);

  if (!adminKey || !adminSecret) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid input"
    });
  }

  const runtimeConfig = useRuntimeConfig();
  const { adminApiBaseUrl } = runtimeConfig;

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

  const sessionToken = await createSession({
    authenticated: true,
    timestamp: Date.now()
  });

  setCookie(event, "admin-session", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 // 24 hours
  });

  return {
    status: 200,
    message: "Login Successful"
  };
});
