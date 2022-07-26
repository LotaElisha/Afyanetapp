import React from "react";
import { View } from "react-native";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const Spacer = ({ space, row }) => {
    return (
        <View style={{
            marginVertical: space && wp(`${space}%`),
            marginHorizontal: row && wp(`${row}%`),
        }} />
    )
};

export {
    Spacer
}
