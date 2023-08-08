import sc from '../../../../SoundCloudContext';
import PlaylistEntity from '../../../../entities/PlaylistEntity';
import { PlaylistView } from '../PlaylistViewHandler';
import ViewHelper from '../ViewHelper';
import MusicFolderRenderer from './MusicFolderRenderer';

export default class PlaylistRenderer extends MusicFolderRenderer<PlaylistEntity> {

  protected getListItemUri(data: PlaylistEntity): string {
    const playlistView: PlaylistView = {
      name: 'playlists',
      playlistId: data.id?.toString()
    };
    if (data.type === 'system-playlist') {
      playlistView.type = 'system';
    }
    return `${this.uri}/${ViewHelper.constructUriSegmentFromView(playlistView)}`;
  }

  protected getListItemAlbum(): string {
    return sc.getI18n('SOUNDCLOUD_PLAYLIST_PARSER_ALBUM');
  }
}
