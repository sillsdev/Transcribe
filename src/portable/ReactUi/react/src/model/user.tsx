interface IUserProjectSettings {
  fontfamily: string;
  fontsize:string;
  id: string;
};

interface IUserKeyVal {
  id: string;
  text: string;
}

interface IUser {
  displayName: string;
  hotkey: IUserKeyVal[];
  id: number;
  progress: string;
  project: IUserProjectSettings[];
  role: string[];
  setting: IUserKeyVal[];
  speed: number;
  timer: string;
  uilang: string;
  username: {
      avatarUri: string;
      id: string;
  }
};
  