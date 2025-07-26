import type { ConsumerStore, Consumer } from "~/types";
import { useFetch } from "@vueuse/core";
import type { GetAllConsumersResponse } from "~~/server/api/consumers/index.get";
import type { UpdateConsumerResponse } from "~~/server/api/consumers/[id].put";

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
      const { data: updatedConsumerResponse, error } = await useFetch(`/api/consumers/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          consumer: requestBody
        })
      });

      const response = JSON.parse(updatedConsumerResponse.value as string);

      if (!error.value && response) {
        this.selected.data = response.data;
        this.available.data = this.available.data.map((consumer) =>
          consumer.id === id ? response.data : consumer
        );
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

    async createNew({ data }: { data: Omit<Consumer, "id" | "apiKey" | "apiSecret"> }) {
      const { data: createdConsumerResponse, error } = await useFetch("/api/consumers", {
        method: "POST",
        body: JSON.stringify({
          consumer: data
        })
      });

      const response = JSON.parse(createdConsumerResponse.value as string);

      if (!error.value && response) {
        this.available.data.push(response.data);
        this.selected.data = response.data;
      }
    }
  }
});

export {
  useConsumerStore
};
