import {
    FETCH_SHAPE_REQUEST,
    FETCH_SHAPE_FAILURE,
    FETCH_SHAPE_SUCCESS,
  } from "./shape.actionType";
  import {
    FetchShapeRequest,
    FetchShapeSuccess,
    FetchShapeSuccessPayload,
    FetchShapeFailure,
    FetchShapeFailurePayload,
  } from "./shape.type";
  
  export const fetchTodoRequest = (): FetchShapeRequest => ({
    type: FETCH_SHAPE_REQUEST,
  });
  
  export const fetchTodoSuccess = (
    payload: FetchShapeSuccessPayload
  ): FetchShapeSuccess => ({
    type: FETCH_SHAPE_SUCCESS,
    payload,
  });
  
  export const fetchTodoFailure = (
    payload: FetchShapeFailurePayload
  ): FetchShapeFailure => ({
    type: FETCH_SHAPE_FAILURE,
    payload,
  });