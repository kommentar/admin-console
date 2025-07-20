<script setup lang="ts">
import { useFetch } from "@vueuse/core";

const toast = useToast();

const login = async () => {
  try {
    const { error, statusCode } = await useFetch("/api/login", {
      method: "POST"
    });

    if (error.value) {
      return false;
    }

    return statusCode.value === 200;
  }
  catch {
    return false;
  }
};

const loginHandler = async () => {
  const authorized = await login();

  if (authorized) {
    toast.add({
      title: "Login successful",
      description: "Redirecting to the dashboard...",
      color: "success",
      duration: 1000
    });

    navigateTo("/dashboard/home");
  }
  else {
    toast.add({
      title: "Login failed",
      description: "Please try again.",
      color: "error"
    });
  }
};

onMounted(async () => {
  await loginHandler();
});
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <LoginForm />
  </div>
</template>
