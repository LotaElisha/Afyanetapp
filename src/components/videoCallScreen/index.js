import React from 'react';
import { Platform, SafeAreaView, StatusBar, View } from 'react-native';
import ConnectyCube from 'react-native-connectycube';
import AwesomeAlert from 'react-native-awesome-alerts';
import RTCViewGrid from './RTCViewGrid';
import { ConnectycubeCallServices } from '../../utils/services';
import ToolBar from './ToolBar';
import BaseClass from "../../utils/BaseClass";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AntDesign from "react-native-vector-icons/AntDesign";
import COLORS from "../../themes/Colors";
import OrientationLoadingOverlay from "../../utils/CustomLoader";

export default class VideoScreen extends BaseClass {
    constructor(props) {
        super(props);
        const { route } = this.props;
        this._session = null;
        this.opponentsIds = route.params.opponentsIds;
        console.warn('params===', route.params)

        this.state = {
            localStream: null,
            remoteStreams: [],
            selectedUsersIds: route.params.opponentsIds,
            senderId: route.params.sender_id,
            recieverId: route.params.receiver_id,
            isActiveSelect: true,
            isActiveCall: false,
            isIncomingCall:  false,
            isLoading: route.params.userName === undefined ? true : false
        };
        this._setUpListeners();
    }

    componentWillUnmount() {
        ConnectycubeCallServices.stopCall();
    }
    componentDidMount() {
        setTimeout(() => { this.setState({ isLoading: false }) }, 1500)
    }
    componentDidUpdate(prevProps, prevState) {
        const currState = this.state;
        if (
            prevState.remoteStreams.length === 1 &&
            currState.remoteStreams.length === 0
        ) {
            ConnectycubeCallServices.stopCall();
            this.resetState();
        }
    }

    showInomingCallModal = async (session) => {
        this._session = session;
        this.setState({
            isIncomingCall: true
        });
    };

    hideInomingCallModal = () => {
        this._session = null;
        this.setState({ isIncomingCall: false });
    };

    selectUser = userId => {
        this.setState(prevState => ({
            selectedUsersIds: [...prevState.selectedUsersIds, userId],
        }));
    };

    unselectUser = userId => {
        this.setState(prevState => ({
            selectedUsersIds: prevState.selectedUsersIds.filter(id => userId !== id),
        }));
    };

    closeSelect = () => {
        this.setState({ isActiveSelect: false });
    };

    setOnCall = () => {
        this.setState({ isActiveCall: true });
    };

    initRemoteStreams = opponentsIds => {
        const emptyStreams = opponentsIds.map(userId => ({
            userId,
            stream: null,
        }));
        console.warn("arrr123", emptyStreams)
        this.setState({ remoteStreams: emptyStreams });
    };

    updateRemoteStream = (userId, stream) => {
        this.setState(({ remoteStreams }) => {
            const updatedRemoteStreams = remoteStreams.map(item => {
                if (item.userId === userId) {
                    return { userId, stream };
                }

                return { userId: item.userId, stream: item.stream };
            });

            return { remoteStreams: updatedRemoteStreams };
        });
    };

    removeRemoteStream = userId => {
        this.setState(({ remoteStreams }) => ({
            remoteStreams: remoteStreams.filter(item => item.userId !== userId),
        }));
    };

    setLocalStream = stream => {
        this.setState({ localStream: stream });
    };

    resetState = () => {
        this.setState({
            localStream: null,
            remoteStreams: [],
            // selectedUsersIds: [],
            isActiveSelect: true,
            isActiveCall: false,
        });
    };

    _setUpListeners() {
        ConnectyCube.videochat.onCallListener = this._onCallListener;
        ConnectyCube.videochat.onAcceptCallListener = this._onAcceptCallListener;
        ConnectyCube.videochat.onRejectCallListener = this._onRejectCallListener;
        ConnectyCube.videochat.onStopCallListener = this._onStopCallListener;
        ConnectyCube.videochat.onUserNotAnswerListener = this._onUserNotAnswerListener;
        ConnectyCube.videochat.onRemoteStreamListener = this._onRemoteStreamListener;
    }

    _onPressAccept = () => {
        
        ConnectycubeCallServices.acceptCall(this._session).then(stream => {
            const { opponentsIDs, initiatorID, currentUserID } = this._session;
            const opponentsIds = [initiatorID, ...opponentsIDs].filter(
                userId => currentUserID !== userId,
            );

            this.initRemoteStreams(opponentsIds);
            this.setLocalStream(stream);
            this.closeSelect();
            this.hideInomingCallModal();
        });
    };

    _onPressReject = () => {
        ConnectycubeCallServices.rejectCall(this._session);
        this.hideInomingCallModal();
    };

    _onCallListener = (session, extension) => {
        ConnectycubeCallServices.processOnCallListener(session)
            .then(() => {
                this.showInomingCallModal(session)
            })
            .catch(() => {
                this.hideInomingCallModal
            });
    };

    _onAcceptCallListener = (session, userId, extension) => {
        ConnectycubeCallServices.processOnAcceptCallListener(session, userId, extension)
            .then(this.setOnCall)
            .catch(this.hideInomingCallModal);
    };

    _onRejectCallListener = (session, userId, extension) => {
        ConnectycubeCallServices.processOnRejectCallListener(session, userId, extension)
            .then(() => this.removeRemoteStream(userId))
            .catch(this.hideInomingCallModal);
    };

    _onStopCallListener = (session, userId, extension) => {
        const isStoppedByInitiator = session.initiatorID === userId;

        ConnectycubeCallServices.processOnStopCallListener(userId, isStoppedByInitiator)
            .then(() => {
                if (isStoppedByInitiator) {
                    this.resetState();
                } else {
                    this.removeRemoteStream(userId);
                }
            })
            .catch(this.hideInomingCallModal);
    };

    _onUserNotAnswerListener = (session, userId) => {
        ConnectycubeCallServices.processOnUserNotAnswerListener(userId)
            .then(() => this.removeRemoteStream(userId))
            .catch(this.hideInomingCallModal);
    };

    _onRemoteStreamListener = (session, userId, stream) => {
        console.warn("listener123", userId, stream)
        ConnectycubeCallServices.processOnRemoteStreamListener(userId)
            .then(() => {
                this.updateRemoteStream(userId, stream);
                this.setOnCall();
            })
            .catch(this.hideInomingCallModal);
    };
    _renderCustomLoader = () => {
        const { isLoading } = this.state;
        return (
            <OrientationLoadingOverlay visible={isLoading} message="Loading.." />
        )
    };

    render() {
        const {
            localStream,
            remoteStreams,
            selectedUsersIds,
            isActiveSelect,
            isActiveCall,
            isIncomingCall,
            senderId,
            recieverId
        } = this.state;
        const { route } = this.props;
        const { navigation } = this.props;
        const initiatorName = isIncomingCall
            ? route.params.userName
            : '';
        const localStreamItem = localStream
            ? [{ "userId": 'localStream', "stream": localStream }]
            : [];
        const streams = [...remoteStreams, ...localStreamItem];

        ConnectycubeCallServices.setSpeakerphoneOn(true);
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
                <StatusBar backgroundColor="black" barStyle="light-content" />
                {Platform.OS === "ios" &&
                    <View style={{ width: wp("100%"), paddingHorizontal: wp(5) }}>
                        <AntDesign
                            name={"arrowleft"}
                            color={COLORS.WHITE_COLOR}
                            size={30}
                            onPress={() => navigation.pop()}
                        />
                    </View>
                }
                <RTCViewGrid streams={streams} />
                <ToolBar
                    selectedUsersIds={selectedUsersIds}
                    senderId={senderId}
                    recieverId={recieverId}
                    localStream={localStream}
                    isActiveSelect={isActiveSelect}
                    isActiveCall={isActiveCall}
                    closeSelect={this.closeSelect}
                    initRemoteStreams={this.initRemoteStreams}
                    setLocalStream={this.setLocalStream}
                    resetState={this.resetState}
                />
                <AwesomeAlert
                    show={isIncomingCall}
                    showProgress={false}
                    title={`Incoming call from ${initiatorName}`}
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="Reject"
                    confirmText="Accept"
                    cancelButtonColor="red"
                    confirmButtonColor="green"
                    onCancelPressed={this._onPressReject}
                    onConfirmPressed={this._onPressAccept}
                    onDismiss={this.hideInomingCallModal}
                    alertContainerStyle={{ zIndex: 1 }}
                    titleStyle={{ fontSize: 21 }}
                    cancelButtonTextStyle={{ fontSize: 18 }}
                    confirmButtonTextStyle={{ fontSize: 18 }}
                />
                {this.props.route.params.userName === undefined &&
                    this._renderCustomLoader()}
            </SafeAreaView>
        );
    }
}
