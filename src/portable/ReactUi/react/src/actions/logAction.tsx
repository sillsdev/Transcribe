import Axios from 'axios';

export const log = (message: string) => {
    Axios.put('/api/Log?' + message);
}
