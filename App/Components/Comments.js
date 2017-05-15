import React from 'react';
import { PropTypes } from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import Markdown from 'react-native-simple-markdown';
import styles from './Styles/CommentsStyles';

export class Comments extends React.Component {
    constructor() {
        super();
        this.state = {
            open: true,
            initial: true,
        };
        this.onPressButton = this.onPressButton.bind(this);
        this.renderBody = this.renderBody.bind(this);
    }

    onPressButton() {
        this.setState({ open: !this.state.open });
    }

    renderBody(reply) {
        // console.log(JSON.stringify(reply));
        return (
            <View>
                <Markdown style={styles.commentBody}>
                    {reply.body}
                </Markdown>
                {/*<Text style={styles.commentBody}>{reply.body}</Text>*/}
                {reply.replies && reply.replies.map((child) => {
                    return <Comments key={child.id} reply={child} parent={false} />;
                })}
            </View>
        );
    }

    render() {
        function getTime(seconds) {
            const days = Math.floor(seconds / 86400);
            const numhours = Math.floor(seconds / 3600);
            const numminutes = Math.floor(seconds / 60);
            if (days > 0) {
                if (days === 1) return `${days} day ago`;
                return `${days} days ago`;
            }
            if (numhours > 0) {
                if (numhours === 1) return `${numhours} hour ago`;
                return `${numhours} hours ago`;
            }
            if (numminutes > 0) {
                if (numminutes === 1) return `${numminutes} minute ago`;
                return `${numminutes} minutes ago`;
            }
            if (seconds === 1) return `${seconds} second ago`;
            return `${seconds} seconds ago`;
        }

        const { reply, parent } = this.props;
        let upvotes = 0;
        let delta = Math.ceil(((Date.now() / 1000) - reply.created_utc));
        delta = getTime(delta);
        // use k notation for bigger numbers
        upvotes = reply.ups && reply.ups > 9999 ? `${(reply.ups / 1000).toFixed(1)}k` : reply.ups;

        if (reply.subreddit) {
            return (
                <View style={parent ? styles.initialBody : styles.userBody}>
                    <TouchableOpacity
                        onPress={this.onPressButton}
                    >
                        <View style={styles.userHeader}>
                            <Text style={styles.label}>{reply.author.name}</Text>
                            <Text style={styles.upvote}>{'  '}{upvotes}</Text>
                            <Text style={styles.label}>{'  '}{delta}</Text>
                        </View>
                    </TouchableOpacity>
                    {this.state.open ? this.renderBody(reply) : null}
                </View>
            );
        }
        return (<View />);
    }
}

export default Comments;
