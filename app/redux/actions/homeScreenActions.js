import {
  FETCH_ALL_CATEGORIES,
  FETCH_ALL_SHOPS_FOR_CUSTOMER,
  FETCH_ALL_TRENDING_PRODUCT,
  FETCH_MY_CART,
  FETCH_PRODUCT_DETAIL,
  FETCH_RECENT_ITEMS,
  FETCH_SHOP_LIST,
  LOADING,
} from '../types';
import { Api } from '../../api';
import { removeDuplicates } from '../../screen/functions';

export const getRecentItemList = () => {
  return (dispatch) => {
    // dispatch({type: LOADING, payload: true});
    // let obj = {"inputUserId":"5fe22753601dea3024445350"}
    return Api('get-recent-item', 'get')
      .then(async (res) => {
        console.log('response for recent item---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          let responseArray = res?.data?.data;
          responseArray = await removeDuplicates(responseArray, 'product');
          dispatch({ type: FETCH_RECENT_ITEMS, payload: responseArray });
          return Promise.resolve(true);
        } else if (res.status >= 201) {
          // alert(res.data.message);
          dispatch({ type: FETCH_RECENT_ITEMS, payload: [] });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: FETCH_RECENT_ITEMS, payload: [] });
        dispatch({ type: LOADING, payload: false });
      });
  };
};
export const getTrendingProduct = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    // let obj = {"inputUserId":"5fe22753601dea3024445350"}
    return Api('trending-product', 'get')
      .then((res) => {
        console.log('trending response---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          dispatch({ type: FETCH_ALL_TRENDING_PRODUCT, payload: res?.data?.data });
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          // alert(res.data.message);
          dispatch({ type: FETCH_ALL_TRENDING_PRODUCT, payload: [] });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: FETCH_ALL_TRENDING_PRODUCT, payload: [] });
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const getProductDetail = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });

    return Api('get-product-detail', 'post', data)
      .then((res) => {
        console.log('response---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          dispatch({ type: FETCH_PRODUCT_DETAIL, payload: res?.data?.data });
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          // alert(res.data.message);
          dispatch({ type: FETCH_PRODUCT_DETAIL, payload: [] });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: FETCH_PRODUCT_DETAIL, payload: [] });
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const addItemToCart = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    let obj = { inputProductQuantity: 1, inputProductId: data, inputProductColor: 'black' };

    return Api('add-cart', 'post', data)
      .then((res) => {
        console.log('response---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          // dispatch({type: FETCH_MY_CART, payload: res.data.data});
          return Promise.resolve(true);
        } else if (res.status >= 201) {
          alert(res.data.message);
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: LOADING, payload: false });
      });
  };
};
export const removeItemFromCart = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    let obj = { inputProductId: data, inputProductColor: 'black' };

    return Api('remove-cart', 'post', obj)
      .then((res) => {
        console.log('response---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          // dispatch({type: FETCH_MY_CART, payload: res.data.data});
          return Promise.resolve(true);
        } else if (res.status >= 201) {
          // alert(res.data.message);
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: LOADING, payload: false });
      });
  };
};
export const getCartItems = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: false });
    return Api('get-cart', 'get')
      .then((res) => {
        console.log('response---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          dispatch({ type: FETCH_MY_CART, payload: res.data.data });
          return Promise.resolve(true);
        } else if (res.status >= 201) {
          // alert(res.data.message);
          dispatch({ type: FETCH_MY_CART, payload: [] });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: FETCH_MY_CART, payload: [] });
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const getAllCategories = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('get-category', 'get')
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          dispatch({ type: FETCH_ALL_CATEGORIES, payload: res?.data?.data });
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: FETCH_ALL_CATEGORIES, payload: [] });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: FETCH_ALL_CATEGORIES, payload: [] });
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const getAllStoresForCustomers = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('store-list-home', 'get')
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          dispatch({ type: FETCH_ALL_SHOPS_FOR_CUSTOMER, payload: res?.data?.data });
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: FETCH_ALL_SHOPS_FOR_CUSTOMER, payload: [] });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: FETCH_ALL_SHOPS_FOR_CUSTOMER, payload: [] });
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const getCategoryWiseProduct = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('shop-by-category', 'post', data)
      .then((res) => {
        console.log('res---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: LOADING, payload: false });
      });
  };
};
export const getBrandWiseProduct = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('shop-by-brand', 'post', data)
      .then((res) => {
        console.log('res---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: LOADING, payload: false });
      });
  };
};
export const getQuickHomeScreenProduct = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('get-home-products', 'post')
      .then((res) => {
        console.log('home screnn res---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('home screnn err', err);
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const getAllBrandList = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('get-brand', 'get')
      .then((res) => {
        console.log('res---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: LOADING, payload: false });
      });
  };
};
export const getFilterData = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('filter-product', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: LOADING, payload: false });
      });
  };
};
export const getShopWiseProduct = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('shop-by-store', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const searchProduct = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('search-product', 'post', data)
      .then((res) => {
        console.log('res---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const addItemToRecentItemList = (data) => {
  return (dispatch) => {
    // dispatch({type: LOADING, payload: true});
    return Api('add-recent-item', 'post', data)
      .then((res) => {
        console.log('res---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          return Promise.resolve(true);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: LOADING, payload: false });
      });
  };
};
