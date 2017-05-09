import React, { Component } from 'react';
import { ScrollView, Text, BackAndroid } from 'react-native';
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
    drawer: React.PropTypes.object,
};

export default DrawerContent;
