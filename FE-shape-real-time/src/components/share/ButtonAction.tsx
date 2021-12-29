import classNames from 'classnames';
import * as React from 'react';
import { Button } from 'semantic-ui-react';
import { Devices } from '../../constants/enums';

interface ButtonCallProps {
    endCall: Function;
    video: boolean;
    audio: boolean;
    onCamera: Function;
    onAudio: Function;
    isShowAcceptPhone: boolean;
}
const getButtonClass = (icon: string, enabled: boolean) => classNames(`btn-action fa ${icon}`, { disable: !enabled });

const ButtonCall = (props: ButtonCallProps) => {
    const { endCall, video, audio, onCamera, onAudio, isShowAcceptPhone } = props;
    return (
        <>
            <Button
                key="btnVideo"
                icon="video camera"
                className={getButtonClass('fa', video)}
                onClick={() => onCamera()}
            />
            {
                isShowAcceptPhone ? <Button
                    icon="phone"
                    className="btn-action"
                    onClick={() => onAudio()}
                /> : <Button
                    icon="microphone"
                    className={getButtonClass('fa', audio)}
                    onClick={() => onAudio()}
                />
            }
            <Button
                icon="phone"
                className="btn-action hangup"
                onClick={() => endCall(true)}
            />
        </>
    );
};

export default ButtonCall;
