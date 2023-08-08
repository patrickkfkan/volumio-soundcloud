import MusicFolderEntity from '../../../../entities/MusicFolderEntity';
import BaseRenderer, { RenderedHeader, RenderedListItem } from './BaseRenderer';
export default abstract class MusicFolderRenderer<T extends MusicFolderEntity> extends BaseRenderer<T> {
    renderToListItem(data: T): RenderedListItem | null;
    renderToHeader(data: T): RenderedHeader | null;
    protected abstract getListItemUri(data: T): string;
    protected abstract getListItemAlbum(data: T): string;
}
//# sourceMappingURL=MusicFolderRenderer.d.ts.map