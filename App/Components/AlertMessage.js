import React, { PropTypes } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles from './Styles/AlertMessageStyles';

export default class AlertMessage extends React.Component {
    static defaultProps = { show: true, animating: true }

    static propTypes = {
      style: PropTypes.object,
      show: PropTypes.bool
    }

    render() {
        const messageComponent = null;
        if (this.props.show) {
            return (
                <View
                    style={[styles.container, this.props.style]}
                >
                    <View style={styles.contentContainer}>
                        <ActivityIndicator
                            animating={this.props.animating}
                            style={[styles.activity, { height: 10, marginVertical: 50 }]}
                            size="large"
                        />
                    </View>
                </View>
            );
        }

        return messageComponent;
    }
}

AlertMessage.defaultProps = {
    show: true,
};
