import {
    FETCH_TODO_REQUEST,
    FETCH_TODO_FAILURE,
    FETCH_TODO_SUCCESS,
  } from "./todo.actionType";
  import {
    FetchTodoRequest,
    FetchTodoSuccess,
    FetchTodoSuccessPayload,
    FetchTodoFailure,
    FetchTodoFailurePayload,
  } from "./todo.type";
  
  export const fetchTodoRequest = (): FetchTodoRequest => ({
    type: FETCH_TODO_REQUEST,
  });
  
  export const fetchTodoSuccess = (
    payload: FetchTodoSuccessPayload
  ): FetchTodoSuccess => ({
    type: FETCH_TODO_SUCCESS,
    payload,
  });
  
  export const fetchTodoFailure = (
    payload: FetchTodoFailurePayload
  ): FetchTodoFailure => ({
    type: FETCH_TODO_FAILURE,
    payload,
  });