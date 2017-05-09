import React from 'react';
import { connect } from 'react-redux';
import { WebView } from 'react-native';
import styles from './Styles/RedditWebviewStyles';

export class RedditWeblinks extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <WebView
                style={styles.container}
                source={{ uri: this.props.url }}
                scalesPageToFit
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        url: state.website.url,
    };
};

export default connect(mapStateToProps)(RedditWeblinks);
