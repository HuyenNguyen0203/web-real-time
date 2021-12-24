import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Devices } from '../../constants/enums';

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
}

const CallAction: React.FC<CallActionProps> = (props) => {
  const peerVideo = useRef<HTMLVideoElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState(props.config.video);
  const [audio, setAudio] = useState(props.config.audio);
  const [isInitMediaDevice, setIsInitMediaDevice] = useState(false);

  const { status, localSrc, peerSrc, mediaDevice, endCall, startPainWithFriend, isShowDraw,
    endPainWithFriend } = props;

  useEffect(() => {
    if (peerVideo.current && peerSrc && isInitMediaDevice) {
      console.log(' INIT VIDEO peerVideo');
      peerVideo.current.srcObject = peerSrc;
    }
    if (localVideo.current && localSrc && isInitMediaDevice) {
      console.log(' INIT VIDEO localVideo');
      localVideo.current.srcObject = localSrc;
    }
  }, [peerSrc, localSrc, isInitMediaDevice]);

  useEffect(() => {
    if (mediaDevice && !isInitMediaDevice) {
      console.log(' INIT mediaDevice ');
      console.log({ mediaDevice });
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
      mediaDevice.toggle(Devices.Video, !video);
    }
    if (deviceType === Devices.Audio) {
      setAudio(!audio);
      mediaDevice.toggle(Devices.Audio, !audio);
    }
  };
  console.log('bbbb:',{ peerSrc, status, localSrc });
  return (
    <div className={classnames('call-window', status)}>
      <video id="peerVideo" style={{ display: isShowDraw ? 'none' : 'block' }} ref={peerVideo} autoPlay />
      <video id="localVideo" ref={localVideo} autoPlay muted />
      <div className="video-control">
        <h2>Contact with...</h2>
        <button
          key="btnVideo"
          type="button"
          className={getButtonClass('fa-video-camera', video)}
          onClick={() => toggleMediaDevice(Devices.Video)}
        />
        <button
          key="btnAudio"
          type="button"
          className={getButtonClass('fa-microphone', audio)}
          onClick={() => toggleMediaDevice(Devices.Audio)}
        />
        {
          !isShowDraw && <button
            type="button"
            className={getButtonClass('fa-paint-brush btn-pain', false)}
            onClick={() => startPainWithFriend()}
          />
        }
        {
          isShowDraw && <button
            type="button"
            className={getButtonClass('fa-paint-brush btn-unpain', false)}
            onClick={() => endPainWithFriend()}
          />
        }
        <button
          type="button"
          className="btn-action hangup fa fa-phone"
          onClick={() => endCall(true)}
        />
      </div>
    </div>
  );
};

export default CallAction;
