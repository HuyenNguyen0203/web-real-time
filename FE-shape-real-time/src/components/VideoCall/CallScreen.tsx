import React, { useState } from 'react';
import { Input } from 'semantic-ui-react';

interface CallScreenProps {
  startCall?: Function;
  clientId?: string;
  startPain?: Function;
}

const CallScreen: React.FC<CallScreenProps> = (props) => {
  const [friendID, setFriendID] = useState(null);

  const { startCall, clientId, startPain } = props;
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
  const startPainWithFriend = () => {
    if (friendID && typeof (startPain) === 'function') {
      startPain(friendID);
    }
  };

  return (
    <div className="container main-window">
      <div className='meeting-page'>
        <h1>
          Welcome to meeting
        </h1>
        
        <span className='text-id clearfix'>{clientId}</span>
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
          <button
            type="button"
            disabled={!friendID}
            className="btn-action btn-paint fa fa-paint-brush"
            onClick={() => startPainWithFriend()}
          />
        </div>
      </div>
    </div>
  );
};

export default CallScreen;