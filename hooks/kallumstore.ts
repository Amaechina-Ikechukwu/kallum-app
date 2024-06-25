import { create } from "zustand";
import {
  AccountDetails,
  BalanceDetails,
  Transactions,
} from "./kallumInterfaces";

// Define the types for your state
type State = {
  actionStatus: string | null;
  isSecured: boolean;
  kallumLockStatus: {
    securePin: string;
    transactionPin: string;
  } | null;
  accountDetails: AccountDetails | null;
  transactions: Transactions | null;
  balanceDetails: BalanceDetails | null;
  setKallumLockStatus: (
    value: { securePin: string; transactionPin: string } | null
  ) => void;
  setIsSecured: (value: boolean) => void;
  setActionStatus: (status: string | null) => void;
  retryFunction: (() => void) | null;
  setRetryFunction: (fn: (() => void) | null) => void;
  setAccountDetails: (value: AccountDetails | null) => void;
  setTransactions: (value: Transactions | null) => void;
  setBalanceDetails: (value: BalanceDetails | null) => void;
};

const kallumStore = create<State>((set) => ({
  actionStatus: null,
  isSecured: false,
  kallumLockStatus: null,
  accountDetails: null,
  transactions: null,
  balanceDetails: null,
  retryFunction: null,
  setActionStatus: (status) => set({ actionStatus: status }),
  setIsSecured: (value) => set({ isSecured: value }),
  setKallumLockStatus: (value) => set({ kallumLockStatus: value }),
  setRetryFunction: (fn) => set({ retryFunction: fn }),
  setAccountDetails: (value) => set({ accountDetails: value }),
  setTransactions: (value) => set({ transactions: value }),
  setBalanceDetails: (value) => set({ balanceDetails: value }),
}));

export default kallumStore;
