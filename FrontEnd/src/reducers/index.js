import { combineReducers } from 'redux';
import loginReducer from './login';
import searchReducer from './search';

const allReducers = combineReducers({
    loginReducer,
    searchReducer,
});

export default allReducers;