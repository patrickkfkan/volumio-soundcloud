import MusicFolderEntity from './MusicFolderEntity';

interface AlbumEntity extends MusicFolderEntity {
  type: 'album';
  id?: number;
}

export default AlbumEntity;
