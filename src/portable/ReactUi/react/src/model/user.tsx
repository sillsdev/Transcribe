interface IUserProjectSettings {
  fontfamily?: string;
  fontsize?:string;
  id: string;
};

interface IUserKeyVal {
  id: string;
  text: string;
}

interface IUser {
  id: number;
  skill?: string;
  username: {
    avatarUri?: string;
    fullName?: string;
    id: string;
    password?: string;
  }
  role: string[];
  project?: IUserProjectSettings[];
  displayName: string;
  hotkey?: IUserKeyVal[];
  uilang?: string;
  oslang?: string;
  timer?: string;
  speed?: number;
  progress?: string;
  setting?: IUserKeyVal[];
};
  