import React, { FC, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { isEmpty } from 'lodash';
import { SocketEvent } from '../../constants/videoConstants';
import CustomerConnection from '../../utils/customerConnection';
import CallModal from './CallModal';
import CallScreen from './CallScreen';
import CallAction from './CallAction';
import { Shape } from '../Shape';
interface VideoCallProps {
  socket: any;
}

const VideoCall: FC<VideoCallProps> = (props: VideoCallProps) => {
  const callObj: any = useRef({ pc: null, config: null });
  const callLocalSrc = useRef(null);
  const callPeerSrc = useRef(null);
  const callStatus = useRef<null | string>(null);
  const [state, setState] = useState<any>({
    clientId: '',
    callModal: '',
    callFrom: '',
    friendData: null,
    isShowDraw: false,
    friendId: ''
  });
  const [isSocketInit, setIsSocketInit] = useState(false);
  const [isInitRTC, setIsInitRTC] = useState(false);
  const {
    clientId,
    callModal,
    callFrom,
    friendData,
    isShowDraw,
    friendId
  } = state;

  const { socket } = props;

  const onSetData = useCallback((data: {}) => {
    setState({ ...state, ...data });
  }, [state]);

  /**
   * 
   * @param {boolean} isCaller
   * @param {string} friendID 
   * @param {any} config 
   */
  const startCall = useCallback((data: { isCaller: boolean, friendID: string, callFrom: string, configStart: any }) => {
    onSetData({
      friendData: data,
      callModal: !(data || { isCaller: false }).isCaller ? '' : state.callModal,
      friendId: data.friendID || friendId
    });
  }, [state]);

  const onLocalStream = useCallback(
    (src: any) => {
      console.log(' localStream ', { isCaller: (state.friendData || { isCaller: false }).isCaller, src });
      callLocalSrc.current = src;
      callStatus.current = 'active';
      onSetData({
        callAction: 'active',
        localSrc: src,
      });
    },
    [state],
  );

  const onPeerStream = useCallback(
    (src: any) => {
      console.log(' peerStream ', callPeerSrc.current, src);
      if (!callPeerSrc.current) {
        callPeerSrc.current = src;
        onSetData({
          localSrc: callLocalSrc.current,
          peerSrc: src
        });
      }
    },
    [state],
  );

  const onCall = useCallback(({ sdp, candidate }: any) => {
    if (sdp) {
      callObj.current.pc.setRemoteDescription(sdp);
      if (sdp.type === 'offer') {
        callObj.current.pc.createAnswer();
      }
    } else {
      callObj.current.pc.addIceCandidate(candidate);
    }
  }, [state]);


  const rejectCall = () => {
    socket.emit('end', { to: callFrom });
    onSetData({ callModal: '' });
  };

  /**
   * 
   * @param {boolean} isStarter 
   */
  const endCall = useCallback((isStarter: boolean) => {
    if (callObj?.current?.pc) {
      callObj.current.pc.stop(isStarter);
    }
    callObj.current.pc = null;
    callObj.current.config = null;
    callPeerSrc.current = null;
    callLocalSrc.current = null;
    callStatus.current = '';
    onSetData({
      callAction: '',
      callModal: '',
      localSrc: null,
      peerSrc: null,
      fromDrawId: '',
      drawAction: ''
    });
  }, [state]);

  const startPainWithFriend = () => {
    onSetData({ isShowDraw: true });
    socket.emit(SocketEvent.startDraw, { to: friendId });
  };

  const endPainWithFriend = () => {
    onSetData({ isShowDraw: false });
    socket.emit(SocketEvent.endDraw, { to: friendId });
  };

  const onRequest = useCallback(({ from }: any) => {
    onSetData({ callModal: 'active', callFrom: from, friendId: from });
  }, [state]);


  const onStartDraw = useCallback(() => {
    onSetData({ ...state, isShowDraw: true });
  }, [state]);


  const onEndDraw = useCallback(() => {
    onSetData({ ...state, isShowDraw: false });
  }, [state]);

  useEffect(() => {
    if (!isSocketInit && socket?.on) {
      socket
        .on(SocketEvent.init, ({ id: clientId }: any) => {
          onSetData({ clientId });
        })
        .on(SocketEvent.request, onRequest)
        .on(SocketEvent.call, onCall)
        .on(SocketEvent.startDraw, onStartDraw)
        .on(SocketEvent.endDraw, onEndDraw)
        .on(SocketEvent.end, () => endCall(false))
        .emit(SocketEvent.init);
      setIsSocketInit(true);
    }
    // Return a callback to be run before unmount-ing.
    return () => {
      // socket.close();
    };
  }, []);

  useEffect(() => {
    if (friendData && !isInitRTC) {
      const { isCaller, configStart, callID } = friendData;
      console.log({ friendData: state.friendData });
      callObj.current.config = configStart;
      callObj.current.pc = (new CustomerConnection(callID));
      callObj.current.pc.on('localStream', onLocalStream);
      callObj.current.pc.on('peerStream', onPeerStream);
      callObj.current.pc.start(isCaller, configStart);
      setIsInitRTC(true);
    }
  }, [friendData, isInitRTC]);

  const localSrc = useMemo(() => callLocalSrc.current, [callLocalSrc.current, state]);
  const peerSrc = useMemo(() => callPeerSrc.current, [callPeerSrc.current, state]);
  const callAction = useMemo(() => callStatus.current, [callStatus.current, state]);

  console.log('abc:', { localSrc, peerSrc, callAction, friendId, clientId, state, callObj });

  return (
    <div>
      {
        (!callAction || !isShowDraw) && <CallScreen
          clientId={clientId}
          startCall={startCall}
        />
      }
      {!isEmpty(callObj.current.config) && (
        <CallAction
          status={callAction}
          localSrc={localSrc}
          peerSrc={peerSrc}
          config={callObj.current.config || {}}
          mediaDevice={callObj.current.pc?.mediaDevice}
          endCall={endCall}
          startPainWithFriend={startPainWithFriend}
          isShowDraw={isShowDraw}
          endPainWithFriend={endPainWithFriend}
        />
      )}
      <CallModal
        status={callModal}
        startCall={startCall}
        rejectCall={rejectCall}
        callFrom={callFrom}
      />
      {
        isShowDraw && <Shape socket={socket} friendId={friendId} />
      }
    </div>
  );
};

export default VideoCall;
