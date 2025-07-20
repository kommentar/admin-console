<script setup lang="ts">
const loadingIndicatorValue = ref(null);
</script>

<template>
  <UCard class="w-1/3">
    <template #header>
      <h3 class="text-2xl font-bold">
        Welcome Back
      </h3>
      <span>Logging you in to the admin console</span>

      <UProgress
        v-model="loadingIndicatorValue"
        class="mt-4"
      />
    </template>
  </UCard>
</template>
