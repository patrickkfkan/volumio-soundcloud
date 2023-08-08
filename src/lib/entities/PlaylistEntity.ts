import MusicFolderEntity from './MusicFolderEntity';

interface PlaylistEntity extends MusicFolderEntity {
  type: 'playlist' | 'system-playlist';
  id?: number | string;
}

export default PlaylistEntity;
