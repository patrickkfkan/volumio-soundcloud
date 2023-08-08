import UserEntity from './UserEntity';

interface TrackEntity {
  type: 'track';
  id?: number;
  title?: string | null;
  album?: string | null;
  thumbnail: string | null;
  playableState: 'blocked' | 'snipped' | 'allowed';
  transcodings: {
    url?: string | null;
    protocol?: string | null;
    mimeType?: string | null;
  }[];
  user: UserEntity | null;
}

export default TrackEntity;
