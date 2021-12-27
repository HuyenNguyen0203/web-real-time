import { SET_CALL_ACTION, SET_CLIENT_ID, SET_FRIEND_ID, SET_LOCAL_SRC, SET_PEER_SRC } from "./videoCall.actionType";
import { VideoCallActions, VideoCallState } from "./videoCall.type";

const initialState: VideoCallState = {
  pending: false,
  error: null,
  clientId: '',
  friendId: '',
  callAction: '',
  peerSrc: null,
  localSrc: null
};

const videoCallReducer = (state = initialState, action: VideoCallActions) => {
  switch (action.type) {
    case SET_CLIENT_ID:
      return {
        ...state,
        clientId: action.payload
      };
    case SET_FRIEND_ID:
      return {
        ...state,
        friendId: action.payload
      };
    case SET_CALL_ACTION:
      return {
        ...state,
        callAction: action.payload
      };
    case SET_PEER_SRC:
      return {
        ...state,
        peerSrc: action.payload
      };
    case SET_LOCAL_SRC:
      return {
        ...state,
        localSrc: action.payload
      };
    default:
      return {
        ...state,
      };
  }
};

export default videoCallReducer;