import {
  LOADING,
  EVENT_INFORMATION,
  FETCH_SHOP_LIST,
  FETCH_SHOP_PRODUCT,
  FETCH_SHOP_OWNER_ORDERS,
} from '../types';
import { Api } from '../../api';

export const fetchEventInformation = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('userActions/getEventInformation', 'get')
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          dispatch({ type: EVENT_INFORMATION, payload: res.data.data });
          return Promise.resolve(res.data.data);
        } else if (res.status >= 201) {
          alert(res.data.data);
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const requestForAddingStore = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('add-store', 'post', data)
      .then((res) => {
        console.log('response---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
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

export const requestForEditStore = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('edit-store', 'post', data)
      .then((res) => {
        console.log('response---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
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

export const updateStoreProductDetail = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('edit-products', 'post', data)
      .then((res) => {
        console.log('response---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
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
export const getShopList = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('store-list', 'get')
      .then((res) => {
        console.log('response---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          dispatch({ type: FETCH_SHOP_LIST, payload: res.data.data });
          return Promise.resolve(true);
        } else if (res.status >= 201) {
          // alert(res.data.message);
          dispatch({ type: FETCH_SHOP_LIST, payload: [] });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: FETCH_SHOP_LIST, payload: [] });
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const updateStoreStatus = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('approve-store', 'post', data)
      .then((res) => {
        console.log('response---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
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
export const addNewProductToStore = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('add-products', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          return Promise.resolve(true);
        } else if (res.status >= 201) {
          // alert(res.data.message);
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        alert(JSON.stringify(err));
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const getStoreProductList = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('product-list', 'get')
      .then((res) => {
        console.log('res---', res);
        dispatch({ type: LOADING, payload: false });
        if (res.status === 200) {
          dispatch({ type: FETCH_SHOP_PRODUCT, payload: res?.data?.data });
          return Promise.resolve(true);
        } else if (res.status >= 201) {
          dispatch({ type: FETCH_SHOP_PRODUCT, payload: [] });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: FETCH_SHOP_PRODUCT, payload: [] });
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const removeProductFromStore = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('remove-product', 'post', data)
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

export const getShopOrders = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('get-order', 'get')
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        console.log('res--', res);
        if (res.status === 200) {
          dispatch({ type: FETCH_SHOP_OWNER_ORDERS, payload: res?.data?.data });
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: FETCH_SHOP_OWNER_ORDERS, payload: [] });
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        dispatch({ type: FETCH_SHOP_OWNER_ORDERS, payload: [] });
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const getMyShopDetails = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('own-store-detail', 'get')
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        console.log('res--', res);
        if (res.status === 200) {
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        alert(JSON.stringify(err));
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const updateStoreOrderDeliverStatus = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('update-status-order', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        console.log('res--', res);
        if (res.status === 200) {
          return Promise.resolve(true);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        alert(JSON.stringify(err));
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const updateStoreMinorInformation = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('edit-store-minor-information', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        console.log('res--', res);
        if (res.status === 200) {
          return Promise.resolve(true);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        alert(JSON.stringify(err));
        dispatch({ type: LOADING, payload: false });
      });
  };
};

export const getStorePaymentModes = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('get-payment-mode', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        console.log('res--', res);
        if (res.status === 200) {
          return Promise.resolve(res?.data?.data);
        } else if (res.status >= 201) {
          dispatch({ type: LOADING, payload: false });
          return Promise.resolve(false);
        }
      })
      .catch((err) => {
        console.log('err', err);
        alert(JSON.stringify(err));
        dispatch({ type: LOADING, payload: false });
      });
  };
};
