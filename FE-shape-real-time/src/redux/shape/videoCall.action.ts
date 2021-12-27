import {
  SET_CALL_ACTION,
  SET_CLIENT_ID, SET_FRIEND_ID, SET_LOCAL_SRC, SET_PEER_SRC,
} from "./videoCall.actionType";

export const setClientId = (
  payload: string
) => ({
  type: SET_CLIENT_ID,
  payload,
});

export const setFriendId = (
  payload: string | null
) => ({
  type: SET_FRIEND_ID,
  payload,
});


export const setPeerSrc = (
  payload: string | null
) => ({
  type: SET_PEER_SRC,
  payload,
});

export const setLocalSrc = (
  payload: any
) => ({
  type: SET_LOCAL_SRC,
  payload,
});

export const setCallAction = (
  payload: any
) => ({
  type: SET_CALL_ACTION,
  payload,
});