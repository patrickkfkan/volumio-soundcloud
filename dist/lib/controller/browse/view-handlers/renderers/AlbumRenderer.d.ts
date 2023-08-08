import AlbumEntity from '../../../../entities/AlbumEntity';
import MusicFolderRenderer from './MusicFolderRenderer';
export default class AlbumRenderer extends MusicFolderRenderer<AlbumEntity> {
    protected getListItemUri(data: AlbumEntity): string;
    protected getListItemAlbum(): string;
}
//# sourceMappingURL=AlbumRenderer.d.ts.map