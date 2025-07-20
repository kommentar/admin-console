type ActiveTab = "home" | "consumers" | "comments";

interface Consumer {
  id: string;
  name: string;
  description: string;
  apiKey: string;
  apiSecret: string;
  allowedHosts: string[];
  isActive: boolean;
  rateLimit: number;
}

interface ConsumerStore {
  state: {
    available: {
      data: Consumer[];
      count: number;
    };
    selected: {
      data: Consumer | object;
    };
  };
}

export type { ActiveTab, Consumer, ConsumerStore };
