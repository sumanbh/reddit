import { StyleSheet, PixelRatio } from 'react-native';
import { Metrics, ApplicationStyles, Colors } from '../../Themes/';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    container: {
        flex: 1,
        backgroundColor: Colors.coal,
        marginTop: Metrics.navBarHeight,
        paddingBottom: Metrics.baseMargin,
    },
    centered: {
        alignItems: 'center',
    },
    row: {
        justifyContent: 'center',
    },
    upvote: {
        color: Colors.steel,
    },
    label: {
        color: Colors.steel,
    },
    listContent: {
        marginTop: Metrics.baseMargin,
    },
    userBody: {
        paddingLeft: 10,
        borderLeftColor: Colors.charcoal,
        borderLeftWidth: 1 / PixelRatio.get(),
    },
    commentBody: {
        textAlign: 'left',
        color: Colors.snow,
        padding: (0, Metrics.smallMargin, 5, 0),
    },
    initialBody: {
        paddingLeft: 5,
    },
    userHeader: {
        flexDirection: 'row',
        paddingLeft: 0,
        paddingTop: 4,
    },
});
