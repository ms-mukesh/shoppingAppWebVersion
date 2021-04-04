import {EVENT_INFORMATION, FETCH_MY_CART, FETCH_PRODUCT_DETAIL} from '../types/';
import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.ProductReducer;


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_PRODUCT_DETAIL: {
            return {
                ...state,
                productDetail: action.payload,
            };
        }
        case FETCH_MY_CART: {
            return {
                ...state,
                myCart: action.payload,
            };
        }
        default:
            return state;
    }
};
