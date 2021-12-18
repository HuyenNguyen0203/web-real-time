import React, { Component } from 'react';
import _ from 'lodash';
import socket from './utils/socket';
import PeerConnection from './utils/peerConnection';
import CallScreen from './components/VideoCall/CallScreen';
import CallAction from './components/VideoCall/CallAction';
import CallModal from './components/VideoCall/CallModal';
import { SocketEvent } from './constants/videoConstants';

interface AppStates {
  clientId?: string;
  callAction: string;
  callModal?: string;
  callFrom?: string;
  localSrc?: null,
  peerSrc?: null
}

interface AppProps {

}

class App extends Component<AppProps, AppStates> {
  private config: any;
  private pc: any;
  startCallHandler: (isCaller: boolean, friendID: string, config: any) => void;
  endCallHandler: (isStarter: boolean) => void;
  rejectCallHandler: () => void;
  constructor(props: AppProps) {
    super(props);
    this.pc = {};
    this.config = null;
    this.startCallHandler = this.startCall.bind(this);
    this.endCallHandler = this.endCall.bind(this);
    this.rejectCallHandler = this.rejectCall.bind(this);
    this.state = {
      clientId: '',
      callAction: '',
      callModal: '',
      callFrom: '',
      localSrc: null,
      peerSrc: null
    }
  }

  componentDidMount() {
    socket
      .on(SocketEvent.init, ({ id: clientId }) => {
        document.title = `${clientId} - VideoCall`;
        this.setState({ clientId });
      })
      .on(SocketEvent.request, ({ from: callFrom }) => {
        this.setState({ callModal: 'active', callFrom });
      })
      .on(SocketEvent.call, (data) => {
        if (data.sdp) {
          this.pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') this.pc.createAnswer();
        } else this.pc.addIceCandidate(data.candidate);
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
    this.pc = new PeerConnection(friendID)
      .on('localStream', (src: any) => {
        const newState: AppStates = { callAction: 'active', localSrc: src };
        if (!isCaller) newState.callModal = '';
        this.setState(newState);
      })
      .on('peerStream', (src: any) => this.setState({ peerSrc: src }))
      .start(isCaller, config);
  }

  rejectCall() {
    const { callFrom } = this.state;
    socket.emit('end', { to: callFrom });
    this.setState({ callModal: '' });
  }

  /**
   * 
   * @param {boolean} isStarter 
   */
  endCall(isStarter: boolean) {
    if (_.isFunction(this.pc.stop)) {
      this.pc.stop(isStarter);
    }
    this.pc = {};
    this.config = null;
    this.setState({
      callAction: '',
      callModal: '',
      localSrc: null,
      peerSrc: null
    });
  }

  render() {
    const { clientId, callFrom, callModal, callAction, localSrc, peerSrc } = this.state;
    return (
      <div>
        <CallScreen
          clientId={clientId}
          startCall={this.startCallHandler}
        />
        {!_.isEmpty(this.config) && (
          <CallAction
            status={callAction}
            localSrc={localSrc}
            peerSrc={peerSrc}
            config={this.config}
            mediaDevice={this.pc.mediaDevice}
            endCall={this.endCallHandler}
          />
        )}
        <CallModal
          status={callModal}
          startCall={this.startCallHandler}
          rejectCall={this.rejectCallHandler}
          callFrom={callFrom}
        />
      </div>
    );
  }
}

export default App;
