<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps({
  error: Object as () => NuxtError
});
</script>

<template>
  <div class="w-screen h-screen flex flex-col justify-center items-center">
    <h1 class="font-bold text-2xl">
      {{ error?.statusCode }}
    </h1>
    <ULink to="/login">
      Go back to Login
    </ULink>
  </div>
</template>
