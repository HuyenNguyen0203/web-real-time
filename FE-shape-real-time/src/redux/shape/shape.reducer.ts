

import { FETCH_SHAPE_FAILURE, FETCH_SHAPE_REQUEST, FETCH_SHAPE_SUCCESS } from "./shape.actionType";
import { ShapeActions, ShapeState } from "./shape.type";

const initialState: ShapeState = {
  pending: false,
  todos: [],
  error: null,
};

const shapeReducer = (state = initialState, action: ShapeActions) => {
  switch (action.type) {
    case FETCH_SHAPE_REQUEST:
      return {
        ...state,
        pending: true,
      };
    case FETCH_SHAPE_SUCCESS:
      return {
        ...state,
        pending: false,
        shapes: action.payload.todos,
        error: null,
      };
    case FETCH_SHAPE_FAILURE:
      return {
        ...state,
        pending: false,
        shapes: [],
        error: action.payload.error,
      };
    default:
      return {
        ...state,
      };
  }
};

export default shapeReducer;