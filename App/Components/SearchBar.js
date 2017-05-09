import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from './Styles/SearchBarStyles';
import { Colors, Metrics } from '../Themes/';
import Icon from 'react-native-vector-icons/FontAwesome';
import redditStatus from '../Images/base64';
import { Actions as NavigationActions } from 'react-native-router-flux'

export default class SearchBar extends React.Component {
    static propTypes = {
        onSearch: React.PropTypes.func.isRequired,
        searchTerm: React.PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {
            searchTerm: this.props.searchTerm
        }
    }

    render() {
        const { onSearch, searchTerm } = this.props;
        const onSubmitEditing = () => {
            onSearch(this.state.searchTerm);
            NavigationActions.refresh({
                key: 'drawer',
                open: false
            })
        }
        return (
            <View style={styles.container}>
                <Icon name='search' size={Metrics.icons.tiny} style={styles.searchIcon} />
                <TextInput
                    ref='searchText'
                    autoFocus
                    placeholder='Enter subreddit'
                    placeholderTextColor={Colors.snow}
                    underlineColorAndroid='transparent'
                    style={styles.searchInput}
                    value={this.state.searchTerm}
                    onChangeText={(text) => {
                        this.setState({ searchTerm: text });
                    }}
                    autoCapitalize='none'
                    onSubmitEditing={onSubmitEditing}
                    returnKeyType={'search'}
                    autoCorrect={false}
                    selectionColor={Colors.snow}
                />
                <TouchableOpacity onPress={onSubmitEditing} style={styles.searchButton}>
                    <Image
                        style={{ width: 40, height: 40 }}
                        source={{ uri: redditStatus.chevron }}
                        overflow='hidden'
                    />
                </TouchableOpacity>
            </View>
        )
    }
}
