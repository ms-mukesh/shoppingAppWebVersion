import {combineReducers} from 'redux';
import {RESET_STORE} from '../types';
import {appDefaultReducer} from './defaultReducer';
import user from './user';
import dashboardReducer from './dashboardReducer'
import eventInformationReducer from './eventReducer'
import appDefaultSettingReducer from './appReducer'
import notificationReducer from './notificationReducer'
import recentItemReducer from './recentItems'
import shopReducer from './shopReducer'
import productReducer from './productReducer'
const appReducer = combineReducers({
    user,
    dashboardReducer,
    appDefaultSettingReducer,
    notificationReducer,
    eventInformationReducer,
    shopReducer,
    recentItemReducer,
    productReducer
});

export default function rootReducer(state, action) {
    let finalState = appReducer(state, action);
    if (action.type === RESET_STORE) {
        finalState = appDefaultReducer; //resetReducer(finalState, action);
    }
    return finalState;
}
