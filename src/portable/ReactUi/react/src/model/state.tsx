interface IState {
    users: {
        user: IUser[];
        selectedUser: string;
    };
    tasks: {
        assignedTranscribe: ITask[],
        availableTranscribe: ITask[],
        projects: IProject[];
        selectedProject: string;
    }
}