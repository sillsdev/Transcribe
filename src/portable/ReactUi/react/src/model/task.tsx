interface ITask {
    assignedto: string;
    id: string;
    name: string;
    state: string;
};

interface IProject {
    id: string;
    type?: string;
    task: ITask[];
};

