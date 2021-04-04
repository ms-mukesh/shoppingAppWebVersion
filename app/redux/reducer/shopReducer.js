import {
    EVENT_INFORMATION,
    FETCH_MY_CART,
    FETCH_SHOP_LIST,
    FETCH_SHOP_OWNER_ORDERS,
    FETCH_SHOP_PRODUCT
} from '../types/';
import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.ShopReducer;


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_SHOP_LIST: {
            return {
                ...state,
                shopList: action.payload,
            };
        }
        case FETCH_SHOP_PRODUCT: {
            return {
                ...state,
                shopProductList: action.payload,
            };
        }
        case FETCH_SHOP_OWNER_ORDERS: {
            return {
                ...state,
                shopOrders: action.payload,
            };
        }
        default:
            return state;
    }
};
