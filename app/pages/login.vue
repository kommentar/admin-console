<script setup lang="ts">
import { useFetch } from "@vueuse/core";
import type { LoginFormProps } from "~/components/LoginForm.vue";

type LoginFn = (params: { adminKey: string; adminSecret: string }) => Promise<boolean>;
type LoginHandler = LoginFormProps["submitHandler"];

const toast = useToast();
const isLoading = ref(false);

const login: LoginFn = async ({ adminKey, adminSecret }) => {
  try {
    isLoading.value = true;

    const { error, statusCode } = await useFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ adminKey, adminSecret })
    });

    if (error.value) {
      return false;
    }

    return statusCode.value === 200;
  }
  catch {
    return false;
  }
  finally {
    isLoading.value = false;
  }
};

const loginHandler: LoginHandler = async (event) => {
  if (!event.data.adminKey || !event.data.adminSecret) {
    toast.add({
      title: "Invalid credentials",
      description: "Please enter both admin key and secret.",
      color: "error"
    });
    return;
  }

  const authorized = await login(event.data);

  if (authorized) {
    toast.add({
      title: "Login successful",
      description: "Redirecting to the dashboard...",
      color: "success",
      duration: 1000
    });

    await navigateTo("/dashboard/home");
  }
  else {
    toast.add({
      title: "Login failed",
      description: "Please try again.",
      color: "error"
    });
  }
};

definePageMeta({
  middleware: ["default-redirect"]
});
</script>

<template>
  <div class="w-screen h-screen flex justify-center items-center">
    <LoginForm
      :loading="isLoading"
      :submit-handler="loginHandler"
    />
  </div>
</template>
