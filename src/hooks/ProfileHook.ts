import { useEffect, useReducer } from "react";
import { callGetProfile } from "../api/api";
import SetWebPageTitle from "../utils/helperFunction/setTitlePage";
import { ProfileHookAction } from "../utils/types/action";
import { initProfile } from "../utils/types/emptyValue";
import { ProfileHookState } from "../utils/types/state";







const reducer = (state: ProfileHookState, action: ProfileHookAction): ProfileHookState => {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            return { ...action.payload }
        case 'SET_PAGE':
            return { ...state }
        case 'SET_TARGET':
            return {...state, target: action.payload};
        default:
            return state;
    }
};

export default function useProfile() {
    const [state, dispatch] = useReducer(reducer, initProfile);

    useEffect(() => {
        SetWebPageTitle("Trang cá nhân")
        callGetProfile().then(result => {
            if (!result) {
                return;
            }

            dispatch({ type: "FETCH_SUCCESS", payload: result })
        }
        );
    }, [])
    return {
        state,
        dispatch,
    }
}
