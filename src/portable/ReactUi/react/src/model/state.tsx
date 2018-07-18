interface IState {
    users: {
        users: IUser[];
        selectedUser: string;
    };
    tasks: {
        loaded: boolean;
        pending: boolean;
        projects: IProject[];
        selectedProject: string;
        selectedTask: string;
    }
    audio: {
        playSpeedRate: number;
        playing: boolean;
    }
}