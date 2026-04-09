import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

type AuthState = {
  accessToken?: string;
  user?: AuthUser;
  setSession: (input: { accessToken: string; user: AuthUser }) => void;
  clear: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: undefined,
      user: undefined,
      setSession: ({ accessToken, user }) => set({ accessToken, user }),
      clear: () => set({ accessToken: undefined, user: undefined }),
    }),
    { name: "careerbridge.auth" }
  )
);

