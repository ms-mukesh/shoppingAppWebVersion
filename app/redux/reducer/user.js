import {REMEMBER_ME, USER_DETAIL, AUTH_TOKEN, FETCH_MY_ADDRESS, FETCH_CUSTOMER_ORDER} from '../types';
import {appDefaultReducer} from './defaultReducer';

const initialState = appDefaultReducer.user;



export default (state = initialState, action) => {
    console.log("--calledd")
    switch (action.type) {
        case USER_DETAIL: {
            console.log("reached here----")
            return {
                ...state,
                userDetail: action.payload,
            };
        }
        case FETCH_MY_ADDRESS: {
            return {
                ...state,
                userAddress: action.payload,
            };
        }
        case FETCH_CUSTOMER_ORDER: {
            return {
                ...state,
                userCustomerOrder: action.payload,
            };
        }
        case REMEMBER_ME: {
            return {
                ...state,
                rememberData: action.payload,
            };
        }
        case AUTH_TOKEN: {

            return {
                ...state,
                authToken: action.payload,
            };
        }
        default:
            return state;
    }
};
