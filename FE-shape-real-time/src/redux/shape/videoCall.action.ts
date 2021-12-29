import { SET_VIDEO_CALL_STATE } from "./videoCall.actionType";

export const setVideoCallState = (
  payload: any
) => ({
  type: SET_VIDEO_CALL_STATE,
  payload,
});