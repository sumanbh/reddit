import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { View, ScrollView, Text, ListView, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';

import co from 'co';
import snoowrap from 'snoowrap';
import config from '../../dev.json';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from './Styles/RedditCommentsStyles';
import redditStatus from '../Images/base64';
import WebActions from '../Redux/WebviewRedux';
import Comments from '../Components/Comments';

const reddit = new snoowrap({
    userAgent: config.USER_AGENT,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    refreshToken: config.REFRESH_TOKEN,
});
reddit.config({ debug: true });

export class RedditComments extends React.Component {
    static propTypes = {
        attemptSearch: PropTypes.func,
        openWebsite: PropTypes.func,
    }
    constructor(props) {
        super(props);

        const rowHasChanged = (r1, r2) => r1 !== r2;
        // data source
        const ds = new ListView.DataSource({ rowHasChanged });
        this.state = {
            header: null,
            dataSource: ds.cloneWithRows([]),
            isRefreshing: false,
            animating: true,
        };

        this.onPressButton = this.onPressButton.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.getFreshValue = this.getFreshValue.bind(this);
    }

    componentDidMount() {
        this.requestForComments(this.props.submission);
    }

    // opens Safari webview
    onPressButton(url, title) {
        this.props.openWebsite(url);
        Actions.webView({ open: true, title });
    }

    // pull down to refresh
    getFreshValue() {
        this.setState({ isRefreshing: true });
        this.requestForComments(this.props.submission);
    }

    // returns true if the dataSource is empty or loading
    noRowData() {
        return this.state.dataSource.getRowCount() === 0;
    }

    requestForComments(submission) {
        const self = this;
        co(function* Generator() {
            const result = yield reddit.getSubmission(submission).fetch();
            const { comments, ...mainObj } = result;
            self.setState({ dataSource: self.state.dataSource.cloneWithRows(comments), header: mainObj, isRefreshing: false, animating: false });
        });
    }

    renderRow(rowData) {
        if (rowData) {
            return (
                <View>
                    <Comments reply={rowData} parent />
                </View>
            );
        }
        return <View />;
    }

    renderHeader(data) {
        if (data) {
            let noThumbnails = false;
            const thumbnailsArr = ['', 'spoiler', 'self', 'default', 'image'];
            if (thumbnailsArr.includes(data.thumbnail)) noThumbnails = true;
            let upvotes = 0;
            // use k notation for bigger numbers
            upvotes = data.ups && data.ups > 9999 ? `${(data.ups / 1000).toFixed(1)}k` : data.ups;
            const defaultImg = {
                url: redditStatus.default,
                width: 64,
                height: 42,
            };
            const image = data.preview ? data.preview.images[0].resolutions[0] : defaultImg;
            return (
                <View style={styles.row}>
                    <Row>
                        <Col style={{ width: 50 }}><Text style={styles.upvote}>{upvotes}</Text></Col>
                        <Col>
                            <Col style={{ flexDirection: 'row' }}>
                                <Col>
                                    <TouchableOpacity>
                                        <Text style={styles.boldLabel}>{data.title} <Text style={{ color: '#CCCCCC' }}>({data.domain})</Text></Text>
                                        <Text style={styles.label}>{data.num_comments || 0} comments {data.subreddit.display_name}</Text>
                                    </TouchableOpacity>
                                </Col>
                                <Col style={{ width: 70, maxHeight: 70, maxWidth: 70 }}>
                                    <TouchableOpacity
                                        onPress={() => { this.onPressButton(data.url, data.title); }}
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'flex-end',
                                            flex: noThumbnails ? 1 : 0,
                                        }}
                                    >
                                        {noThumbnails || !image ?
                                            <Image
                                                style={{ width: 32, height: 32 }}
                                                source={{ uri: redditStatus.chevron }}
                                                overflow="hidden"
                                            />
                                            : <Image
                                                style={{ width: 64, height: (64 / image.width) * image.height, maxHeight: 64, maxWidth: 64 }}
                                                source={{ uri: image.url }}
                                                overflow="hidden"
                                            />
                                        }
                                    </TouchableOpacity>
                                </Col>
                            </Col>
                        </Col>
                    </Row>
                </View>
            );
        }
        return <View />;
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
                keyboardShouldPersistTaps="always"
                refreshControl={
                    <RefreshControl
                        tintColor="#fff"
                        title="Loading..."
                        titleColor="#fff"
                        colors={['#ff0000', '#00ff00', '#0000ff']}
                        progressBackgroundColor="#ffff00"
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.getFreshValue}
                    />
                }
            >
                {this.state.animating ? <ActivityIndicator
                    animating={this.state.animating}
                    style={styles.container}
                    size="large"
                    color="white"
                /> :
                    <ScrollView
                        keyboardShouldPersistTaps="always"
                    >
                        {this.state.header ? this.renderHeader(this.state.header) : null}
                        <ListView
                            keyboardShouldPersistTaps="always"
                            initialListSize={10}
                            contentContainerStyle={styles.listContent}
                            dataSource={this.state.dataSource}
                            renderRow={this.renderRow}
                            pageSize={50}
                            enableEmptySections
                        />
                    </ScrollView>
                }
            </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        submission: state.submission.submissionId,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openWebsite: (url) => dispatch(WebActions.website(url)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RedditComments);
