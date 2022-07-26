import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    SafeAreaView,
    View, Text,
} from 'react-native';
import _ from 'lodash';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import COLORS from '../../../../../themes/Colors';
import {FONT} from '../../../../../themes/FontSizes';
import {FONT_FAMILY} from '../../../../../themes/FontFamilies';
/*
import FeedPolls from '../feed';
*/
import DoctorHistory from '../doctorHistory';
import LabHistory from '../labHistory'
import PharmacyHistory from "../pharmacyHistory";

const TabIndicator = ({width, tabWidth, index}) => {
    const marginLeftRef = useRef(new Animated.Value(index ? tabWidth : 0))
        .current;
    useEffect(() => {
        Animated.timing(marginLeftRef, {
            toValue: tabWidth,
            duration: 400,
        }).start();
    }, [tabWidth]);

    return (
        <Animated.View
            style={{
                justifyContent: 'flex-end',
                alignItems: 'center',
                flex: 1,
                width: width,
                marginLeft: marginLeftRef,
                position: 'absolute',
                bottom: -12,
            }}
        >
            {/*<TabTipSVG fillColor={COLORS.app_theme_color}/>*/}
        </Animated.View>
    );
};

const TopTab = ({props}) => {
    const [index, setIndex] = useState(0);
    const routes = [
        {key: 'first', title: 'Doctors'},
        {key: 'second', title: 'Labs'},
        {key: 'third', title: 'Pharmacy'},
    ];

    const renderIndicator = useCallback(
        ({getTabWidth}) => {
            const tabWidth = _.sum(
                [...Array(index).keys()].map((i) => getTabWidth(i)),
            );

            return (
                <TabIndicator
                    width={getTabWidth(index)}
                    tabWidth={tabWidth}
                    index={index}
                />
            );
        },
        [index],
    );

    return (
        <View style={styles.container}>
            <TabView
                lazy={true}
                navigationState={{
                    index,
                    routes,
                }}
                renderScene={({route}) => {
                    switch (route.key) {
                        case 'first':
                            return <DoctorHistory navigation={props.navigation} routeKey={index}/>;
                        case 'second':
                            return <LabHistory navigation={props.navigation} routeKey={index}/>;
                        case 'third':
                            return <PharmacyHistory navigation={props.navigation} routeKey={index}/>;
                        default:
                            return null;
                    }
                }}
                onIndexChange={setIndex}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        scrollEnabled
                        tabStyle={styles.tabBar}
                        indicatorStyle={styles.indicator}
                        style={styles.tabBarContainer}
                        // labelStyle={styles.labelStyle}
                        renderLabel={({route}) => {
                            if (index === 0) {
                                if (route.key === 'first') {
                                    return <Text style={[styles.labelStyle, {
                                        color: COLORS.BLACK_COLOR,
                                        fontFamily: FONT_FAMILY.PoppinsSemiBold,
                                    }]}>
                                        {route.title}</Text>;

                                }
                            }
                            if (index === 1) {
                                if (route.key === 'second') {
                                    return <Text style={[styles.labelStyle, {
                                        color: COLORS.BLACK_COLOR,
                                        fontFamily: FONT_FAMILY.PoppinsSemiBold,
                                    }]}>
                                        {route.title}</Text>;

                                }
                            }
                            if (index === 2) {
                                if (route.key === 'third') {
                                    return <Text style={[styles.labelStyle, {
                                        color: COLORS.BLACK_COLOR,
                                        fontFamily: FONT_FAMILY.PoppinsSemiBold,
                                    }]}>
                                        {route.title}</Text>;

                                }
                            }
                            return <Text style={[styles.labelStyle, {
                                color: COLORS.BLACK_COLOR,
                                fontFamily: FONT_FAMILY.PoppinsRegular,
                            }]}>
                                {route.title}</Text>;


                        }}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabBar: {
        width: wp(100) / 3,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: COLORS.app_theme_color,
        marginHorizontal: wp(0.3),
    },
    indicator: {
        // backgroundColor: "#ccc"
        backgroundColor: COLORS.APP_THEME_COLOR,
    },
    tabBarContainer: {
        backgroundColor: COLORS.backgroundColor,
        marginBottom: wp(3),
    },
    labelStyle: {
        marginVertical: 0,
        fontSize: FONT.TextSmallX,
        // fontFamily: FONT_FAMILY.PoppinsSemiBold,
        textAlign: 'center',

    },
});

export default TopTab;
