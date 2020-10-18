import { AppState } from "store/rootReducer";

export const promotionsSelector = ({ promotions }: AppState) =>
  promotions.entities;
export const isPendingPromotionsSelector = ({ promotions }: AppState) =>
  promotions.pending;
