import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import { Devices } from '../../constants/enums';
import { Button } from 'semantic-ui-react';

const getButtonClass = (icon: string, enabled: boolean) => classnames(`btn-action fa ${icon}`, { disable: !enabled });

interface CallActionProps {
  status: string;
  localSrc?: MediaProvider | null;
  peerSrc?: MediaProvider | null;
  config: {
    audio: boolean;
    video: boolean;
  };
  mediaDevice: any;
  endCall: Function;
  drawingId?: string;
  startPainWithFriend: Function;
  isShowDraw?: boolean;
  endPainWithFriend: Function;
}

const CallAction: React.FC<CallActionProps> = (props) => {
  const { status, localSrc, peerSrc, config, mediaDevice, endCall, drawingId, startPainWithFriend, isShowDraw,
    endPainWithFriend } = props;
  const peerVideo = useRef<HTMLVideoElement>(null);
  const localVideo = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  }, [peerSrc, localSrc]);

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle(Devices.Video, video);
      mediaDevice.toggle(Devices.Audio, audio);
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
      <video id="peerVideo" style={{ display: isShowDraw ? 'none' : 'block' }} ref={peerVideo} autoPlay />
      <video id="localVideo" ref={localVideo} autoPlay muted />
      <div className="video-control">
        <h2>{`${drawingId ? 'Draw' : 'Contact'} with...`}</h2>
        {
          !drawingId && <>
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
          </>
        }
        {
          drawingId && <button className="btn-draw cancel" onClick={() => endCall(true)}>Cancel</button>
        }
      </div>
    </div>
  );
};

export default CallAction;
