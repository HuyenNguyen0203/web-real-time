import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Devices } from '../../constants/enums';
import { Button, Popup } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { AppState } from '../../redux/rootReducer';

const getButtonClass = (icon: string, enabled: boolean) => classnames(`btn-action fa ${icon}`, { disable: !enabled });

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

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
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
        <video id="peerVideo" ref={peerVideo} autoPlay />
      </div>
      <div className='local-video'>
        <video id="localVideo" ref={localVideo} autoPlay muted />
      </div>
      <div className="video-control">
        <Popup size='large' content={friendId} trigger={<h2> Contact with {friendId}</h2>} />
        <Button
          key="btnVideo"
          type="button"
          icon="video camera"
          className={getButtonClass('fa', video)}
          onClick={() => toggleMediaDevice(Devices.Video)}
        />
        <Button
          key="btnAudio"
          type="button"
          icon="microphone"
          className={getButtonClass('fa', audio)}
          onClick={() => toggleMediaDevice(Devices.Audio)}
        />
        <Button
          type="button"
          icon="phone"
          className="btn-action hangup"
          onClick={() => endCall(true)}
        />
      </div>
    </div>
  );
};

export default CallAction;
