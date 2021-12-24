import React, { useState } from 'react';
import { Icon, Input } from 'semantic-ui-react';

interface CallScreenProps {
  startCall?: Function;
  clientId?: string;
}

const CallScreen: React.FC<CallScreenProps> = (props) => {
  const [friendID, setFriendID] = useState(null);
  const [isCopied, setIscopied] = useState(false);

  const { startCall, clientId } = props;
  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video: boolean) => {
    if (clientId && startCall) {
      startCall({isCaller: true, callID: friendID, configStart: { audio: true, video }});
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
        <div>
          <button
            type="button"
            disabled={!friendID}
            className="btn-action fa fa-video-camera"
            onClick={() => callWithVideo(true)}
          />
          <button
            type="button"
            disabled={!friendID}
            className="btn-action fa fa-phone"
            onClick={() => callWithVideo(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default CallScreen;