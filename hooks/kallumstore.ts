import { create } from "zustand";
const kallumStore = create((set: any) => ({
  actionStatus: null,
  setActionStatus: (status: any) => set(() => ({ actionStatus: status })),
}));
export default kallumStore;
