interface IAvatar {
    data: string;
    uri: string;
};

interface IAvatarState extends IAvatar {
    borderRadius: number;
    saveToProject: string;
}
