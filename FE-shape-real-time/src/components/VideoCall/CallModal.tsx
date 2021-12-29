import React from 'react';
import classnames from 'classnames';
import { Button } from 'semantic-ui-react';
import ButtonCall from '../share/ButtonAction';
interface CallModalProps {
  status?: string;
  callFrom?: string;
  startCall: Function;
  rejectCall: Function;
}

const CallModal: React.FC<CallModalProps> = (props) => {
  const { status, callFrom, startCall, rejectCall } = props;
  const acceptWithVideo = (video: boolean) => {
    startCall({ isCaller: false, callID: callFrom, configStart: { audio: true, video } });
  };

  const renderCallModal = () => {
    if (status === 'active') {
      return <div className={classnames('call-modal', status)}>
        <p>
          <span className="caller">{`${callFrom} incoming call `}</span>
        </p>

        <ButtonCall
          endCall={() => rejectCall()}
          video
          audio
          onCamera={() => acceptWithVideo(true)}
          onAudio={() => acceptWithVideo(false)}
          isShowAcceptPhone
        />
      </div>;
    }
  };

  return <>
    {status === 'active' && <div className='overlay-background ' />}
    {renderCallModal()}
  </>;
};

export default CallModal;
