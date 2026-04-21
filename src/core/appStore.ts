import { createStore } from "solid-js/store";

export type AppState = {
  isCallActive: boolean;
  participantCount: number;
};

export const [appStore, setAppStore] = createStore<AppState>({
  isCallActive: false,
  participantCount: 0,
});
