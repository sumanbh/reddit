import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { View, Text, ListView, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { Actions } from 'react-native-router-flux';

import snoowrap from 'snoowrap';
import config from '../../dev.json';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from './Styles/RedditHomeStyles';
import redditStatus from '../Images/base64';
import SearchActions from '../Redux/SearchRedux';
import WebActions from '../Redux/WebviewRedux';

const reddit = new snoowrap({
    userAgent: config.USER_AGENT,
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    refreshToken: config.REFRESH_TOKEN,
});
reddit.config({ debug: true });

export class RedditHome extends React.Component {
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
            dataSource: ds.cloneWithRows([]),
            webview: false,
            isRefreshing: false,
            animating: true,
        };

        this.onPressButton = this.onPressButton.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.getFreshValue = this.getFreshValue.bind(this);
    }

    componentDidMount() {
        reddit.getHot().then((result) => {
            if (result.length > 0) {
                // console.log('INITIAL', result[0]);
                this.setState({ dataSource: this.state.dataSource.cloneWithRows(result), isRefreshing: false, animating: false });
            }
        });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.searchTerm !== this.props.searchTerm) {
            this.setState({ animating: true });
            this.requestReddit(newProps.searchTerm);
        }
    }

    // opens Safari webview
    onPressButton(url, title) {
        this.props.openWebsite(url);
        Actions.webView({ open: true, title: title });
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

    requestReddit(subreddit = '') {
        if (subreddit.length <= 22) {
            reddit.getHot(subreddit).then((result) => {
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
            });
        }
    }

    renderRow(rowData) {
        if (rowData) {
            let noThumbnails = false;
            const thumbnailsArr = ['', 'spoiler', 'self', 'default', 'image'];
            if (thumbnailsArr.includes(rowData.thumbnail)) noThumbnails = true;
            const upboats = rowData.ups ? rowData.ups > 9999 ? (rowData.ups / 1000).toFixed(1) + 'k' : rowData.ups : 0;
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
                                <Col style={{ width: 50 }}><Text style={styles.upboat}>{upboats}</Text></Col>
                                <Col>
                                    <Col style={{ flexDirection: 'row' }}>
                                        <Col>
                                            <Text style={styles.boldLabel}>{rowData.title} <Text style={{ color: '#CCCCCC' }}>({rowData.domain})</Text></Text>
                                            <Text style={styles.label}>{rowData.num_comments} comments {rowData.subreddit.display_name}</Text>
                                        </Col>
                                        <Col style={{ width: 70, maxHeight: 70, maxWidth: 70 }}>
                                            <TouchableOpacity
                                                onPress={() => { this.onPressButton(rowData.url, rowData.title); }}
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
                        initialListSize={10}
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RedditHome);
