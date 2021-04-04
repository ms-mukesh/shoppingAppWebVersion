import {EVENT_INFORMATION} from '../types/';
import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.EventReducer;


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case EVENT_INFORMATION: {
            return {
                ...state,
                events: action.payload,
            };
        }
        default:
            return state;
    }
};
