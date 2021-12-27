import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";

import rootReducer from "./rootReducer";

// Mount it on the Store
const store = createStore(rootReducer, applyMiddleware(logger));


export default store;