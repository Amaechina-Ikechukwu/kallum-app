import { create } from "zustand";
// Define the types for your state
type State = {
  actionStatus: null;
  setActionStatus: (status: string | null) => void;
  retryFunction: (() => void) | null;
  setRetryFunction: (fn: (() => void) | null) => void;
};
const kallumStore = create<State>((set: any) => ({
  actionStatus: null,
  setActionStatus: (status) => set({ actionStatus: status }),
  retryFunction: null,
  setRetryFunction: (fn) => set({ retryFunction: fn }),
}));
export default kallumStore;
