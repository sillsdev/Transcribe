interface IUserProjectSettings {
  fontfamily: string;
  fontsize:string;
  id: string;
};

interface IGenericUserSetting {
  name: string;
  value: string;
};

interface IUserHotkey {
  id: string;
  text: string;
}

interface IUser {
    id: number;
    displayName: string;
    projects: IUserProjectSettings[];
    settings: {
      transcriber: {
        hotkey: IUserHotkey[];
        progress: string;
        setting: IGenericUserSetting[];
        speed: number;
        timer: string;
        uilang: string;
      }
    }
    username: {
      avatarUri: string;
      id: string;
    }
  };
  