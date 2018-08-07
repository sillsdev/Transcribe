import { ITranscriberStrings, IUserSettingsStrings } from "./localize";

export interface IState {
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
    };
    audio: {
        initialPosition: number;
        jump: number;
        playSpeedRate: number;
        playing: boolean;
        reportedPosition: number;
        requestReport: boolean;
        totalSeconds: number;
        transcription: string;
    };
    strings: {
        transcriber: ITranscriberStrings;
        userSettings: IUserSettingsStrings;
    };
}