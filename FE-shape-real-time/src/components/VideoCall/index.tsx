import React, { FC, useEffect, useRef, useState, useCallback } from 'react';
import { isEmpty } from 'lodash';
import { SocketEvent } from '../../constants/videoConstants';
import CustomerConnection from '../../utils/customerConnection';
import CallModal from './CallModal';
import CallScreen from './CallScreen';
import CallAction from './CallAction';
import { Shape } from '../Shape';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/rootReducer';
import { setVideoCallState } from '../../redux/shape/videoCall.action';
interface VideoCallProps {
  socket: any;
}

const VideoCall: FC<VideoCallProps> = (props: VideoCallProps) => {
  const dispatch = useDispatch();
  const callObj: any = useRef({ pc: null, config: null });
  const [isSocketInit, setIsSocketInit] = useState(false);
  const [isInitRTC, setIsInitRTC] = useState(false);

  const { friendId, callAction, peerSrc, callModal, callFrom, friendData, showShape } = useSelector(({ videoCall }: AppState) => videoCall);

  const { socket } = props;

  /**
   * 
   * @param {boolean} isCaller
   * @param {string} friendID 
   * @param {any} config 
   */
  const startCall = useCallback((data: { isCaller: boolean, callID: string, callFrom: string, configStart: any }) => {

    dispatch(setVideoCallState({
      friendId: data.callID || friendId,
      callModal: !(data || { isCaller: false }).isCaller ? '' : callModal,
      friendData: data,
      showShape: data.isCaller ? showShape : true
    }));
  }, [callFrom, callModal]);

  const onLocalStream = (src: any) => {
    dispatch(setVideoCallState({ localSrc: src, callAction: 'active' }));
  };

  const onPeerStream = (src: any) => {
    if (!peerSrc) {
      dispatch(setVideoCallState({ peerSrc: src }));
    }
  };

  const onCall = ({ sdp, candidate }: any) => {
    if (sdp) {
      callObj.current.pc.setRemoteDescription(sdp);
      if (sdp.type === 'offer') {
        callObj.current.pc.createAnswer();
        dispatch(setVideoCallState({ showShape: true }));
      }
    } else {
      callObj.current.pc.addIceCandidate(candidate);
    }
  };


  const rejectCall = () => {
    socket.emit('end', { to: callFrom });
    dispatch(setVideoCallState({ callModal: '' }));
  };

  /**
   * 
   * @param {boolean} isStarter 
   */
  const endCall = (isStarter: boolean) => {
    if (callObj?.current?.pc) {
      callObj.current.pc.stop(isStarter);
    }
    callObj.current.pc = null;
    callObj.current.config = null;
    dispatch(setVideoCallState({
      callAction: '', localSrc: null, peerSrc: null,
      callModal: '', friendData: null, showShape: false
    }));
    setIsInitRTC(false);
  };

  const onRequest = ({ from }: any) => {
    dispatch(setVideoCallState({ friendId: from, callModal: 'active', callFrom: from }));
  };

  useEffect(() => {
    if (!isSocketInit && socket?.on) {
      socket
        .on(SocketEvent.init, ({ id: clientId }: any) => {
          dispatch(setVideoCallState({ clientId }));
        })
        .on(SocketEvent.request, onRequest)
        .on(SocketEvent.call, onCall)
        .on(SocketEvent.end, () => endCall(false))
        .emit(SocketEvent.init);
      setIsSocketInit(true);
    }
  }, []);

  useEffect(() => {
    if (friendData && !isInitRTC) {
      const { isCaller, configStart, callID } = friendData;
      callObj.current.config = configStart;
      callObj.current.pc = (new CustomerConnection(callID));
      callObj.current.pc.on('localStream', onLocalStream);
      callObj.current.pc.on('peerStream', onPeerStream);
      callObj.current.pc.start(isCaller, configStart);
      setIsInitRTC(true);
    }
  }, [friendData, isInitRTC]);

  return (
    <div>
      {
        (!callAction && isEmpty(callObj.current.config)) && <CallScreen
          startCall={startCall}
        />
      }
      {showShape && <Shape socket={socket} />}
      {!isEmpty(callObj.current.config) && <CallAction
        config={callObj.current.config || {}}
        mediaDevice={callObj.current.pc?.mediaDevice}
        endCall={endCall}
      />}
      <CallModal
        status={callModal}
        startCall={startCall}
        rejectCall={rejectCall}
        callFrom={callFrom}
      />
    </div>
  );
};

export default VideoCall;
