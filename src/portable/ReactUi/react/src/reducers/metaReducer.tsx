import { FETCH_META } from '../actions/types';

const initialState = {
    size: 0,
    waveform: "",
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_META:
            return {
                ...state,
                size: action.payload.data.size,
                waveform: action.payload.data.waveform,
            };
            default:
                return state;
    }
}
