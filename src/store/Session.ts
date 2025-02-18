import { create } from "zustand";

export type Session = {
  url: string;
  token: string;
};

type SessionActions = {
  setSession: (session: Session) => void;
  clearSession: () => void;
};

export const useSession = create<{ data: Session | null } & SessionActions>()(
  (set) => ({
    data: null,
    setSession: (session: Session) => set({ data: session }),
    clearSession: () => set({ data: null }),
  })
);
