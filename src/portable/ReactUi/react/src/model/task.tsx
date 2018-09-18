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
    name?: string;
    guid?: string;
    lang: string;
    langName?: string;
    font?: string;
    size?: string;
    features?: string;
    direction: string;
    sync?: boolean;
    claim?: boolean;
    type?: string;
    task: ITask[];
};

