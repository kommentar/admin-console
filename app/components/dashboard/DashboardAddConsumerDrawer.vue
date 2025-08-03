<script setup lang="ts">
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import { array, boolean, number, object, string, type InferType } from "yup";
import type { Consumer } from "~/types";

const schema = object({
  name: string().required(),
  description: string(),
  allowedHosts: array().of(string()),
  isActive: boolean(),
  rateLimit: number().min(0)
});

type DashboardAddConsumerFormSchema = InferType<typeof schema>;

const consumerStore = useConsumerStore();
const toast = useToast();
const drawerOpen = ref(false);

const state = reactive<DashboardAddConsumerFormSchema>({
  name: "",
  description: "",
  allowedHosts: [],
  isActive: true,
  rateLimit: 0
});

const resetState = () => {
  state.name = "";
  state.description = "";
  state.allowedHosts = [];
  state.isActive = true;
  state.rateLimit = 0;
};

const updateHost = (index: number, value: string) => {
  if (state.allowedHosts) {
    state.allowedHosts[index] = value;
  }
};

const addHost = () => {
  state.allowedHosts?.push("");
};

const removeHost = (index: number) => {
  state.allowedHosts?.splice(index, 1);
};

function onError(event: FormErrorEvent) {
  console.error("Form validation errors:", event.errors);
  toast.add({
    title: "Validation Error",
    description: "Please check your form fields. More details in the browser console.",
    color: "error"
  });
}

async function onSubmit(_event: FormSubmitEvent<DashboardAddConsumerFormSchema>) {
  const consumer = state as Consumer;
  await consumerStore.createNew({ data: consumer });
  resetState();

  toast.add({
    title: "Success",
    description: "Consumer created successfully. Make sure to copy the API secret as it will not be shown unhashed again.",
    color: "success",
    duration: 10000
  });
}
</script>

<template>
  <UDrawer
    v-model:open="drawerOpen"
    direction="right"
  >
    <UButton
      label="Create Consumer"
      color="primary"
      variant="solid"
      icon="i-lucide-plus"
    />

    <template #content>
      <UForm
        :schema="schema"
        :state="state"
        class="w-full flex flex-col gap-3 p-5"
        @submit="onSubmit"
        @error="onError"
      >
        <h2 class="text-2xl font-bold">
          Create Consumer
        </h2>
        <div class="flex flex-row gap-5 justify-evenly">
          <UFormField
            label="Name"
            name="name"
            class="w-full"
            required
          >
            <UInput
              v-model="state.name"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Description"
            name="description"
            class="w-full"
          >
            <UInput
              v-model="state.description"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="flex flex-row justify-evenly w-full">
          <UFormField
            label="Allowed Hosts (e.g. www.example.com, example.com, etc.)"
            name="allowedHosts"
            class="w-full"
          >
            <div class="space-y-2">
              <div
                v-for="(host, index) in state.allowedHosts"
                :key="index"
                class="flex items-center gap-2"
              >
                <UInput
                  :model-value="host"
                  placeholder="https://example.com"
                  class="flex-1"
                  @update:model-value="updateHost(index, $event)"
                />
                <UButton
                  icon="i-heroicons-trash"
                  color="error"
                  variant="ghost"
                  size="sm"
                  @click="removeHost(index)"
                />
              </div>
              <UButton
                icon="i-heroicons-plus"
                variant="outline"
                size="sm"
                @click="addHost"
              >
                Add Host
              </UButton>
            </div>
          </UFormField>
        </div>

        <div class="flex flex-row justify-evenly gap-5 w-full">
          <UFormField
            label="Rate Limit"
            name="rateLimit"
          >
            <UInput
              v-model="state.rateLimit"
              class="w-full"
              type="number"
              min="0"
            />
          </UFormField>

          <UFormField
            label="Consumer Status"
            name="isActive"
            class="w-full"
          >
            <USwitch
              v-model="state.isActive"
              class=""
            />
          </UFormField>
        </div>

        <UButton
          type="submit"
          class="cursor-pointer"
        >
          Submit
        </UButton>
      </UForm>
    </template>
  </UDrawer>
</template>
