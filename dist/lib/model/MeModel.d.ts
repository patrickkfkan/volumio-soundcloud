import BaseModel, { LoopFetchResult } from './BaseModel';
import PlaylistEntity from '../entities/PlaylistEntity';
import AlbumEntity from '../entities/AlbumEntity';
import TrackEntity from '../entities/TrackEntity';
export interface MeModelGetLikesParams {
    pageToken?: string;
    pageOffset?: number;
    limit?: number;
    type: 'track' | 'playlistAndAlbum';
}
export interface MeModelGetLibraryItemsParams {
    pageToken?: string;
    pageOffset?: number;
    limit?: number;
    type: 'album' | 'playlist' | 'station';
}
export default class MeModel extends BaseModel {
    #private;
    getLikes(params: MeModelGetLikesParams & {
        type: 'playlistAndAlbum';
    }): Promise<LoopFetchResult<AlbumEntity | PlaylistEntity>>;
    getLikes(params: MeModelGetLikesParams & {
        type: 'track';
    }): Promise<LoopFetchResult<TrackEntity>>;
    getLibraryItems(params: MeModelGetLibraryItemsParams): Promise<LoopFetchResult<PlaylistEntity | AlbumEntity>>;
    getMyProfile(): Promise<import("../entities/UserEntity").default | null>;
}
//# sourceMappingURL=MeModel.d.ts.map