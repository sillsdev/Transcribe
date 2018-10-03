import { IProjectSettingsStrings, ITranscriberStrings, IUserSettingsStrings } from "./localize";

export interface IState {
    users: {
        loaded: boolean;
        deleted: boolean;
        users: IUser[];
        selectedUser: string;
        selectedPopupUser: string;
    };
    tasks: {
        loaded: boolean;
        pending: boolean;
        deleted: boolean;
        projects: IProject[];
        selectedProject: string;
        selectedTask: string;
        selectedPopupTask: string;
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
        loaded: boolean;
        projectSettings: IProjectSettingsStrings;
        transcriber: ITranscriberStrings;
        userSettings: IUserSettingsStrings;
    };
    paratextProjects: {
        loaded: boolean;
        paratextProjects: IParatextProject[];
        selectedParatextProject: string;
    };
}