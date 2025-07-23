import type { ConsumerStore, Consumer } from "~/types";
import { useFetch } from "@vueuse/core";
import type { GetAllConsumersResponse } from "~~/server/api/consumers/index.get";
import type { UpdateConsumerResponse } from "~~/server/api/consumers/[id].put";
import type { CreateConsumerResponse } from "~~/server/api/consumers/index.post";

const useConsumerStore = defineStore("consumer", {
  state: (): ConsumerStore["state"] => ({
    available: {
      data: [],
      count: 0
    },
    selected: {
      data: {
        id: "",
        name: "",
        description: "",
        allowedHosts: [],
        apiKey: "",
        apiSecret: "",
        isActive: false,
        rateLimit: 0
      }
    }
  }),

  getters: {
    availableData: (state) => state.available.data,
    selectedData: (state) => state.selected.data
  },

  actions: {
    async fetchAllAvailable() {
      const { data, error } = await useFetch<GetAllConsumersResponse>("/api/consumers", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }).json();

      if (!error.value && data.value) {
        const consumers = data.value.data;
        this.available.data = consumers;
        this.available.count = consumers.length;
      }
    },

    setSelected({ id }: { id: Consumer["id"] }) {
      const blankConsumer = {
        id: "",
        name: "",
        description: "",
        allowedHosts: [],
        apiKey: "",
        apiSecret: "",
        isActive: false,
        rateLimit: 0
      };

      this.selected.data = this.available.data.find((consumer) => consumer.id === id) || blankConsumer;
    },

    async update({ id, data }: { id: Consumer["id"]; data: Consumer }) {
      // everything except adminKey and adminSecret
      const requestBody = {
        name: data.name,
        description: data.description,
        allowedHosts: data.allowedHosts,
        isActive: data.isActive,
        rateLimit: data.rateLimit
      };
      const { data: updatedConsumerResponse, error } = await useFetch<UpdateConsumerResponse>(`/api/consumers/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          consumer: requestBody
        })
      });

      console.log("Consumer updated: ", updatedConsumerResponse.value);

      if (!error.value && updatedConsumerResponse.value) {
        this.available.data = this.available.data?.map((consumer) =>
          consumer.id === id ? (updatedConsumerResponse.value?.data || consumer) : consumer
        );
        this.selected.data = updatedConsumerResponse.value.data!;
      }
    },

    async delete({ id }: { id: Consumer["id"] }) {
      const blankConsumer = {
        id: "",
        name: "",
        description: "",
        allowedHosts: [],
        apiKey: "",
        apiSecret: "",
        isActive: false,
        rateLimit: 0
      };

      const { error } = await useFetch(`/api/consumers/${id}`, {
        method: "DELETE"
      });

      if (!error.value) {
        this.available.data = this.available.data?.filter((consumer) => consumer.id !== id);
        this.selected.data = blankConsumer;
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
  useConsumerStore
};
