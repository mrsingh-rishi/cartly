import type { StoreState } from "@cartly/shared";

export const store: StoreState = {
  cart: [],
  orders: [],
  coupons: [],
  generatedMilestones: []
};

export const resetStore = () => {
  store.cart = [];
  store.orders = [];
  store.coupons = [];
  store.generatedMilestones = [];
};

