import React from "react";
import GooglePlacesAutocomplete from "react-native-google-places-autocomplete";
import BaseClass from "../../utils/BaseClass";
import PropTypes from 'prop-types';
import COLORS from "../../themes/Colors";
import {FONT} from "../../themes/FontSizes";
import {FONT_FAMILY} from "../../themes/FontFamilies";

class AutoCompleteComponent extends BaseClass {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <GooglePlacesAutocomplete
                placeholder=''
                minLength={2} // minimum length of text to search
                autoFocus={false}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    this.props.onSelect(data, details)
                }}
                onFail={(error) => console.warn(error)}
                listViewDisplayed={false}
                query={{
                    key: 'AIzaSyBaP6afgbYtNNXGiiMDA3ujN62inJ9LMhk',
                    language: 'en', // language of the results
                    // types: '(cities)', // default: 'geocode'
                }}
                getDefaultValue={() => {
                    return this.props.value
                }}
                styles={{
                    textInputContainer: {
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        borderWidth: 0,
                        backgroundColor: "tranparent"
                    },
                    textInput: {
                        marginLeft: 0,
                        marginRight: 0,
                        paddingLeft: 0,
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    },
                    description: {
                        color: COLORS.GREY_COLOR,
                        fontSize: FONT.TextNormal,
                        fontFamily: FONT_FAMILY.MontserratRegular
                    },
                    row: {
                        padding: 13,
                        height: 44,
                        flexDirection: 'row',
                    },
                    listView: {}
                }}
                text={this.props.value}
                nearbyPlacesAPI='GooglePlacesSearch'
                GooglePlacesSearchQuery={{
                    rankby: 'distance',
                    types: 'food',
                }}
                filterReverseGeocodingByTypes={[
                    'locality',
                    'administrative_area_level_3',
                ]}
            />
        );
    }
}

AutoCompleteComponent.propTypes = {
    onSelect: PropTypes.func,
    value: PropTypes.string
};

AutoCompleteComponent.defaultProps = {
    onSelect: () => {
    },
    value: ""
};

export default AutoCompleteComponent;
