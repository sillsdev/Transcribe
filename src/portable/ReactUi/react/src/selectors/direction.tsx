import { createSelector } from 'reselect';
import { log } from '../actions/logAction';
import { IState } from '../model/state';
import { UserLanguages } from '../model/UserLanguages';

const usersSelector = (state: IState): IUser[] => state.users.users;
const currentUserSelector = (state: IState): string => state.users.selectedUser;

const direction = createSelector( usersSelector, currentUserSelector, (users, currentUser) => {
    const user = users && users.filter(u => u.username.id === currentUser)[0];
    if (user && user.uilang) {
        const selectLang = user.uilang? user.uilang.slice(0,2).toLowerCase(): ""
        const lang = UserLanguages.languages.filter((l:string) => l.split(':')[0] === selectLang)[0]
        const dir = lang && lang.split(':')[2]
        if (dir) {
            log("Direction=" + dir)
            return dir
        }
    }
    log("Direction=ltr")
    return "ltr"
});

export default direction;
