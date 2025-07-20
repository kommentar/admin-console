import type { ConsumerStore, Consumer } from "~/types";
import { useFetch } from "@vueuse/core";
import type { GetAllConsumersResponse } from "~~/server/api/consumers/index.get";
import type { UpdateConsumerResponse } from "~~/server/api/consumers/[id].put";
import type { CreateConsumerResponse } from "~~/server/api/consumers/index.post";

const consumerStore = defineStore("consumer", {
  state: (): ConsumerStore["state"] => ({
    available: {
      data: undefined,
      count: 0
    },
    selected: { data: undefined }
  }),

  actions: {
    async fetchAllAvailable() {
      const { data, error } = await useFetch<GetAllConsumersResponse>("/api/consumers", {
        method: "GET"
      });

      if (!error.value && data.value) {
        this.available.data = data.value.data || [];
        this.available.count = data.value.data?.length || 0;
      }
    },

    setSelected({ id }: { id: Consumer["id"] }) {
      this.selected.data = this.available.data?.find((consumer) => consumer.id === id);
    },

    async update({ id, data }: { id: Consumer["id"]; data: Consumer }) {
      const { data: updatedConsumerResponse, error } = await useFetch<UpdateConsumerResponse>(`/api/consumers/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          consumer: data
        })
      });

      if (!error.value && updatedConsumerResponse.value) {
        this.available.data = this.available.data?.map((consumer) =>
          consumer.id === id ? (updatedConsumerResponse.value?.data || consumer) : consumer
        );
        this.selected.data = updatedConsumerResponse.value.data!;
      }
    },

    async delete({ id }: { id: Consumer["id"] }) {
      const { error } = await useFetch(`/api/consumers/${id}`, {
        method: "DELETE"
      });

      if (!error.value) {
        this.available.data = this.available.data?.filter((consumer) => consumer.id !== id);
        this.selected.data = undefined;
      }
    },

    async createNew({ data }: { data: Omit<Consumer, "id" | "createdAt" | "updatedAt" | "apiKey" | "apiSecret"> }) {
      const { data: createdConsumerResponse, error } = await useFetch<CreateConsumerResponse>("/api/consumers", {
        method: "POST",
        body: JSON.stringify({
          consumer: data
        })
      });

      if (!error.value && createdConsumerResponse.value) {
        this.available.data = [...(this.available.data || []), createdConsumerResponse.value.data!];
        this.selected.data = createdConsumerResponse.value.data!;
      }
    }
  }
});

export {
  consumerStore
};
