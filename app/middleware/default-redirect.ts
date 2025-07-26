export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const { data: authCheck } = await useFetch("/api/validate-session");
  if (authCheck.value?.authenticated) {
    return navigateTo("/dashboard/home");
  }
});
