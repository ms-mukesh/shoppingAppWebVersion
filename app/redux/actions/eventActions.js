import {LOADING,EVENT_INFORMATION} from "../types";
import {Api} from "../../api";

export const fetchEventInformation = () => {
    return dispatch => {
        dispatch({type: LOADING, payload: true});
        return Api('userActions/getEventInformation', 'get')
            .then(res => {
                dispatch({type: LOADING, payload: false});
                if (res.status === 200) {
                    dispatch({type: EVENT_INFORMATION, payload: res.data.data});
                    return Promise.resolve(res.data.data);
                } else if (res.status >= 201) {
                    alert(res.data.data);
                    dispatch({type: LOADING, payload: false});
                    return Promise.resolve(false);
                }
            })
            .catch(err => {
                dispatch({type: LOADING, payload: false});
            });
    };
};
