export default defineEventHandler(async (event) => {
  console.log("mw url: ", event.node.req.url);
  // Only check auth for dashboard routes
  if (!event.node.req.url?.startsWith("/dashboard")) {
    return;
  }

  const sessionCookie = getCookie(event, "admin-session");

  if (!sessionCookie) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }

  const session = await verifySession(sessionCookie);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid session"
    });
  }
});
