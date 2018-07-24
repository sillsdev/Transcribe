import Axios from 'axios';
import { FETCH_LOCALIZATION } from './types';


export const fetchLocalization = () => (dispatch: any) => {
    Axios.get('/localization/strings.json').
        then(strings => {
            dispatch({
                payload: strings,
                type: FETCH_LOCALIZATION
            });
        });
}
