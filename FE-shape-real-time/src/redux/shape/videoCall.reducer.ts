import { SET_VIDEO_CALL_STATE } from "./videoCall.actionType";
import { VideoCallActions, VideoCallState } from "./videoCall.type";

const initialState: VideoCallState = {
  pending: false,
  error: null,
  clientId: '',
  friendId: '',
  callAction: '',
  peerSrc: null,
  localSrc: null,
  callModal: '',
  callFrom: '',
  friendData: null,
  showShape: false
};

const videoCallReducer = (state = initialState, action: VideoCallActions) => {
  switch (action.type) {
    case SET_VIDEO_CALL_STATE:
      return {
        ...state,
        ...action.payload
      };
    default:
      return {
        ...state,
      };
  }
};

export default videoCallReducer;