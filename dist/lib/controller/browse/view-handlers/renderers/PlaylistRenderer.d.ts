import PlaylistEntity from '../../../../entities/PlaylistEntity';
import MusicFolderRenderer from './MusicFolderRenderer';
export default class PlaylistRenderer extends MusicFolderRenderer<PlaylistEntity> {
    protected getListItemUri(data: PlaylistEntity): string;
    protected getListItemAlbum(): string;
}
//# sourceMappingURL=PlaylistRenderer.d.ts.map