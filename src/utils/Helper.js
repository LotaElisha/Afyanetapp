import { Alert } from "react-native";
import STRINGS from "./Strings";
import ImagePicker from "react-native-image-crop-picker";
import * as _ from "lodash";

const formatAMPM = (value) => {
    let date = new Date(value);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

const getFormattedDate = (value) => {
    return new Date(value).toString().slice(new Date(value).toString().indexOf(" "), 15)
}

const OpenOptionPopup = (pathResponse) => {
    Alert.alert(
        STRINGS.APP_NAME,
        "Choose an Option",
        [
            {
                text: "Cancel", style: 'cancel',
                onPress: () => { 
                    pathResponse("")
                }
            },
            {
                text: "Gallery", onPress: () => {
                    ImagePicker.openPicker({
                        // width: 1000,
                        // height: 1500,
                        // includeBase64: true,
                        cropping: true,
                        compressImageQuality:0.7
                    }).then(image => {
                        pathResponse(image);
                    }).catch(error => {
                        pathResponse("")
                    });
                }
            },
            {
                text: "Camera", onPress: () => {
                    ImagePicker.openCamera({
                        // width: 1000,
                        // height: 1500,
                        // includeBase64: true,
                        cropping: true,
                        compressImageQuality:0.7
                    }).then(image => {
                        pathResponse(image);
                    }).catch(error => {
                        pathResponse("")
                    });
                }
            },
        ],
        { cancelable: false });
}



const getValueById = (array, id) => {
    let value;
    _.map(array, (item, index) => {
        if (item.value == id) {
            value = item.label
        }
    })
    return value
}

export {
    formatAMPM,
    getFormattedDate,
    OpenOptionPopup,
    getValueById,    
}
