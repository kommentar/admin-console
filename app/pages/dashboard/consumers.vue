<script setup lang="ts">
import type { DashboardConsumerTableProps } from "~/components/dashboard/DashboardConsumerTable.vue";
import type { Consumer } from "~/types";

const consumerStore = useConsumerStore();

const consumersFetched = reactive({ value: true });

const UCheckbox = resolveComponent("UCheckbox");

const columns: DashboardConsumerTableProps["columns"] = [
  {
    id: "select",
    header: ({ table }) =>
      h(UCheckbox, {
        "modelValue": table.getIsSomePageRowsSelected()
          ? "indeterminate"
          : table.getIsAllPageRowsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all"
      }),
    cell: ({ row }) =>
      h(UCheckbox, {
        "modelValue": row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") => row.toggleSelected(!!value),
        "aria-label": "Select row"
      })
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => row.original.id
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.original.name
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => row.original.description
  },
  {
    accessorKey: "apiKey",
    header: "API Key",
    cell: ({ row }) => row.original.apiKey.substring(0, 7) + "..."
  },
  {
    accessorKey: "apiSecret",
    header: "API Secret",
    cell: ({ row }) => row.original.apiSecret.substring(0, 3) + "..."
  },
  {
    accessorKey: "allowedHosts",
    header: "Allowed Hosts",
    cell: ({ row }) => {
      return h("ul", {
        class: "list-none"
      }, row.original.allowedHosts.map((host) => h("li", host)));
    }
  },
  {
    accessorKey: "rateLimit",
    header: "Rate Limit",
    cell: ({ row }) => row.original.rateLimit.toString()
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => row.original.isActive ? "Yes" : "No"
  }
];

const onRowSelected = (row: Consumer, deselect: boolean) => {
  if (deselect) {
    consumerStore.setSelected({ id: "<nope>" });
    return;
  }
  consumerStore.setSelected({ id: row.id });
};

const updateConsumer = async (consumer: Consumer) => {
  console.log("Updating consumer", consumer);
  const { id } = consumer;
  await consumerStore.update({ id, data: consumer });
};

onMounted(async () => {
  await consumerStore.fetchAllAvailable();
  consumersFetched.value = false;
});
</script>

<template>
  <NuxtLayout
    name="default"
    active-tab="consumers"
    page-title="Consumers"
    page-description="View and manage your consumers here."
  >
    <div class="flex flex-col gap-5">
      <DashboardConsumerTable
        :loading="consumersFetched.value"
        :columns="columns"
        :data="consumerStore.availableData"
        @row-selected="onRowSelected"
      />
      <section class="w-1/2 self-center">
        <DashboardConsumerForm
          :consumer="consumerStore.selectedData"
          :update-consumer="updateConsumer"
        />
      </section>
    </div>
  </NuxtLayout>
</template>
