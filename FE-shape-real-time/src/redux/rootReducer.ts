import { combineReducers } from "redux";

import shapeReducer from "./shape/videoCall.reducer";

const rootReducer = combineReducers({
  videoCall: shapeReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;