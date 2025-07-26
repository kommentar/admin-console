<script setup lang="ts">
import { object, string } from "yup";
import type { InferType } from "yup";
import type { FormSubmitEvent } from "@nuxt/ui";

export interface LoginFormProps {
  loading: boolean;
  submitHandler: (event: FormSubmitEvent<LoginFormSchema>) => Promise<void>;
}

const props = defineProps<LoginFormProps>();

const schema = object({
  adminKey: string().required("Required"),
  adminSecret: string().required("Required")
});

type LoginFormSchema = InferType<typeof schema>;

const state = reactive({
  adminKey: "",
  adminSecret: ""
});

async function onSubmit(event: FormSubmitEvent<LoginFormSchema>) {
  await props.submitHandler(event);
}
</script>

<template>
  <UCard class="w-1/3">
    <template #header>
      <h3 class="text-2xl font-bold">
        Welcome Back
      </h3>
      <span>Enter your admin credentials to access the console</span>
    </template>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Admin Key"
        name="adminKey"
      >
        <UInput v-model="state.adminKey" />
      </UFormField>
      <UFormField
        label="Admin Secret"
        name="adminSecret"
      >
        <UInput
          v-model="state.adminSecret"
          type="password"
        />
      </UFormField>
      <UButton
        type="submit"
        :loading="loading"
      >
        Login
      </UButton>
    </UForm>
  </UCard>
</template>
