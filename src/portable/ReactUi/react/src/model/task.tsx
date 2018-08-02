interface ITask {
    assignedto: string;
    id: string;
    name: string;
    state: string;
    transcribing: boolean;
};

interface IProject {
    id: string;
    type?: string;
    task: ITask[];
};

