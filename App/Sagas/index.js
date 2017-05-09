import { takeLatest } from 'redux-saga/effects';
// import API from '../Services/Api';
// import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig';

/* ------------- Types ------------- */

// import { StartupTypes } from '../Redux/StartupRedux';
import { OpenScreenTypes } from '../Redux/OpenScreenRedux';

/* ------------- Sagas ------------- */

// import { startup } from './StartupSagas';
// import { login } from './LoginSagas';
import { openScreen } from './OpenScreenSagas';

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
// const api = API.create();

/* ------------- Connect Types To Sagas ------------- */

export default function* root() {

}
