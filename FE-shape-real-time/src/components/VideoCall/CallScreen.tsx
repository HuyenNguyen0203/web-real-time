import React, { useState } from 'react';
import { Input, Button } from 'semantic-ui-react';

interface CallScreenProps {
  startCall: Function;
  clientId?: string;
}

const CallScreen: React.FC<CallScreenProps> = (props) => {
  const { startCall, clientId } = props;
  const [friendID, setFriendID] = useState(null);

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video: boolean) => {
    const config = { audio: true, video };
    if (friendID) {
      startCall(true, friendID, config);
    }
  };

  return (
    <div className="container main-window">
      <div className='meeting-page'>
        <h1>
          Welcome to meeting
        </h1>
        <span className='text-id clearfix'>ID: {clientId}</span>
        <h3>Get started by ID meeting  below</h3>
        <Input
          type="text"
          className='other-id'
          spellCheck={false}
          focus
          placeholder='Please input ID'
          onChange={(event: any) => setFriendID(event.target.value)} />
        <div>
          <Button
            type="button"
            className="btn-action fa fa-video-camera"
            onClick={() => callWithVideo(true)}
          />
          <Button
            type="button"
            className="btn-action fa fa-phone"
            onClick={() => callWithVideo(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default CallScreen;