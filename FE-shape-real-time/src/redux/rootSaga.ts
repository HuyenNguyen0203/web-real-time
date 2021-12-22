import { all, fork } from "redux-saga/effects";

import todoSaga from "./shape/shape.saga";

export function* rootSaga() {
  yield all([fork(todoSaga)]);
}