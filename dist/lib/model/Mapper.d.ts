import { Album, Playlist, Selection, SystemPlaylist, Track, User } from 'soundcloud-fetch';
import UserEntity from '../entities/UserEntity';
import PlaylistEntity from '../entities/PlaylistEntity';
import TrackEntity from '../entities/TrackEntity';
import AlbumEntity from '../entities/AlbumEntity';
import SelectionEntity from '../entities/SelectionEntity';
export default class Mapper {
    #private;
    static mapUser(data: User): UserEntity;
    static mapPlaylist(data: Playlist | SystemPlaylist): PlaylistEntity;
    static mapTrack(data: Track): TrackEntity;
    static mapAlbum(data: Album): AlbumEntity;
    static mapSelection(data: Selection): SelectionEntity;
}
//# sourceMappingURL=Mapper.d.ts.map