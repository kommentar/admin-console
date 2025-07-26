<script setup lang="ts">
import type { Consumer } from "~/types";
import { array, boolean, number, object, string } from "yup";
import type { InferType } from "yup";
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";

const schema = object({
  id: string().uuid(),
  name: string().required(),
  description: string(),
  allowedHosts: array().of(string()),
  apiKey: string().required(),
  apiSecret: string().required(),
  isActive: boolean(),
  rateLimit: number().min(0)
});

type DashboardConsumerFormSchema = InferType<typeof schema>;

interface Props {
  formDisabled: boolean;
  formTitle: string;
  emptyFormDescription: string;
  consumer: Consumer;
  updateConsumer: (consumer: Consumer) => Promise<void>;
  deleteConsumer: () => Promise<void>;
}

const props = defineProps<Props>();

const state = reactive<DashboardConsumerFormSchema>({
  id: props.consumer.id,
  name: props.consumer.name,
  description: props.consumer.description,
  allowedHosts: [...props.consumer.allowedHosts],
  apiKey: props.consumer.apiKey,
  apiSecret: props.consumer.apiSecret,
  isActive: props.consumer.isActive,
  rateLimit: props.consumer.rateLimit
});

const toast = useToast();

async function onSubmit(_event: FormSubmitEvent<DashboardConsumerFormSchema>) {
  await props.updateConsumer(state as Consumer);

  toast.add({
    title: "Success",
    description: "Consumer updated successfully.",
    color: "success",
    duration: 1500
  });
}

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

watchEffect(() => {
  if (props.consumer) {
    state.id = props.consumer.id;
    state.name = props.consumer.name;
    state.description = props.consumer.description;
    state.allowedHosts = [...props.consumer.allowedHosts]; // Create a copy
    state.apiKey = props.consumer.apiKey;
    state.apiSecret = props.consumer.apiSecret;
    state.isActive = props.consumer.isActive;
    state.rateLimit = props.consumer.rateLimit;
  }
});

function onError(event: FormErrorEvent) {
  console.error("Form validation errors:", event.errors);
  toast.add({
    title: "Validation Error",
    description: "Please check your form fields. More details in the browser console.",
    color: "error"
  });
}

async function removeConsumerHandler(_e: MouseEvent) {
  await props.deleteConsumer();

  toast.add({
    title: "Consumer Deleted",
    description: "The consumer has been successfully deleted.",
    color: "success"
  });
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex flex-row justify-between items-center">
        <h3 class="text-xl font-bold">
          {{ formTitle }}
        </h3>
        <span
          v-if="formDisabled"
          class="text-md text-muted font-medium flex items-center gap-1"
        >
          <UIcon
            name="i-lucide-info"
            class="size-5"
          />
          {{ emptyFormDescription }}
        </span>
      </div>
    </template>

    <UForm
      :disabled="formDisabled"
      :schema="schema"
      :state="state"
      class="w-full flex flex-col gap-3"
      @submit="onSubmit"
      @error="onError"
    >
      <div class="flex flex-row justify-evenly">
        <UFormField
          label="ID"
          name="id"
          class="w-full"
        >
          <UInput
            v-model="state.id"
            class="w-1/3"
            readonly
            disabled
          />
        </UFormField>
      </div>

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

      <div class="flex flex-row gap-5 justify-evenly">
        <UFormField
          label="API Key"
          name="apiKey"
          class="w-full"
          required
        >
          <UInput
            v-model="state.apiKey"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="API Secret"
          name="apiSecret"
          class="w-full"
          required
        >
          <UInput
            v-model="state.apiSecret"
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

      <div class="w-full flex justify-between items-center gap-5">
        <UButton
          type="submit"
          class="w-full cursor-pointer"
        >
          Update Consumer
        </UButton>
        <UButton
          variant="outline"
          color="error"
          type="button"
          class="w-full cursor-pointer"
          @click="removeConsumerHandler"
        >
          Delete Consumer
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
