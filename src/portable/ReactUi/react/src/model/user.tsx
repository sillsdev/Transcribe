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
  displayName: string;
  hotkey: IUserHotkey[];
  id: number;
  progress: string;
  project: IUserProjectSettings[];
  role: string[];
  setting: IGenericUserSetting[];
  speed: number;
  timer: string;
  uilang: string;
  username: {
      avatarUri: string;
      id: string;
  }
};
  