import { createSelector } from "reselect";

import { AppState } from "../rootReducer";

const getPending = (state: AppState) => state.shape.pending;

const getShapes = (state: AppState) => state.shape.todos;

const getError = (state: AppState) => state.shape.error;

export const getTodosSelector = createSelector(getShapes, (shapes: any) => shapes);

export const getPendingSelector = createSelector(
  getPending,
  (pending: any) => pending
);

export const getErrorSelector = createSelector(getError, (error: any) => error);