/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { isEmpty } from 'lodash';
import { SocketEvent } from '../../constants/videoConstants';
import CustomerConnection from '../../utils/customerConnection';
import CallModal from './CallModal';
import CallScreen from './CallScreen';
import CallAction from './CallAction';
import ShapeCMP from '../../components/Shape';

// interface AppStates {
//   clientId?: string;
//   callAction: string;
//   callModal?: string;
//   callFrom?: string;
//   localSrc?: null;
//   peerSrc?: null;
//   isDrawing?: boolean;
//   drawingId?: string;
//   drawAction: string;
//   currentDrawingId?: string;
// }
interface VideoCallProps {
  socket: any;
}

const VideoCall: FC<VideoCallProps> = (props: VideoCallProps) => {
  const callObj: any = useRef({pc: null, config: null});
  const callLocalSrc = useRef(null);
  const callPeerSrc = useRef(null);
  const callStatus = useRef<null | string>(null);
  const [state, setState] = useState<any>({
    clientId: '123123123',
    // callAction: '',
    callModal: '',
    callFrom: '',
    // localSrc: null,
    // peerSrc: null,
    isDrawing: null,
    fromDrawId: '',
    toDrawId: '',
    drawAction: '',
    friendData: null,
  });
  const [isSocketInit, setIsSocketInit] = useState(false);
  const [isInitRTC, setIsInitRTC] = useState(false);
  /// let pc: any = useRef({});
  const { 
    clientId,
    // callAction
    callModal,
    callFrom,
    // localSrc,
    // peerSrc,
    isDrawing,
    fromDrawId,
    toDrawId,
    drawAction,
    friendData,
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
  const startCall = useCallback((data: {isCaller: boolean, friendID: string, callFrom: string, configStart: any}) => {
    onSetData({
      friendData: data,
      callModal: !(data || {isCaller: false}).isCaller ? '' : state.callModal,
    });
  }, [state]);

  const onLocalStream = useCallback(
    (src: any) => {
      console.log(' localStream ', {isCaller: (state.friendData || {isCaller: false}).isCaller, src});
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

  const startDraw = useCallback(({ from }: any) => {
          
    onSetData({ fromDrawId: from, drawAction: 'active' });
    //this.setState({ drawingId: data.from, drawAction: 'active' });
  }, [state]);

  const acceptDraw = () => {
    socket.emit(SocketEvent.draw, { to: fromDrawId });
    onSetData({ isDrawing: true });
    window.location.href = '/shape';
  };

  const startPain = (friendID: string) => {
    socket.emit(SocketEvent.startDraw, { to: friendID });
    onSetData({ toDrawId: friendID, drawAction: 'active' });
  };


  const rejectCall = () => {
    socket.emit('end', { to: callFrom });
    onSetData({ callModal: '' });
    //setCallModal('');
    //this.setState({ callModal: '' });
  };

  const rejectDraw = () => {
    socket.emit('end', { to: fromDrawId });
    onSetData({ fromDrawId: '', drawAction: '', toDrawId: '' });
    //this.setState({ drawingId: '', drawAction: '', currentDrawingId: '' });
  };

  /**
   * 
   * @param {boolean} isStarter 
   */
  // const endCall = (isStarter: boolean) => {
  //   if (callObj?.current?.pc) {
  //     callObj.current.pc.stop(isStarter);
  //   }
  //   callObj.current.pc = null;
  //   callObj.current.config = null;
  //   callPeerSrc.current = null;
  //   callLocalSrc.current = null;
  //   callStatus.current = '';
  //   onSetData({
  //     callAction: '',
  //     callModal: '',
  //     localSrc: null,
  //     peerSrc: null,
  //     fromDrawId: '',
  //     drawAction: ''
  //   });
  // };

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

  useEffect(() => {
    if (!isSocketInit && socket?.on) {
      socket
        .on(SocketEvent.init, ({ id: clientId }: any) => {
          onSetData({ clientId });
        })
        .on(SocketEvent.request, (data: any) => {
          console.log(SocketEvent.request, data.from);
          onSetData({ callModal: 'active', callFrom: data.from });
        })
        .on(SocketEvent.call, onCall)
        .on(SocketEvent.startDraw, startDraw)
        // .on(SocketEvent.draw, (data: any) => {
        //   if (data) {
        //     window.location.href = '/shape';
        //     sessionStorage.setItem('drawingId', clientId);
        //     sessionStorage.setItem('toDrawId', clientId || '');
        //   }
        // })
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
      console.log({friendData: state.friendData});
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

  return (
    <div>
      {!callAction && <CallScreen
        clientId={clientId}
        startCall={startCall}
      />}
      {(!isEmpty(callObj.current.config)) && (
        <CallAction
          status={callAction || drawAction}
          localSrc={localSrc}
          peerSrc={peerSrc}
          config={callObj.current.config || {}}
          mediaDevice={callObj.current.pc?.mediaDevice}
          endCall={endCall}
        />
      )}
      {!fromDrawId && <CallModal
        status={callModal}
        startCall={startCall}
        rejectCall={rejectCall}
        acceptDraw={acceptDraw}
        rejectDraw={rejectDraw}
        callFrom={callFrom}
      />}
    </div>
  );
};

export default VideoCall;
