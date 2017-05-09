import { StyleSheet } from 'react-native';
import { Metrics, ApplicationStyles, Colors } from '../../Themes/';

export default StyleSheet.create({
    ...ApplicationStyles.screen,
    container: {
        marginTop: Metrics.navBarHeight,
        paddingBottom: Metrics.baseMargin,
    },
    centered: {
        alignItems: 'center',
    },
    row: {
        flex: 1,
        marginVertical: Metrics.smallMargin,
        justifyContent: 'center',
    },
    boldLabel: {
        color: Colors.snow,
        textAlign: 'left',
        padding: (Metrics.smallMargin, Metrics.smallMargin, 0, 0),
    },
    upboat: {
        textAlign: 'center',
        color: Colors.steel,
        marginBottom: Metrics.smallMargin,
        padding: (Metrics.smallMargin, Metrics.smallMargin, 0, Metrics.smallMargin),
    },
    label: {
        textAlign: 'left',
        color: Colors.steel,
        marginBottom: Metrics.smallMargin,
        padding: (Metrics.smallMargin, Metrics.smallMargin, 0, 0),
    },
    listContent: {
        marginTop: Metrics.baseMargin,
    },
});
