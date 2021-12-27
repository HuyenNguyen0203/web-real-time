import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Icon, Input } from 'semantic-ui-react';
import { AppState } from '../../redux/rootReducer';

interface CallScreenProps {
  startCall?: Function;
}

const CallScreen: React.FC<CallScreenProps> = (props) => {
  const [friendID, setFriendID] = useState(null);
  const [isCopied, setIscopied] = useState(false);

  const { startCall } = props;
  const { clientId } = useSelector(({ videoCall }: AppState) => videoCall);
  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video: boolean) => {
    if (clientId && startCall && friendID !== clientId) {
      startCall({ isCaller: true, callID: friendID, configStart: { audio: true, video } });
    }
  };

  /**
  * Start the call with or without video
  * @param {Boolean} video
  */

  const copyElement = () => {
    if (!isCopied) {
      navigator.clipboard.writeText(clientId || '');
      setIscopied(true);
    }
  };

  return (
    <div className="container main-window">
      <div className='meeting-page'>
        <h1>
          Welcome to meeting
        </h1>
        <div className='client-id'>
          <div className='text-id truncate clearfix' id='client-id'>ID: {clientId}</div>
          {isCopied ? <span className='icon-copy'><Icon name='check' /> </span>
            : <span className='icon-copy' onClick={copyElement}><Icon className='copy' name='copy' /></span>}
        </div>
        <h3>Please input connect ID </h3>
        <Input
          type="text"
          className='other-id'
          spellCheck={false}
          placeholder='Please input ID'
          onChange={(event: any) => setFriendID(event.target.value)} />
        <div className='action-screen'>
          <Button
            type="button"
            disabled={!friendID}
            icon="video camera"
            className="btn-action"
            onClick={() => callWithVideo(true)}
          />
          <Button
            type="button"
            icon="phone"
            disabled={!friendID}
            className="btn-action"
            onClick={() => callWithVideo(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default CallScreen;