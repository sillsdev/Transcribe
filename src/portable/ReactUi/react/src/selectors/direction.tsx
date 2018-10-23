import { createSelector } from 'reselect';
import { IState } from '../model/state';
import { UserLanguages } from '../model/UserLanguages';

const usersSelector = (state: IState): IUser[] => state.users.users;
const currentUserSelector = (state: IState): string => state.users.selectedUser;

const direction = createSelector( usersSelector, currentUserSelector, (users, currentUser) => {
    const user = users.filter(u => u.username.id === currentUser)[0];
    if (user && user.uilang) {
        const lang = UserLanguages.languages.filter((l:string) => l.split(':')[0] === user.uilang)[0]
        const dir = lang.split(':')[2]
        if (dir) {
            return dir
        }
    }
    return "ltr"
});

export default direction;
