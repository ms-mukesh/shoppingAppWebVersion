import {
    EVENT_INFORMATION,
    FETCH_ALL_CATEGORIES,
    FETCH_ALL_SHOPS_FOR_CUSTOMER, FETCH_ALL_TRENDING_PRODUCT,
    FETCH_RECENT_ITEMS,
    FETCH_SHOP_LIST
} from '../types/';
import {appDefaultReducer} from './defaultReducer';

const INITIAL_STATE = appDefaultReducer.RecentItems;


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_RECENT_ITEMS: {
            return {
                ...state,
                recentItems: action.payload,
            };
        }
        case FETCH_ALL_CATEGORIES: {
            return {
                ...state,
                categories: action.payload,
            };
        }
        case FETCH_ALL_SHOPS_FOR_CUSTOMER: {
            return {
                ...state,
                shopListForCustomer: action.payload,
            };
        }
        case FETCH_ALL_TRENDING_PRODUCT: {
            return {
                ...state,
                trendingItems: action.payload,
            };
        }
        default:
            return state;
    }
};
