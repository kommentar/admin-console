export default defineEventHandler(async (event) => {
  deleteCookie(event, "admin-session");

  return {
    status: 200,
    message: "Logged out successfully"
  };
});
