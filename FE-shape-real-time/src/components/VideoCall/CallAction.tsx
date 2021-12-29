import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Devices } from '../../constants/enums';
import { Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/rootReducer';
import ButtonCall from '../share/ButtonAction';
interface CallActionProps {
  config: {
    audio: boolean;
    video: boolean;
  };
  mediaDevice: any;
  endCall: Function;
}

const CallAction: React.FC<CallActionProps> = (props) => {
  const peerVideo = useRef<HTMLVideoElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState(props.config.video);
  const [audio, setAudio] = useState(props.config.audio);
  const [isInitMediaDevice, setIsInitMediaDevice] = useState(false);

  const { mediaDevice, endCall } = props;
  const { friendId, peerSrc, localSrc, callAction } = useSelector(({ videoCall }: AppState) => videoCall);

  useEffect(() => {
    if (peerVideo.current && peerSrc && isInitMediaDevice) {
      peerVideo.current.srcObject = peerSrc;
    }
    if (localVideo.current && localSrc && isInitMediaDevice) {
      localVideo.current.srcObject = localSrc;
    }
  }, [peerSrc, localSrc, isInitMediaDevice]);

  useEffect(() => {
    if (mediaDevice && !isInitMediaDevice) {
      mediaDevice.toggle(Devices.Video, video);
      mediaDevice.toggle(Devices.Audio, audio);
      setIsInitMediaDevice(true);
    }
  }, [mediaDevice]);

  const toggleMediaDevice = (deviceType: string) => {
    if (deviceType === Devices.Video) {
      setVideo(!video);
      mediaDevice.toggle(Devices.Video);
    }
    if (deviceType === Devices.Audio) {
      setAudio(!audio);
      mediaDevice.toggle(Devices.Audio);
    }
  };

  return (
    <div className={classnames('call-window', callAction)}>
      <div className='peer-video'>
        <p>Receiver</p>
        <video id="peerVideo" ref={peerVideo} autoPlay />
      </div>
      <div className='local-video'>
        <p>Me</p>
        <video id="localVideo" ref={localVideo} autoPlay muted />
      </div>
      <div className="video-control">
        <Popup size='large' content={friendId} trigger={<h2> Contact with {friendId}</h2>} />
        <ButtonCall
          endCall={endCall}
          video={video}
          audio={audio}
          onCamera={() => toggleMediaDevice(Devices.Video)}
          onAudio={() => toggleMediaDevice(Devices.Audio)}
          isShowAcceptPhone={false}
        />
      </div>
    </div>
  );
};

export default CallAction;
