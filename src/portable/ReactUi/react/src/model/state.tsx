import { IProjectSettingsStrings, ITranscriberStrings, IUserSettingsStrings } from "./localize";

export interface IState {
    users: {
        loaded: boolean;
        deleted: boolean;
        users: IUser[];
        selectedUser: string;
        selectPopupUser: string;
        selectedPopupUser: string;
        userHotKeys: IUserKeyVal[];
    };
    tasks: {
        loaded: boolean;
        pending: boolean;
        deleted: boolean;
        projects: IProject[];
        selectedProject: string;
        selectedTask: string;
        selectedPopupTask: string;
        zttProjectsCount: string;
        selectedOption: string;
        todoHighlight: boolean;
    };
    audio: {
        initialPosition: number;
        initialTranscription: boolean;
        jump: number;
        playedSeconds: number;
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
    avatar: IAvatarState;
    meta: {
        size: number;
        waveform: string;
    };
}