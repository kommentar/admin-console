<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import type { ActiveTab } from "~/types";

interface DashboardSidebarProps {
  activeTab: ActiveTab;
}

const items = ref<NavigationMenuItem[][]>([
  [
    {
      label: "Home",
      id: "home",
      icon: "i-lucide-home",
      to: "/dashboard/home"
    },
    {
      label: "Consumers",
      id: "consumers",
      icon: "i-lucide-users",
      to: "/dashboard/consumers"
    },
    {
      label: "Comments",
      id: "comments",
      icon: "i-lucide-message-circle",
      to: "/dashboard/comments"
    }
  ],
  [
    {
      label: "Logout",
      icon: "i-lucide-log-out",
      to: "/logout"
    }
  ]
]);

const props = defineProps<DashboardSidebarProps>();

const active = ref();

switch (props.activeTab) {
  case "home":
    active.value = "0";
    break;
  case "consumers":
    active.value = "1";
    break;
  case "comments":
    active.value = "2";
    break;
}
</script>

<template>
  <UNavigationMenu
    v-model="active"
    orientation="vertical"
    :items="items"
    :ui="{
      root: 'p-2 border-r border-r-gray-800',
      list: 'mt-3 flex flex-col gap-2',
      childLink: 'p-2'
    }"
    class="data-[orientation=vertical]:w-52 data-[orientation=vertical]:h-screen"
  />
</template>
