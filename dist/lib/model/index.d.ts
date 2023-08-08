import AlbumModel from './AlbumModel';
import PlaylistModel from './PlaylistModel';
import SelectionModel from './SelectionModel';
import TrackModel from './TrackModel';
import UserModel from './UserModel';
export declare enum ModelType {
    Album = "Album",
    Playlist = "Playlist",
    Selection = "Selection",
    Track = "Track",
    User = "User"
}
export type ModelOf<T extends ModelType> = T extends ModelType.Album ? AlbumModel : T extends ModelType.Playlist ? PlaylistModel : T extends ModelType.Selection ? SelectionModel : T extends ModelType.Track ? TrackModel : T extends ModelType.User ? UserModel : never;
export default class Model {
    static getInstance<T extends ModelType>(type: T): ModelOf<T>;
}
//# sourceMappingURL=index.d.ts.map