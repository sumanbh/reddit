import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ListView, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';

import snoowrap from './snoowrap';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from './Styles/RedditHomeStyles';
import redditStatus from '../Images/base64';
import SearchActions from '../Redux/SearchRedux';
import WebActions from '../Redux/WebviewRedux';
import CommentActions from '../Redux/CommentsRedux';

export class RedditHome extends React.Component {
    static propTypes = {
        attemptSearch: PropTypes.func,
        openWebsite: PropTypes.func,
        openComments: PropTypes.func,
    }
    constructor(props) {
        super(props);

        const rowHasChanged = (r1, r2) => r1 !== r2;
        // data source
        const ds = new ListView.DataSource({ rowHasChanged });
        this.state = {
            header: {},
            dataSource: ds.cloneWithRows([]),
            isRefreshing: false,
            animating: true,
        };

        this.onPressOpenLink = this.onPressOpenLink.bind(this);
        this.onPressOpenComments = this.onPressOpenComments.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.getFreshValue = this.getFreshValue.bind(this);
    }

    async componentWillMount() {
        const result = await snoowrap.getHot();
        if (result.length > 0) {
            // console.log('INITIAL', result[0]);
            this.setState({ dataSource: this.state.dataSource.cloneWithRows(result), isRefreshing: false, animating: false });
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.searchTerm !== this.props.searchTerm) {
            this.setState({ animating: true });
            this.requestReddit(newProps.searchTerm);
        }
    }

    onPressOpenComments(submission, title) {
        this.props.openComments(submission);
        Actions.comments({ open: true, title });
    }

    // opens Safari webview
    onPressOpenLink(url, title) {
        this.props.openWebsite(url);
        Actions.webView({ open: true, title });
    }

    // pull down to refresh
    getFreshValue() {
        this.setState({ isRefreshing: true });
        this.requestReddit(this.state.searchTerm);
    }

    // returns true if the dataSource is empty or loading
    noRowData() {
        return this.state.dataSource.getRowCount() === 0;
    }

    async requestReddit(subreddit = '') {
        if (subreddit.length <= 22) {
            const result = await snoowrap.getHot(subreddit);
            if (result.length > 0) {
                switch (subreddit.toLowerCase()) {
                    case '': {
                        Actions.refresh({ title: 'Reddit: the front page of the internet' });
                        break;
                    }
                    case 'popular': {
                        Actions.refresh({ title: 'r/popular' });
                        break;
                    }
                    case 'all': {
                        Actions.refresh({ title: 'r/all' });
                        break;
                    }
                    default: {
                        Actions.refresh({ title: result[0].subreddit_name_prefixed || 'Reddit: the front page of the internet' });
                    }
                }
                this.setState({ dataSource: this.state.dataSource.cloneWithRows(result), isRefreshing: false, searchTerm: subreddit, animating: false });
            }
        }
    }

    renderRow(rowData) {
        if (rowData) {
            let noThumbnails = false;
            const thumbnailsArr = ['', 'spoiler', 'self', 'default', 'image'];
            if (thumbnailsArr.includes(rowData.thumbnail)) noThumbnails = true;
            let upvotes = 0;
            // use k notation for bigger numbers
            upvotes = rowData.ups && rowData.ups > 9999 ? `${(rowData.ups / 1000).toFixed(1)}k` : rowData.ups;
            const defaultImg = {
                url: redditStatus.default,
                width: 64,
                height: 42,
            };
            const image = rowData.preview ? rowData.preview.images[0].resolutions[0] : defaultImg;
            return (
                <View style={styles.row}>
                    {rowData.subreddit &&
                        <Grid>
                            <Row>
                                <Col style={{ width: 50 }}><Text style={styles.upvote}>{upvotes}</Text></Col>
                                <Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Col>
                                            <TouchableOpacity
                                                onPress={() => { this.onPressOpenComments(rowData.name, rowData.title); }}
                                            >
                                                <Text style={styles.boldLabel}>{rowData.title} <Text style={{ color: '#CCCCCC' }}>({rowData.domain})</Text></Text>
                                                <Text style={styles.label}>{rowData.num_comments || 0} comments {rowData.subreddit.display_name}</Text>
                                            </TouchableOpacity>
                                        </Col>
                                        <Col style={{ width: 70, maxHeight: 70, maxWidth: 70 }}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPressOpenLink(rowData.url, rowData.title); }}
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
                        </Grid>
                    }
                </View>
            );
        }
        return <View />;
    }

    render() {
        return (
            <View style={styles.mainContainer}>
                {this.state.animating ? <ActivityIndicator
                    animating={this.state.animating}
                    style={styles.mainContainer}
                    size="large"
                    color="white"
                /> :
                    <ListView
                        style={styles.container}
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
                        keyboardShouldPersistTaps="always"
                        initialListSize={20}
                        contentContainerStyle={styles.listContent}
                        dataSource={this.state.dataSource}
                        renderRow={this.renderRow}
                        pageSize={50}
                        enableEmptySections
                    />}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        searchTerm: state.search.searchTerm,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        attemptSearch: (subreddit) => dispatch(SearchActions.search(subreddit)),
        openWebsite: (url) => dispatch(WebActions.website(url)),
        openComments: (id) => dispatch(CommentActions.submission(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RedditHome);
