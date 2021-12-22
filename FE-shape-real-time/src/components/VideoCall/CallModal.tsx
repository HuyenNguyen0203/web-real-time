import React from 'react';
import classnames from 'classnames';

interface CallModalProps {
  status?: string;
  callFrom?: string;
  startCall: Function;
  rejectCall: Function;
  drawAction?: string;
  acceptDraw: Function;
  rejectDraw: Function;
}

const CallModal: React.FC<CallModalProps> = (props) => {
  const { status, callFrom, startCall, rejectCall, drawAction, acceptDraw, rejectDraw } = props;
  const acceptWithVideo = (video: boolean) => {
    const config = { audio: true, video };
    return () => startCall(false, callFrom, config);
  };

  const renderCallModal = () => {
    if (status === 'active') {
      return <div className={classnames('call-modal', status)}>
        <p>
          <span className="caller">{`${callFrom} incoming call `}</span>
        </p>
        <button
          type="button"
          className="btn-action fa fa-video-camera"
          onClick={acceptWithVideo(true)}
        />
        <button
          type="button"
          className="btn-action fa fa-phone"
          onClick={acceptWithVideo(false)}
        />
        <button
          type="button"
          className="btn-action hangup fa fa-phone"
          onClick={() => rejectCall()}
        />
      </div>;
    } else if (drawAction === 'active') {
      return <div className={classnames('call-modal', drawAction)}>
        <p>
          <span className="caller">{`${callFrom} Incoming draw`}</span>
        </p>
        <button type="button" className="btn-draw accept" onClick={() => acceptDraw()}>Accept</button>
        <button className="btn-draw cancel" onClick={() => rejectDraw()}>Cancel</button>
      </div>;
    }
  };

  return <>
    {(status === 'active' || drawAction === 'active') && <div className='overlay-background ' />}
    {renderCallModal()}
  </>;
};


export default CallModal;
