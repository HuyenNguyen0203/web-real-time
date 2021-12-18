import { all, fork } from "redux-saga/effects";

import todoSaga from "./todo/todo.saga";

export function* rootSaga() {
  yield all([fork(todoSaga)]);
}