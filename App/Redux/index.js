import { combineReducers } from 'redux';
import configureStore from './CreateStore';
import rootSaga from '../Sagas/';

export default () => {
  /* ------------- Assemble The Reducers ------------- */
    const rootReducer = combineReducers({
        search: require('./SearchRedux').reducer,
        website: require('./WebviewRedux').reducer,
    });

    return configureStore(rootReducer, rootSaga);
};
