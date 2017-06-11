import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { ScrollView, BackAndroid } from 'react-native';
import styles from './Styles/DrawerContentStyles';
import CustomNavBar from '../Navigation/CustomNavBar';

class DrawerContent extends Component {
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this.context.drawer.props.open) {
                this.toggleDrawer();
                return true;
            }
            return false;
        });
    }

    toggleDrawer() {
        this.context.drawer.toggle();
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <CustomNavBar />
            </ScrollView>
        );
    }
}

DrawerContent.contextTypes = {
    drawer: PropTypes.object,
};

export default DrawerContent;
