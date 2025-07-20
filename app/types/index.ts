type ActiveTab = "home" | "consumers" | "comments";

interface AuthState {
  key: string;
  secret: string;
  authorized: boolean;
}

export type { ActiveTab, AuthState };
