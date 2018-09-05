import { ITranscriberStrings, IUserSettingsStrings } from "./localize";

export interface IState {
    users: {
        loaded: boolean;
        users: IUser[];
        selectedUser: string;
    };
    tasks: {
        loaded: boolean;
        pending: boolean;
        projects: IProject[];
        selectedProject: string;
        selectedTask: string;
    };
    audio: {
        initialPosition: number;
        initialTranscription: boolean;
        jump: number;
        playSpeedRate: number;
        playing: boolean;
        reportedPosition: number;
        requestReport: boolean;
        totalSeconds: number;
        transcription: string;
        submit: boolean;
        saved: boolean;
    };
    strings: {
        transcriber: ITranscriberStrings;
        userSettings: IUserSettingsStrings;
    };
    paratextProjects: {
        loaded: boolean;
        paratextProjects: IParatextProject[];
        selectedParatextProject: string;
    };
}