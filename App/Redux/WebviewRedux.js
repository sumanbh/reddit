import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    website: ['url'],
});

export const TemperatureTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    url: '',
    isLoading: false,
});

/* ------------- Reducers ------------- */

export const openWebsite = (state, { url }) => state.merge({ url });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.WEBSITE]: openWebsite,
});
