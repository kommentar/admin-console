<script setup lang="ts">
import type { ActiveTab } from "~/types";

interface Props {
  activeTab: ActiveTab;
  pageTitle: string;
  pageDescription: string;
}

const props = defineProps<Props>();
</script>

<template>
  <main class="w-screen h-screen flex">
    <DashboardSidebar :active-tab="props.activeTab" />
    <div class="p-5 flex-1">
      <section>
        <h2 class="text-2xl font-bold">
          {{ props.pageTitle }}
        </h2>
        <span class="text-gray-500">
          {{ props.pageDescription }}
        </span>
      </section>
      <USeparator class="h-10" />
      <slot />
    </div>
  </main>
</template>
