/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { SocketEvent } from '../../constants/videoConstants';
import CustomerConnection from '../../utils/customerConnection';
import CallModal from './CallModal';
import CallScreen from './CallScreen';
import CallAction from './CallAction';
import { Link } from 'react-router-dom';

interface AppStates {
  clientId?: string;
  callAction: string;
  callModal?: string;
  callFrom?: string;
  localSrc?: null;
  peerSrc?: null;
  isDrawing?: boolean;
  drawingId?: string;
  drawAction: string;
  currentDrawingId?: string;
}

class VideoCall extends Component<any, AppStates> {
  private config: any;
  private pc: any;
  private drawId: string;
  startCallHandler: (isCaller: boolean, friendID: string, config: any) => void;
  endCallHandler: (isStarter: boolean) => void;
  rejectCallHandler: () => void;
  constructor(props: any) {
    super(props);
    this.pc = {};
    this.config = null;
    this.drawId = '';
    this.startCallHandler = this.startCall.bind(this);
    this.endCallHandler = this.endCall.bind(this);
    this.rejectCallHandler = this.rejectCall.bind(this);
    this.state = {
      clientId: '',
      callAction: '',
      callModal: '',
      callFrom: '',
      localSrc: null,
      peerSrc: null,
      isDrawing: false,
      drawingId: '',
      drawAction: '',
      currentDrawingId: ''
    };
  }

  componentDidMount() {
    this.props.socket
      .on(SocketEvent.init, ({ id: clientId }: any) => {
        this.setState({ clientId });
      })
      .on(SocketEvent.request, ({ from: callFrom }: any) => {
        this.setState({ callModal: 'active', callFrom });
      })
      .on(SocketEvent.call, (data: any) => {
        if (data.sdp) {
          this.pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') this.pc.createAnswer();
        } else this.pc.addIceCandidate(data.candidate);
      })
      .on(SocketEvent.startDraw, (data: any) => {
        this.setState({ drawingId: data.from, drawAction: 'active' });
      })
      .on(SocketEvent.draw, (data: any) => {
        if (data) {
          sessionStorage.setItem('drawingId', data.from);
          sessionStorage.setItem('toDrawId', this.state.clientId || '');
          document.getElementById('go-to-shape')?.click();
        }
      })
      .on(SocketEvent.end, this.endCall.bind(this, false))
      .emit(SocketEvent.init);
  }

  /**
   * 
   * @param {boolean} isCaller
   * @param {string} friendID 
   * @param {any} config 
   */
  startCall(isCaller: boolean, friendID: string, config: any) {
    this.config = config;
    this.pc = new CustomerConnection(friendID)
      .on('localStream', (src: any) => {
        const newState: AppStates = { callAction: 'active', localSrc: src, drawAction: '' };
        if (!isCaller) newState.callModal = '';
        this.setState(newState);
      })
      .on('peerStream', (src: any) => this.setState({ peerSrc: src }))
      .start(isCaller, config);
  }

  acceptDraw() {
    const { drawingId } = this.state;
    // const canvas = document.getElementById('shape') as HTMLCanvasElement;
    // const base64ImageData = canvas.toDataURL("image/png");
    this.props.socket.emit(SocketEvent.draw, { to: drawingId });
    this.setState({ isDrawing: true });
    document.getElementById('go-to-shape')?.click();
  }

  startPain(friendID: string) {
    this.drawId = friendID;
    this.props.socket.emit(SocketEvent.startDraw, { to: friendID });
    this.setState({ currentDrawingId: friendID, drawAction: 'active' });
  }

  // handleAddPain() {
  //   if (this.state.isDrawing) {
  //     this.startPain(this.drawId);
  //   }
  // }

  rejectCall() {
    const { callFrom } = this.state;
    this.props.socket.emit('end', { to: callFrom });
    this.setState({ callModal: '' });
  }

  rejectDraw() {
    const { drawingId } = this.state;
    this.props.socket.emit('end', { to: drawingId });
    this.setState({ drawingId: '', drawAction: '', currentDrawingId: '' });
  }

  /**
   * 
   * @param {boolean} isStarter 
   */
  endCall(isStarter: boolean) {
    if (typeof (this.pc.stop) === 'function') {
      this.pc.stop(isStarter);
    }
    this.pc = {};
    this.config = null;
    this.setState({
      callAction: '',
      callModal: '',
      localSrc: null,
      peerSrc: null,
      currentDrawingId: '',
      drawAction: ''
    });
  }

  render() {
    const { clientId, callFrom, callModal, callAction, localSrc, peerSrc, currentDrawingId, drawAction } = this.state;
    return (
      <div>
        <Link id='go-to-shape' style={{display: 'none'}} to="/shape">About</Link>
        {!callAction && <CallScreen
          clientId={clientId}
          startCall={this.startCallHandler}
          startPain={this.startPain.bind(this)}
        />}
        {(!isEmpty(this.config) || currentDrawingId) && (
          <CallAction
            status={callAction || drawAction}
            localSrc={localSrc}
            peerSrc={peerSrc}
            config={this.config || {}}
            mediaDevice={this.pc.mediaDevice}
            endCall={this.endCallHandler}
            drawingId={currentDrawingId}
          />
        )}
        {!currentDrawingId && <CallModal
          status={callModal}
          startCall={this.startCallHandler}
          rejectCall={this.rejectCallHandler}
          acceptDraw={this.acceptDraw.bind(this)}
          rejectDraw={this.rejectDraw.bind(this)}
          callFrom={callFrom}
          drawAction={drawAction}
        />}
      </div>
    );
  }
}

export default VideoCall;
