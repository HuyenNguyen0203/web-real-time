import MediaDevice from './mediaDevice';
import Emitter from './emitter';
import socket from './socket';

const PC_CONFIG = { iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }] };

class CustomerConnection extends Emitter {

  private pc : any;
  private friendID : any;
  private mediaDevice : any;
  /**
     * 
     * @param {String} friendID 
     */
  constructor(friendID: String) {
    super();
    this.pc = new RTCPeerConnection(PC_CONFIG);
    this.pc.onicecandidate = (event: any) => socket.emit('call', {
      to: this.friendID,
      candidate: event.candidate
    });
    this.pc.ontrack = (event: any) => this.emit('peerStream', event.streams[0]);

    this.mediaDevice = new MediaDevice();
    this.friendID = friendID;
  }

  /**
   * Starting the call
   * @param {Boolean} isCaller
   * @param {Object} config 
   */
  start(isCaller: boolean, config: Object) {
    this.mediaDevice
      .on('stream', (stream: any) => {
        stream.getTracks().forEach((track: MediaStreamTrack) => {
          this.pc.addTrack(track, stream);
        });
        this.emit('localStream', stream);
        if (isCaller) socket.emit('request', { to: this.friendID });
        else this.createOffer();
      })
      .start(config);

    return this;
  }

  /**
   * Stop the call
   * @param {Boolean} isStarter
   */
  stop(isStarter: boolean) {
    if (isStarter) {
      socket.emit('end', { to: this.friendID });
    }
    this.mediaDevice.stop();
    this.pc.close();
    this.pc = null;
    this.off();
    return this;
  }

  createOffer() {
    this.pc.createOffer()
      .then(this.getDescription.bind(this))
      .catch((err: any) => console.log(err));
    return this;
  }

  createAnswer() {
    this.pc.createAnswer()
      .then(this.getDescription.bind(this))
      .catch((err: any) => console.log(err));
    return this;
  }

  getDescription(desc: string) {
    this.pc.setLocalDescription(desc);
    socket.emit('call', { to: this.friendID, sdp: desc });
    return this;
  }

  /**
   * @param {Object} sdp - Session description
   */
  setRemoteDescription(sdp: any) {
    const rtcSdp = new RTCSessionDescription(sdp);
    this.pc.setRemoteDescription(rtcSdp);
    return this;
  }

  /**
   * @param {Object} candidate - ICE Candidate
   */
  addIceCandidate(candidate: object) {
    if (candidate) {
      const iceCandidate = new RTCIceCandidate(candidate);
      this.pc.addIceCandidate(iceCandidate);
    }
    return this;
  }
}

export default CustomerConnection;
