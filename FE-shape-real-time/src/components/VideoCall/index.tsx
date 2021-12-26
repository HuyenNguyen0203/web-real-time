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
  const callFriendRef = useRef<null | string>(null);
  const clientIdRef = useRef<null | string>(null);
  const [state, setState] = useState<any>({
    //clientId: '',
    callModal: '',
    callFrom: '',
    friendData: null,
    isShowDraw: false,
    isStateChange: false
  });
  const [isSocketInit, setIsSocketInit] = useState(false);
  const [isInitRTC, setIsInitRTC] = useState(false);
  const {
    //clientId,
    callModal,
    callFrom,
    friendData,
    isShowDraw,
    isStateChange
    //friendId
  } = state;

  const { socket } = props;

  const onSetData = useCallback((data: {}) => {
    setState({ ...state, ...data });
  }, [state]);

  /**
   * trigger render same class component 
   */
  const forceUpdate = () => onSetData({ isStateChange: !isStateChange });

  /**
   * 
   * @param {boolean} isCaller
   * @param {string} friendID 
   * @param {any} config 
   */
  const startCall = useCallback((data: { isCaller: boolean, callID: string, callFrom: string, configStart: any }) => {
    onSetData({
      friendData: data,
      callModal: !(data || { isCaller: false }).isCaller ? '' : state.callModal,
      //friendId: data.friendID || friendId
    });
    callFriendRef.current = data.callID || callFriendRef.current;
  }, [state]);

  const onLocalStream = useCallback(
    (src: any) => {
      callLocalSrc.current = src;
      callStatus.current = 'active';
      onSetData({
        callAction: 'active'
      });
    },
    [state],
  );

  const onPeerStream = useCallback(
    (src: any) => {
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
      drawAction: '',
      friendData: null
    });
    setIsInitRTC(false);
  }, [state]);

  const startPainWithFriend = () => {
    onSetData({ isShowDraw: true });
    socket.emit(SocketEvent.startDraw, { to: callFriendRef.current });
  };

  const endPainWithFriend = () => {
    onSetData({ isShowDraw: false });
    socket.emit(SocketEvent.endDraw, { to: callFriendRef.current });
  };

  const onRequest = useCallback(({ from }: any) => {
    //onSetData({ callModal: 'active', callFrom: from, friendId: from });
    onSetData({ callModal: 'active', callFrom: from });
    callFriendRef.current = from;
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
          clientIdRef.current = clientId;
          forceUpdate();
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
  const friendId = useMemo(() => callFriendRef.current, [callFriendRef.current, state]);
  const clientId = useMemo(() => clientIdRef.current, [clientIdRef.current, state]);

  return (
    <div>
      {
        (!callAction && isEmpty(callObj.current.config)) && <CallScreen
          clientId={clientId}
          startCall={startCall}
        />
      }
      {!isEmpty(callObj.current.config) && (
        <>
          <Shape socket={socket} friendId={friendId} />
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
            friendId={friendId}
            isCaller={friendData.isCaller}
          />
        </>
      )}
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
