interface IHistory {
    id: number;
    datetime?: string;
    action: string;
    userid: string;
    comment: string;
};

interface ITask {
    id: string;
    length?: number;
    position?: number;
    state: string;
    hold?: string;
    assignedto?: string;
    name?: string;
    transcribing?: boolean;
    history?: IHistory[];
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
    direction?: string;
    sync?: boolean;
    claim?: boolean;
    type?: string;
    uri?: string;
    task: ITask[];
};

