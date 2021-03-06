import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    search: ['searchTerm'],
    cancelSearch: null,
});

export const TemperatureTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    searchTerm: '',
    searching: false,
});

/* ------------- Reducers ------------- */

export const performSearch = (state, { searchTerm }) => {
    return state.merge({ searchTerm });
};

export const cancelSearch = (state) => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.SEARCH]: performSearch,
    [Types.CANCEL_SEARCH]: cancelSearch,
});
