import TrackEntity from './TrackEntity';
import UserEntity from './UserEntity';
interface MusicFolderEntity {
    id?: any;
    title?: string | null;
    description?: string | null;
    thumbnail: string | null;
    permalink?: string | null;
    user: UserEntity | null;
    tracks: TrackEntity[];
    trackCount?: number;
}
export default MusicFolderEntity;
//# sourceMappingURL=MusicFolderEntity.d.ts.map