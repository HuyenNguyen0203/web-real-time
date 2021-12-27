import {
  SET_CALL_ACTION,
  SET_CLIENT_ID, SET_FRIEND_ID, SET_LOCAL_SRC, SET_PEER_SRC,
} from "./videoCall.actionType";

export interface VideoCallState {
  pending: boolean;
  error: string | null;
  clientId: string | null;
  friendId: string | null;
  callAction: string | null;
  peerSrc: any;
  localSrc: any;
}


export type SetClientId = {
  type: typeof SET_CLIENT_ID
  payload: string;
};

export type SetFriendId = {
  type: typeof SET_FRIEND_ID
  payload: string;
};

export type setCallAction = {
  type: typeof SET_CALL_ACTION
  payload: string;
};

export type setPeerSrc = {
  type: typeof SET_PEER_SRC
  payload: any;
};

export type setLocalSrc = {
  type: typeof SET_LOCAL_SRC
  payload: any;
};


export type VideoCallActions =
  SetClientId
  | SetFriendId
  | setCallAction
  | setPeerSrc
  | setLocalSrc;