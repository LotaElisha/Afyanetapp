import React, { Component } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { ConnectycubeCallServices } from '../../utils/services';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import BaseClass from "../../utils/BaseClass";
import ConnectyCube from "react-native-connectycube";
import { NotificationApi } from '../../redux/actions/NotificationAction'
import STRINGS from "../../utils/Strings";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class ToolBar extends BaseClass {
    state = {
        isAudioMuted: false,
        isFrontCamera: true,
    };

    static getDerivedStateFromProps(props, state) {
        if (!props.isActiveCall) {
            return {
                isAudioMuted: false,
                isFrontCamera: true,
            };
        }
    }

    startCall = async () => {
        const {
            selectedUsersIds,
            closeSelect,
            initRemoteStreams,
            setLocalStream,
            senderId,
            recieverId
        } = this.props;
        //connect
        await AsyncStorage.getItem(STRINGS.LOGIN_DATA).then((result) => {
            let userData = JSON.parse(result);
            if (userData !== undefined && userData !== null) {
                let user = {
                    id: userData.connect_cube_details.connect_cube_id,
                    email: userData.user_data.email,
                    password: "Mind@123",
                };
                ConnectyCube.createSession(user)
                .then(() => {
                        ConnectyCube.chat.connect({
                            userId: user.id,
                            password: user.password,
                        })
                    }
                ).catch(error => {
                    console.warn(error)
                })
     
            }
        });       

        //video call notification API
        if (this.isConnected()) {
            NotificationApi({
                "receiver_id": recieverId,
                "sender_id": senderId
            }, response => this.handleNotificationResponse(response));
        }
        else {
            this.showToastAlert(STRINGS.NO_INTERNET_CONNECTION)
        }
        if (selectedUsersIds.length === 0) {
            this.showToast('Select at less one user to start Videocall');
        } else {
            closeSelect();
            initRemoteStreams(selectedUsersIds);
            ConnectycubeCallServices.startCall(selectedUsersIds).then(setLocalStream);
        }
    };

    //notification API response
    handleNotificationResponse = (response) => {
        if (response !== undefined && response !== null) {

        } else {
            this.showToastAlert(STRINGS.UNKNOWN_ERROR);
        }
    }


    stopCall = () => {
        const { resetState } = this.props;
        ConnectycubeCallServices.stopCall();
        resetState();
    };

    switchCamera = () => {
        const { localStream } = this.props;

        ConnectycubeCallServices.switchCamera(localStream);
        this.setState(prevState => ({ isFrontCamera: !prevState.isFrontCamera }));
    };

    muteUnmuteAudio = () => {
        this.setState(prevState => {
            const mute = !prevState.isAudioMuted;
            ConnectycubeCallServices.setAudioMuteState(mute);
            return { isAudioMuted: mute };
        });
    };

    _renderCallStartStopButton = isCallInProgress => {
        const style = isCallInProgress ? styles.buttonCallEnd : styles.buttonCall;
        const onPress = isCallInProgress ? this.stopCall : this.startCall;
        const type = isCallInProgress ? 'call-end' : 'call';

        return (
            <TouchableOpacity
                style={[styles.buttonContainer, style]}
                onPress={onPress}>
                <MaterialIcon name={type} size={32} color="white" />
            </TouchableOpacity>
        );
    };

    _renderMuteButton = () => {
        const { isAudioMuted } = this.state;
        const type = isAudioMuted ? 'mic-off' : 'mic';
        return (
            <TouchableOpacity
                style={[styles.buttonContainer, styles.buttonMute]}
                onPress={this.muteUnmuteAudio}>
                <MaterialIcon name={type} size={32} color="white" />
            </TouchableOpacity>
        );
    };

    _renderSwitchVideoSourceButton = () => {
        const { isFrontCamera } = this.state;
        const type = isFrontCamera ? 'camera-rear' : 'camera-front';

        return (
            <TouchableOpacity
                style={[styles.buttonContainer, styles.buttonSwitch]}
                onPress={this.switchCamera}>
                <MaterialIcon name={type} size={32} color="white" />
            </TouchableOpacity>
        );
    };

    render() {
        const { isActiveSelect, isActiveCall } = this.props;
        const isCallInProgress = isActiveCall || !isActiveSelect;
        const isAvailableToSwitch =
            isActiveCall && ConnectycubeCallServices.mediaDevices.length > 1;

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.toolBarItem}>
                    {isActiveCall && this._renderMuteButton()}
                </View>
                <View style={styles.toolBarItem}>
                    {this._renderCallStartStopButton(isCallInProgress)}
                </View>
                <View style={styles.toolBarItem}>
                    {isAvailableToSwitch && this._renderSwitchVideoSourceButton()}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        height: 60,
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        zIndex: 100,
    },
    toolBarItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginHorizontal: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonCall: {
        backgroundColor: 'green',
    },
    buttonCallEnd: {
        backgroundColor: 'red',
    },
    buttonMute: {
        backgroundColor: 'blue',
    },
    buttonSwitch: {
        backgroundColor: 'orange',
    },
});
