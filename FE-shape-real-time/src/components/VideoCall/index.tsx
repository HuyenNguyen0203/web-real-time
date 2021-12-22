/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';
import { SocketEvent } from '../../constants/videoConstants';
import CustomerConnection from '../../utils/customerConnection';
import CallModal from './CallModal';
import CallScreen from './CallScreen';
import CallAction from './CallAction';

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
  const [state, setState] = useState({
    clientId: '',
    callAction: '',
    callModal: '',
    callFrom: '',
    localSrc: null,
    peerSrc: null,
    isDrawing: false,
    fromDrawId: '',
    toDrawId: '',
    drawAction: ''
  });
  const [isSocketInit, setIsSocketInit] = useState(false);
  const { socket } = props;
  const { clientId, callAction, callModal, callFrom, localSrc, peerSrc, isDrawing, fromDrawId, toDrawId, drawAction } = state;
  const callObj: any = useRef({pc: null, config: null});
  /// let pc: any = useRef({});

  const onSetData = (data: Object) => {
    setState({ ...state, ...data });
  };

  /**
   * 
   * @param {boolean} isCaller
   * @param {string} friendID 
   * @param {any} config 
   */
  const startCall = (isCaller: boolean, friendID: string, configStart: any) => {
    callObj.current.config = configStart;
    callObj.current.pc = new CustomerConnection(friendID)
      .on('localStream', (src: any) =>
        onSetData({
          callModal: !isCaller ? '' : callModal,
          CallAction: 'active',
          localSrc: src
        }))
      .on('peerStream', (src: any) => onSetData({
        peerSrc: src
      }))
      .start(isCaller, configStart);
  };

  const acceptDraw = () => {
    // const canvas = document.getElementById('shape') as HTMLCanvasElement;
    // const base64ImageData = canvas.toDataURL("image/png");
    socket.emit(SocketEvent.draw, { to: fromDrawId });
    onSetData({ isDrawing: true });
    window.location.href = '/shape';
  };

  const startPain = (friendID: string) => {
    socket.emit(SocketEvent.startDraw, { to: friendID });
    onSetData({ toDrawId: friendID, drawAction: 'active' });

    //this.setState({ currentDrawingId: friendID, drawAction: 'active' });
  };

  // handleAddPain() {
  //   if (this.state.isDrawing) {
  //     this.startPain(this.drawId);
  //   }
  // }

  const rejectCall = () => {
    socket.emit('end', { to: callFrom });
    onSetData({ callModal: '' });
    //setCallModal('');
    //this.setState({ callModal: '' });
  };

  const rejectDraw = () => {
    socket.emit('end', { to: fromDrawId });
    onSetData({ fromDrawId: '', srawAction: '', toDrawId: '' });
    //this.setState({ drawingId: '', drawAction: '', currentDrawingId: '' });
  };

  /**
   * 
   * @param {boolean} isStarter 
   */
  const endCall = (isStarter: boolean) => {
    if (typeof (callObj?.pc?.stop) === 'function') {
      callObj?.pc?.stop(isStarter);
    }
    callObj.current.pc = {};
    callObj.current.config = null;
    onSetData({
      callAction: '',
      callModal: '',
      localSrc: null,
      peerSrc: null,
      fromDrawId: '',
      drawAction: ''
    });
    // this.setState({
    //   callAction: '',
    //   callModal: '',
    //   localSrc: null,
    //   peerSrc: null,
    //   currentDrawingId: '',
    //   drawAction: ''
    // });
  };

  useEffect(() => {
    if (!isSocketInit && socket?.on) {
      socket
        .on(SocketEvent.init, ({ id: clientId }: any) => {
          onSetData({ clientId });
        })
        .on(SocketEvent.request, ({ from }: any) => {
          onSetData({ callModal: 'active', callFrom: from });
        })
        .on(SocketEvent.call, ({ sdp, candidate }: any) => {
          if (sdp) {
            callObj.current.pc.setRemoteDescription(sdp);
            if (sdp.type === 'offer') {
              callObj.current.pc.createAnswer();
            }
          } else {
            callObj.current.pc.addIceCandidate(candidate);
          }
        })
        .on(SocketEvent.startDraw, ({ from }: any) => {
          onSetData({ fromDrawId: from, drawAction: 'active' });
          //this.setState({ drawingId: data.from, drawAction: 'active' });
        })
        .on(SocketEvent.draw, (data: any) => {
          if (data) {
            window.location.href = '/shape';
            sessionStorage.setItem('drawingId', data.from);
            sessionStorage.setItem('toDrawId', clientId || '');
          }
        })
        .on(SocketEvent.end, () => endCall(false))
        .emit(SocketEvent.init);
      setIsSocketInit(true);
    }
  }, [socket]);

  return (
    <div>
      {!callAction && <CallScreen
        clientId={clientId}
        startCall={startCall}
        startPain={startPain}
      />}
      {(!!callObj.current.config || fromDrawId) && (
        <CallAction
          status={callAction || drawAction}
          localSrc={localSrc}
          peerSrc={peerSrc}
          config={callObj.current.config || {}}
          mediaDevice={callObj.current.pc?.mediaDevice}
          endCall={endCall}
          drawingId={fromDrawId}
        />
      )}
      {!fromDrawId && <CallModal
        status={callModal}
        startCall={startCall}
        rejectCall={rejectCall}
        acceptDraw={acceptDraw}
        rejectDraw={rejectDraw}
        callFrom={callFrom}
        drawAction={drawAction}
      />}
    </div>
  );
};

export default VideoCall;
