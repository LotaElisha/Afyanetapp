import { VIDEO_CALLING_SOUNDS } from "../SoundPaths";
import Sound from 'react-native-sound';
import InCallManager from 'react-native-incall-manager';
import ConnectyCube from 'react-native-connectycube';
import BaseClass from "../BaseClass";

export default class CallService extends BaseClass {
    static MEDIA_OPTIONS = { audio: true, video: { facingMode: 'user' } };

    _session = null;
    mediaDevices = [];

    outgoingCall = new Sound(VIDEO_CALLING_SOUNDS.DIALLING_SOUND);
    incomingCall = new Sound(VIDEO_CALLING_SOUNDS.CALLING_SOUND);
    endCall = new Sound(VIDEO_CALLING_SOUNDS.END_CALL_SOUND);

    setMediaDevices() {
        return ConnectyCube.videochat.getMediaDevices().then(mediaDevices => {
            this.mediaDevices = mediaDevices;
        });
    }

    acceptCall = session => {
        this.stopSounds();
        this._session = session;
        this.setMediaDevices();

        return this._session
            .getUserMedia(CallService.MEDIA_OPTIONS)
            .then(stream => {
                this._session.accept({});
                return stream;
            });
    };

    startCall = ids => {
        const options = {};
        const type = ConnectyCube.videochat.CallType.VIDEO; // AUDIO is also possible       
        this._session = ConnectyCube.videochat.createNewSession(ids, type, options);
        this.setMediaDevices();
        this.playSound('outgoing');
        return this._session
            .getUserMedia(CallService.MEDIA_OPTIONS)
            .then(stream => {
                this._session.call({});
                return stream;
            });
    };

    stopCall = () => {
        this.stopSounds();
        InCallManager.stop()
        if (this._session) {
            this.playSound('end');
            this._session.stop({});
            ConnectyCube.videochat.clearSession(this._session.ID);
            this._session = null;
            this.mediaDevices = [];
        }
    };

    rejectCall = (session, extension) => {
        this.stopSounds();
        session.reject(extension);
    };

    setAudioMuteState = mute => {
        if (mute) {
            this._session.mute('audio');
        } else {
            this._session.unmute('audio');
        }
    };

    switchCamera = localStream => {
        localStream.getVideoTracks().forEach(track => track._switchCamera());
    };

    setSpeakerphoneOn = flag => InCallManager.setForceSpeakerphoneOn(flag);

    processOnUserNotAnswerListener(userId) {
        return new Promise((resolve, reject) => {
            if (!this._session) {
                reject();
            } else {
                const userName = "The other person";
                const message = `${userName} did not answer`;
                this.showToast(message);
                resolve();
            }
        });
    }

    processOnCallListener(session) {
        return new Promise((resolve, reject) => {
            if (session.initiatorID === session.currentUserID) {
                reject();
            }
            if (this._session) {
                this.rejectCall(session, { busy: true });
                reject();
            }
            this.playSound('incoming');
            resolve();
        });
    }

    processOnAcceptCallListener(session, userId, extension = {}) {
        return new Promise((resolve, reject) => {
            if (userId === session.currentUserID) {
                this._session = null;
                this.showToast('You have accepted the call on other side');

                InCallManager.start({ media: "video" })

                reject();
            } else {
                const userName = "The other person";
                const message = `${userName} has accepted the call`;
                InCallManager.start({ media: "video" })

                this.showToast(message);
                this.stopSounds();

                resolve();
            }
        });
    }

    processOnRejectCallListener(session, userId, extension = {}) {
        return new Promise((resolve, reject) => {
            if (userId === session.currentUserID) {
                this._session = null;
                this.showToast('You have rejected the call on other side');

                reject();
            } else {
                const userName = "The other person";
                const message = extension.busy
                    ? `${userName} is busy`
                    : `${userName} rejected the call request`;

                this.showToast(message);

                resolve();
            }
        });
    }

    processOnStopCallListener(userId, isInitiator) {
        return new Promise((resolve, reject) => {
            this.stopSounds();

            if (!this._session) {
                reject();
            } else {
                const userName = "The other person";
                const message = `${userName} has ${isInitiator ? 'stopped' : 'left'
                    } the call`;

                this.showToast(message);

                resolve();
            }
        });
    }

    processOnRemoteStreamListener = () => {
        return new Promise((resolve, reject) => {
            if (!this._session) {
                reject();
            } else {
                resolve();
            }
        });
    };


    playSound = type => {
        switch (type) {
            case 'outgoing':
                this.outgoingCall.setNumberOfLoops(-1);
                this.outgoingCall.play();
                break;
            case 'incoming':
                this.incomingCall.setNumberOfLoops(-1);
                this.incomingCall.play();
                break;
            case 'end':
                this.endCall.play();
                break;

            default:
                break;
        }
    };

    stopSounds = () => {
        if (this.incomingCall.isPlaying()) {
            this.incomingCall.pause();
        }
        if (this.outgoingCall.isPlaying()) {
            this.outgoingCall.pause();
        }
    };
}
