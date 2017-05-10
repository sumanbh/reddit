import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    submission: ['submissionId'],
});

export const TemperatureTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    submissionId: '',
    isLoading: false,
});

/* ------------- Reducers ------------- */

export const openComments = (state, { submissionId }) => state.merge({ submissionId });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.SUBMISSION]: openComments,
});
