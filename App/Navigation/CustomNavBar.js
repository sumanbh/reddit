import React, { PropTypes } from 'react';
import { View, LayoutAnimation } from 'react-native';
import styles from './Styles/CustomNavBarStyles';
import SearchBar from '../Components/SearchBar';
import { connect } from 'react-redux';
import SearchActions from '../Redux/SearchRedux';

class CustomNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearchBar: true,
        };
    }

    onSearch(searchTerm) {
        this.props.performSearch(searchTerm);
    }

    showSearchBar() {
        this.setState({ showSearchBar: true });
    }

    renderMiddle() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        return <SearchBar onSearch={this.props.performSearch} searchTerm={this.props.searchTerm} />;
    }

    render() {
        const containerStyle = [
            styles.container,
        ];

        return (
            <View style={containerStyle}>
                {this.renderMiddle()}
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
        performSearch: (searchTerm) => dispatch(SearchActions.search(searchTerm)),
        cancelSearch: () => dispatch(SearchActions.cancelSearch()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomNavBar);
