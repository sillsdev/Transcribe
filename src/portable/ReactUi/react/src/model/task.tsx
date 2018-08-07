interface ITask {
    assignedto: string;
    id: string;
    length?: number;
    name: string;
    state: string;
    transcribing: boolean;
};

interface IProject {
    id: string;
    lang: string;
    direction: string;
    type?: string;
    task: ITask[];
};

