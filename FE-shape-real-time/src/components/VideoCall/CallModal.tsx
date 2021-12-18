import React from 'react';
import classnames from 'classnames';
import { Button } from 'semantic-ui-react';

interface CallModalProps {
  status?: string;
  callFrom?: string;
  startCall: Function;
  rejectCall: Function;
};

const CallModal: React.FC<CallModalProps> = (props) => {
  const { status, callFrom, startCall, rejectCall } = props
  const acceptWithVideo = (video: boolean) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom, config);
  };

  return <>
    {status === 'active' && <div className='overlay-background ' />}
    <div className={classnames('call-modal', status)}>
      <p>
        <span className="caller">{`${callFrom} is calling`}</span>
      </p>
      <Button
        type="button"
        className="btn-action fa fa-video-camera"
        onClick={acceptWithVideo(true)}
      />
      <Button
        type="button"
        className="btn-action fa fa-phone"
        onClick={acceptWithVideo(false)}
      />
      <Button
        type="button"
        className="btn-action hangup fa fa-phone"
        onClick={() => rejectCall()}
      />
    </div>
  </>
}


export default CallModal;
