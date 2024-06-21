import { create } from "zustand";
// Define the types for your state
type State = {
  actionStatus: null;
  isSecured: boolean;
  setActionStatus: (status: string | null) => void;
  retryFunction: (() => void) | null;
  setRetryFunction: (fn: (() => void) | null) => void;
  kallumLockStatus: {
    securePin: "";
    transactionPin: "";
  } | null;
  setKallumLockStatus: (value: any) => void;
  setIsSecured: (value: any) => void;
};
const kallumStore = create<State>((set: any) => ({
  actionStatus: null,
  kallumLockStatus: null,
  retryFunction: null,
  isSecured: false,
  setActionStatus: (status) => set({ actionStatus: status }),
  setRetryFunction: (fn) => set({ retryFunction: fn }),
  setKallumLockStatus: (value) => set({ kallumLockStatus: value }),
  setIsSecured: (value) => set({ isSecured: value }),
}));
export default kallumStore;
