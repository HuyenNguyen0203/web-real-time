import { combineReducers } from "redux";

import shapeReducer from "./shape/shape.reducer";

const rootReducer = combineReducers({
  shape: shapeReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;