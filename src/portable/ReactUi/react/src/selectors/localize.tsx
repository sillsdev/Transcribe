import { createSelector } from 'reselect';
import { IState } from '../model/state';

interface IStringsSelectorProps {
    layout: string;
};

const usersSelector = (state: IState): IUser[] => state.users.users;
const currentUserSelector = (state: IState): string => state.users.selectedUser;
const layoutSelector = (state: IState, props: IStringsSelectorProps) => state.strings[props.layout];

const userStrings = createSelector( layoutSelector, usersSelector, currentUserSelector, (layout, users, currentUser) => {
    const user = users.filter(u => u.username.id === currentUser)[0];
    if (user !== undefined){
        layout.setLanguage(user.uilang);
    }
    return (layout)
});

export default userStrings;
