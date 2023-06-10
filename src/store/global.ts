import { defineStore } from "pinia";

export const useGlobalStore = defineStore({
  id: "global",
  state: () => ({
    token: "",
    userInfo: {},
    nowTestData: {},
    testResult: {},
    fontSize: 22,
    city: ""
  }),
  getters: {},
  actions: {}
});
