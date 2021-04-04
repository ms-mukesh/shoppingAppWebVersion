import { Api } from '../../api';
import { FETCH_CUSTOMER_ORDER, FETCH_MY_ADDRESS, LOADING } from '../types';

export const addNewFamily = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('userActions/addNewFamily', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          // dispatch({type: SEARCH_DATA, payload: res.data});
          return Promise.resolve(res.data.data);
        } else {
          alert(res.data.data);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        alert(res.data.data);
        return Promise.resolve(false);
      });
  };
};

export const getFamilyWiseMembers = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('userActions/getFamilyDetailList', 'get')
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          return Promise.resolve(res.data.data);
        } else {
          alert(res.data.data);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        alert(res.data.data);
        return Promise.resolve(false);
      });
  };
};
export const insertNewVoter = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('userActions/addNewVoter', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          // dispatch({type: SEARCH_DATA, payload: res.data});
          return Promise.resolve(res.data.data);
        } else {
          alert(res.data.data);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        alert(res.data.data);
        return Promise.resolve(false);
      });
  };
};

export const getMyAddresses = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    let obj = { inputUserId: '5fe22753601dea3024445350' };
    return Api('get-address', 'get')
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          // dispatch({type: SEARCH_DATA, payload: res.data});
          dispatch({ type: FETCH_MY_ADDRESS, payload: res.data.data });
          return Promise.resolve(true);
        } else {
          dispatch({ type: FETCH_MY_ADDRESS, payload: [] });
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
      });
  };
};

export const placeUserOrder = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    let obj = { inputUserId: '5fe22753601dea3024445350' };
    return Api('order', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          // dispatch({type: SEARCH_DATA, payload: res.data});
          // dispatch({type: FETCH_MY_ADDRESS, payload: res.data.data});
          return Promise.resolve(res?.data);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        alert(res.data.data);
        return Promise.resolve(false);
      });
  };
};

export const placeDirectUserOrder = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('buy-now', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          return Promise.resolve(res?.data?.data);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
      });
  };
};
export const updatePlaceOrderStatusForPayment = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('update-payment-order', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          return Promise.resolve(true);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
      });
  };
};
export const updatePlaceOrderStatusForPaymentForCart = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('update-payment-status', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          return Promise.resolve(true);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
      });
  };
};

export const editUserProfile = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('edit-user', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          return Promise.resolve(true);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
      });
  };
};
export const getCustomerOrder = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    let obj = { inputUserId: '5fe22753601dea3024445350' };
    return Api('get-user-order', 'get')
      .then((res) => {
        console.log('res--', res);
        dispatch({ type: FETCH_CUSTOMER_ORDER, payload: res.data.data });
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          dispatch({ type: FETCH_CUSTOMER_ORDER, payload: res.data.data });
          // dispatch({type: SEARCH_DATA, payload: res.data});
          // dispatch({type: FETCH_MY_ADDRESS, payload: res.data.data});
          return Promise.resolve(true);
        } else {
          dispatch({ type: FETCH_CUSTOMER_ORDER, payload: [] });
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        dispatch({ type: FETCH_CUSTOMER_ORDER, payload: [] });
        return Promise.resolve(false);
      });
  };
};

export const getShopOwnerOrders = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('get-order', 'get')
      .then((res) => {
        console.log('res--', res);
        // dispatch({type: FETCH_CUSTOMER_ORDER, payload: res.data.data});
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          // dispatch({type: SEARCH_DATA, payload: res.data});
          // dispatch({type: FETCH_MY_ADDRESS, payload: res.data.data});
          return Promise.resolve(true);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
      });
  };
};

export const addNewAddress = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('add-address', 'post', data)
      .then((res) => {
        console.log('res--', res);
        // dispatch({type: FETCH_CUSTOMER_ORDER, payload: res.data.data});
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          // dispatch({type: SEARCH_DATA, payload: res.data});
          // dispatch({type: FETCH_MY_ADDRESS, payload: res.data.data});
          return Promise.resolve(true);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
      });
  };
};

export const removeAddress = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('remove-address', 'post', data)
      .then((res) => {
        console.log('res--', res);
        // dispatch({type: FETCH_CUSTOMER_ORDER, payload: res.data.data});
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          // dispatch({type: SEARCH_DATA, payload: res.data});
          // dispatch({type: FETCH_MY_ADDRESS, payload: res.data.data});
          return Promise.resolve(true);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
      });
  };
};

export const getAutoCompleteData = () => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('auto-complete', 'get')
      .then((res) => {
        console.log('res--', res);
        // dispatch({type: FETCH_CUSTOMER_ORDER, payload: res.data.data});
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          // dispatch({type: SEARCH_DATA, payload: res.data});
          // dispatch({type: FETCH_MY_ADDRESS, payload: res.data.data});
          return Promise.resolve(res?.data ?? false);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
      });
  };
};
export const addNewBrand = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('add-brand', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          return Promise.resolve(true);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });

        return Promise.resolve(false);
      });
  };
};
export const addNewFabric = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('add-fabric', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          return Promise.resolve(true);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });

        return Promise.resolve(false);
      });
  };
};
export const addNewType = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });
    return Api('add-type', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          return Promise.resolve(true);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });

        return Promise.resolve(false);
      });
  };
}
export const getOrderIdFromRazorPay = (data) => {
  return (dispatch) => {
    dispatch({ type: LOADING, payload: true });

    return Api('payment', 'post', data)
      .then((res) => {
        dispatch({ type: LOADING, payload: false });
        if (!res) {
          console.log('Unauthorized Access');
        } else if (res.status === 200) {
          return Promise.resolve(res.data.data);
        } else {
          alert(res.data.message);
          return Promise.resolve(false);
        }
      })
      .catch(() => {
        dispatch({ type: LOADING, payload: false });
        return Promise.resolve(false);
      });
  };
};
