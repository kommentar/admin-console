export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (to.path === "/login") {
    return;
  }

  const { data: authCheck } = await useFetch("/api/validate-session");
  if (authCheck.value?.authenticated) {
    return navigateTo("/dashboard/home");
  }
  else {
    return await navigateTo("/login");
  }
});
