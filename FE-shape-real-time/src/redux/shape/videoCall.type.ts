import { SET_VIDEO_CALL_STATE } from "./videoCall.actionType";
export interface VideoCallState {
  pending: boolean;
  error: string | null;
  clientId: string | null;
  friendId: string | null;
  callAction: string | null;
  peerSrc: any;
  localSrc: any;
  callModal: string | null;
  callFrom: string | null;
  friendData: any;
  showShape: boolean;
}

export type setVideoCallState = {
  type: typeof SET_VIDEO_CALL_STATE
  payload: any;
};

export type VideoCallActions = setVideoCallState;