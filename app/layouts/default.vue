<script setup lang="ts">
import type { ActiveTab } from "~/types";

interface Props {
  activeTab: ActiveTab;
}

const props = defineProps<Props>();
</script>

<template>
  <main class="w-screen h-screen flex">
    <DashboardSidebar :active-tab="props.activeTab" />
    <div class="p-5 flex-1">
      <slot />
    </div>
  </main>
</template>
