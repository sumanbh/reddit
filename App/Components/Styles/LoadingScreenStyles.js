import { StyleSheet } from 'react-native';
import { Colors, Metrics, Fonts } from '../../Themes/';

export default StyleSheet.create({
    container: {
        justifyContent: 'center',
        marginVertical: Metrics.section,
    },
    contentContainer: {
        alignSelf: 'center',
        alignItems: 'center',
    },
    activity: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
});
