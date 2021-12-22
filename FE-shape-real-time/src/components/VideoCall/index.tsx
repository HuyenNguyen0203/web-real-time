import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { SocketEvent } from '../../constants/videoConstants';
import CustomerConnection from '../../utils/customerConnection';
import CallModal from './CallModal';
import CallScreen from './CallScreen';
import CallAction from './CallAction';
import { Shape } from '../Shape';

interface AppStates {
  clientId?: string;
  friendId: string;
  callAction: string;
  callModal?: string;
  callFrom?: string;
  localSrc?: null;
  peerSrc?: null;
  isShowDraw?: boolean;
}

class VideoCall extends Component<any, AppStates> {
  private config: any;
  private pc: any;
  startCallHandler: (isCaller: boolean, friendId: string, config: any) => void;
  endCallHandler: (isStarter: boolean) => void;

  rejectCallHandler: () => void;

  constructor(props: any) {
    super(props);
    this.pc = {};
    this.config = null;
    this.startCallHandler = this.startCall.bind(this);
    this.endCallHandler = this.endCall.bind(this);
    this.rejectCallHandler = this.rejectCall.bind(this);
    this.state = {
      clientId: '',
      friendId: '',
      callAction: '',
      callModal: '',
      callFrom: '',
      localSrc: null,
      peerSrc: null,
      isShowDraw: false
    };
  }

  componentDidMount() {
    this.props.socket
      .on(SocketEvent.init, ({ id: clientId }: any) => {
        this.setState({ clientId });
      })
      .on(SocketEvent.request, ({ from }: any) => {
        this.setState({ callModal: 'active', callFrom: from, friendId: from });
      })
      .on(SocketEvent.call, (data: any) => {
        if (data.sdp) {
          this.pc.setRemoteDescription(data.sdp);
          if (data.sdp.type === 'offer') this.pc.createAnswer();
        } else this.pc.addIceCandidate(data.candidate);
      })
      .on(SocketEvent.startDraw, () => {
        this.setState({ isShowDraw: true });
      })
      .on(SocketEvent.endDraw, () => {
        this.setState({ isShowDraw: false });
      })
      .on(SocketEvent.end, this.endCall.bind(this, false))
      .emit(SocketEvent.init);
  }

  /**
   * 
   * @param {boolean} isCaller
   * @param {string} friendId 
   * @param {any} config 
   */
  startCall(isCaller: boolean, friendId: string, config: any) {
    this.config = config;
    this.pc = new CustomerConnection(friendId)
      .on('localStream', (src: any) => {
        const newState: AppStates = { callAction: 'active', localSrc: src, friendId: friendId || this.state.friendId };
        if (!isCaller) newState.callModal = '';
        this.setState(newState);
      })
      .on('peerStream', (src: any) => this.setState({ peerSrc: src, friendId: friendId || this.state.friendId }))
      .start(isCaller, config);
  }

  startPainWithFriend() {
    this.setState({ isShowDraw: true }, () => {
      const { friendId } = this.state;
      this.props.socket.emit(SocketEvent.startDraw, { to: friendId });
    });
  }

  rejectCall() {
    const { callFrom } = this.state;
    this.props.socket.emit('end', { to: callFrom });
    this.setState({ callModal: '' });
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
      isShowDraw: false
    });
  }

  endPainWithFriend = () => {
    this.setState({ isShowDraw: false });
    this.props.socket.emit(SocketEvent.endDraw, { to: this.state.friendId });
  };

  render() {
    const { clientId, callFrom, callModal, callAction, localSrc, peerSrc, isShowDraw, friendId } = this.state;
    const { socket } = this.props;
    return (
      <div>
        {(!callAction || !isShowDraw) && <CallScreen
          clientId={clientId}
          startCall={this.startCallHandler}
        />}
        {!isEmpty(this.config) && (
          <CallAction
            status={callAction}
            localSrc={localSrc}
            peerSrc={peerSrc}
            config={this.config || {}}
            mediaDevice={this.pc.mediaDevice}
            endCall={this.endCallHandler}
            startPainWithFriend={this.startPainWithFriend.bind(this)}
            isShowDraw={isShowDraw}
            endPainWithFriend={this.endPainWithFriend.bind(this)}
          />
        )}
        {<CallModal
          status={callModal}
          startCall={this.startCallHandler}
          rejectCall={this.rejectCallHandler}
          callFrom={callFrom}
        />}
        {
          isShowDraw && <Shape socket={socket} friendId={friendId} />
        }
      </div>
    );
  }
}

export default VideoCall;
