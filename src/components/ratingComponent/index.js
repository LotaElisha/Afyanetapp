import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import {AirbnbRating} from "../../../local_modules/react-native-ratings/src";
import React from "react";

const RatingView = ({isDisable, onFinishRating, rateCount, size}) => {
    return (
        <AirbnbRating
            isDisabled={isDisable}
            size={size ? wp(`${size}%`) : wp("4%")}
            showRating={false}
            defaultRating={rateCount}
            onFinishRating={onFinishRating}
        />
    )

    
};

export {
    RatingView
}
