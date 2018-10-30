import Axios from 'axios';
import { log } from '../actions/logAction';
import { FETCH_LOCALIZATION } from './types';


export const fetchLocalization = () => (dispatch: any) => {
    Axios.get('/localization/strings.json')
        .then(strings => {
            dispatch({
                payload: strings,
                type: FETCH_LOCALIZATION
            });
        })
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " fetch localization"))
        });
}
