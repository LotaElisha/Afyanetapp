import {Alert, BackHandler} from 'react-native';

const exitAlert = () => {
    Alert.alert(
        'Confirm exit',
        'Do you really want to "Exit" the app?',
        [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Exit', onPress: () => BackHandler.exitApp()}
        ],
        {cancelable: false}
    );
    return true;
};

export default{exitAlert};
