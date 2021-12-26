import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Devices } from '../../constants/enums';
import { Button } from 'semantic-ui-react';

const getButtonClass = (icon: string, enabled: boolean) => classnames(`btn-action fa ${icon}`, { disable: !enabled });

interface CallActionProps {
  status: string | null;
  localSrc?: MediaProvider | null;
  peerSrc?: MediaProvider | null;
  config: {
    audio: boolean;
    video: boolean;
  };
  mediaDevice: any;
  endCall: Function;
  startPainWithFriend: Function;
  isShowDraw?: boolean;
  endPainWithFriend: Function;
  friendId: string | null;
  isCaller: boolean;
}

const CallAction: React.FC<CallActionProps> = (props) => {
  const peerVideo = useRef<HTMLVideoElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState(props.config.video);
  const [audio, setAudio] = useState(props.config.audio);
  const [isInitMediaDevice, setIsInitMediaDevice] = useState(false);

  const { status, localSrc, peerSrc, mediaDevice, endCall, friendId, isCaller } = props;

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
    <div className={classnames('call-window', status)}>
      <div className='peer-video'>
        {/* <p>{isCaller ? 'reciver' : 'caller'}</p> */}
        <video id="peerVideo" ref={peerVideo} autoPlay />
      </div>
      <div className='local-video'>
        {/* <p>{isCaller ? 'caller' : 'reciver'}</p> */}
        <video id="localVideo" ref={localVideo} autoPlay muted />
      </div>
      <div className="video-control">
        <h2>Contact with {friendId}</h2>
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
