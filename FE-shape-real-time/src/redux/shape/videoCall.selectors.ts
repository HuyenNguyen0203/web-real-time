import { createSelector } from "reselect";

import { AppState } from "../rootReducer";

const getPending = (state: AppState) => state.videoCall.pending;

const getError = (state: AppState) => state.videoCall.error;

export const getPendingSelector = createSelector(
  getPending,
  (pending: any) => pending
);

export const getErrorSelector = createSelector(getError, (error: any) => error);