import React, { FC, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { isEmpty } from 'lodash';
import { SocketEvent } from '../../constants/videoConstants';
import CustomerConnection from '../../utils/customerConnection';
import CallModal from './CallModal';
import CallScreen from './CallScreen';
import CallAction from './CallAction';
import { Shape } from '../Shape';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../redux/rootReducer';
import { setCallAction, setClientId, setFriendId, setLocalSrc, setPeerSrc } from '../../redux/shape/videoCall.action';
interface VideoCallProps {
  socket: any;
}

const VideoCall: FC<VideoCallProps> = (props: VideoCallProps) => {
  const dispatch = useDispatch();
  const callObj: any = useRef({ pc: null, config: null });

  const [state, setState] = useState<any>({
    callModal: '',
    callFrom: '',
    friendData: null,
    isStateChange: false
  });
  const [isSocketInit, setIsSocketInit] = useState(false);
  const [isInitRTC, setIsInitRTC] = useState(false);
  const {
    callModal,
    callFrom,
    friendData,
  } = state;
  const { friendId, callAction, peerSrc } = useSelector(({ videoCall }: AppState) => videoCall);

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
  const startCall = useCallback((data: { isCaller: boolean, callID: string, callFrom: string, configStart: any }) => {
    onSetData({
      friendData: data,
      callModal: !(data || { isCaller: false }).isCaller ? '' : state.callModal,
    });
    dispatch(setFriendId(data.callID || friendId));
  }, [state]);

  const onLocalStream = (src: any) => {
    dispatch(setLocalSrc(src));
    //callLocalSrc.current = src;
    dispatch(setCallAction('active'));
  };

  const onPeerStream = (src: any) => {
    if (!peerSrc) {
      dispatch(setPeerSrc(src));
    }
  };

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
    dispatch(setPeerSrc(null));
    dispatch(setLocalSrc(null));
    dispatch(setCallAction(''));
    onSetData({
      callModal: '',
      friendData: null
    });
    setIsInitRTC(false);
  }, [state]);

  const onRequest = useCallback(({ from }: any) => {
    onSetData({ callModal: 'active', callFrom: from });
    dispatch(setFriendId(from));
  }, [state]);

  useEffect(() => {
    if (!isSocketInit && socket?.on) {
      socket
        .on(SocketEvent.init, ({ id: clientId }: any) => {
          dispatch(setClientId(clientId));
        })
        .on(SocketEvent.request, onRequest)
        .on(SocketEvent.call, onCall)
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

  return (
    <div>
      {
        (!callAction && isEmpty(callObj.current.config)) && <CallScreen
          startCall={startCall}
        />
      }
      {!isEmpty(callObj.current.config) && (
        <>
          <Shape socket={socket} />
          <CallAction
            config={callObj.current.config || {}}
            mediaDevice={callObj.current.pc?.mediaDevice}
            endCall={endCall}
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
