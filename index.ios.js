import './App/Config/ReactotronConfig';
import { AppRegistry } from 'react-native';
import Base64 from 'Base64';
import App from './App/Containers/App';

window.btoa = Base64.btoa;

AppRegistry.registerComponent('reddit', () => App);
