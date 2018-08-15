import { createSelector } from 'reselect';
import { IState } from '../model/state';

const usersSelector = (state: IState): IUser[] => state.users.users;
const currentUserSelector = (state: IState): string => state.users.selectedUser;

const lastTask = createSelector( usersSelector, currentUserSelector, (users, currentUser) => {
    const user = users.filter(u => u.username.id === currentUser)[0];
    return  (user != null && user.setting != null)? user.setting.filter(s => s.id === "lastTask")[0].text: undefined;
});

export default lastTask;
