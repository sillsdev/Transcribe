import { FETCH_LOCALIZATION } from '../actions/types';

const initialState = {
    strings: {}
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_LOCALIZATION:
            return {
                ...state,
                strings: action.payload.data
            };
        default:
            return state;
    }
}
