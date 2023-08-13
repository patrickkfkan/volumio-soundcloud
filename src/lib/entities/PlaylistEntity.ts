import SetEntity from './SetEntity';

interface PlaylistEntity extends SetEntity {
  type: 'playlist' | 'system-playlist';
  id?: number | string;
}

export default PlaylistEntity;
