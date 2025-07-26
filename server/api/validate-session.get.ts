export default defineEventHandler(async (event) => {
  const sessionCookie = getCookie(event, "admin-session");

  if (!sessionCookie) {
    return { authenticated: false };
  }

  const session = await verifySession(sessionCookie);

  return {
    authenticated: !!session
  };
});
