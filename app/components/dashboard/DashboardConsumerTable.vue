<script setup lang="ts">
import { getPaginationRowModel } from "@tanstack/vue-table";
import type { TableColumn, TableRow } from "@nuxt/ui";
import type { Consumer } from "~/types";

const table = useTemplateRef("table");

const pagination = ref({
  pageIndex: 0,
  pageSize: 5
});

export interface DashboardConsumerTableProps {
  columns: TableColumn<Consumer>[];
  data: Consumer[];
  loading: boolean;
  onRowSelected: (row: Consumer, deselect: boolean) => void;
}

const props = defineProps<DashboardConsumerTableProps>();

const rowSelection = ref<Record<string, boolean>>({});

function onSelect(row: TableRow<Consumer>, _e?: Event) {
  row.toggleSelected(!row.getIsSelected());
  props.onRowSelected(row.original, row.getIsSelected());
}
</script>

<template>
  <div class="w-full space-y-4 pb-4">
    <UTable
      ref="table"
      v-model:pagination="pagination"
      v-model:row-selection="rowSelection"
      :row-selection-options="{ enableMultiRowSelection: false }"
      :loading="props.loading"
      :data="props.data"
      :columns="props.columns"
      :pagination-options="{
        getPaginationRowModel: getPaginationRowModel()
      }"
      class="flex-1"
      @select="onSelect"
    />

    <div class="w-full flex justify-center items-center border-t border-default pt-4 relative">
      <UPagination
        :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
        :items-per-page="table?.tableApi?.getState().pagination.pageSize"
        :total="table?.tableApi?.getFilteredRowModel().rows.length"
        @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)"
      />

      <DashboardAddConsumerDrawer class="absolute cursor-pointer right-0" />
    </div>
  </div>
</template>
