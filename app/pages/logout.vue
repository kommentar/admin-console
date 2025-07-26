<script setup lang="ts">
import { useFetch } from "@vueuse/core";

const logout = async () => {
  await useFetch("/api/logout", { method: "POST" });
  navigateTo("/login");
};

onMounted(async () => {
  await logout();
});
</script>
