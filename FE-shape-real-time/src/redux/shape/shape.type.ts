import {
    FETCH_SHAPE_REQUEST,
    FETCH_SHAPE_SUCCESS,
    FETCH_SHAPE_FAILURE,
  } from "./shape.actionType";
  
  export interface ITodo {
    userId: number;
    id: number;
    title: string;
    completed: boolean;
  }
  
  export interface ShapeState {
    pending: boolean;
    todos: ITodo[];
    error: string | null;
  }
  
  export interface FetchShapeSuccessPayload {
    todos: ITodo[];
  }
  
  export interface FetchShapeFailurePayload {
    error: string;
  }
  
  export interface FetchShapeRequest {
    type: typeof FETCH_SHAPE_REQUEST;
  }
  
  export type FetchShapeSuccess = {
    type: typeof FETCH_SHAPE_SUCCESS;
    payload: FetchShapeSuccessPayload;
  };
  
  export type FetchShapeFailure = {
    type: typeof FETCH_SHAPE_FAILURE;
    payload: FetchShapeFailurePayload;
  };
  
  export type ShapeActions =
    | FetchShapeRequest
    | FetchShapeSuccess
    | FetchShapeFailure;