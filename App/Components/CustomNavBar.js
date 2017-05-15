import React from 'react';
import { View, Animated, TouchableOpacity } from 'react-native';
import { Colors } from '../Themes';
import Styles from './Styles/CustomNavBarStyles';
import Icon from 'react-native-vector-icons/Ionicons';
import { Actions as NavigationActions } from 'react-native-router-flux';

export default class CustomNavBar extends React.Component {
    render() {
        return (
            <Animated.View style={Styles.container}>
                <TouchableOpacity style={Styles.leftButton} onPress={NavigationActions.pop}>
                    <Icon name="ios-arrow-back" size={34} color={Colors.snow} />
                </TouchableOpacity>
                <View style={Styles.rightButton} />
            </Animated.View>
        );
    }
}
