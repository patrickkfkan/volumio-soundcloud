import sc from '../../../SoundCloudContext';
import AlbumEntity from '../../../entities/AlbumEntity';
import { ModelType } from '../../../model';
import { AlbumModelGetAlbumParams } from '../../../model/AlbumModel';
import { LoopFetchResult } from '../../../model/BaseModel';
import MusicFolderViewHandler, { MusicFolderView, MusicFolderViewHandlerGetFoldersParams } from './MusicFolderViewHandler';
import { RendererType } from './renderers';
import BaseRenderer from './renderers/BaseRenderer';

export interface AlbumView extends MusicFolderView {
  name: 'albums';
  albumId?: string;
}

export default class AlbumViewHandler extends MusicFolderViewHandler<AlbumView, number, AlbumEntity> {

  protected getFolderIdFromView(): number | null | undefined {
    return Number(this.currentView.albumId);
  }

  protected getFolder(id: number): Promise<{ folder: AlbumEntity; tracksOffset?: number; tracksLimit?: number; }> {
    return this.#getAlbum(id);
  }

  protected getFolders(modelParams: MusicFolderViewHandlerGetFoldersParams): Promise<LoopFetchResult<AlbumEntity>> {
    return this.getModel(ModelType.Album).getAlbums(modelParams);
  }

  protected getFoldersListTitle(): string {
    return sc.getI18n('SOUNDCLOUD_LIST_TITLE_ALBUMS');
  }

  protected getFolderRenderer(): BaseRenderer<AlbumEntity, AlbumEntity> {
    return this.getRenderer(RendererType.Album);
  }

  protected getExplodedTrackInfoFromParamName(): 'fromAlbumId' | 'fromPlaylistId' {
    return 'fromAlbumId';
  }

  protected getVisitLinkTitle(): string {
    return sc.getI18n('SOUNDCLOUD_VISIT_LINK_ALBUM');
  }

  async #getAlbum(albumId: number) {
    const { pageRef } = this.currentView;
    const pageToken = pageRef?.pageToken;
    const loadAllTracks = sc.getConfigValue('loadFullPlaylistAlbum');

    const modelParams: AlbumModelGetAlbumParams = { loadTracks: true };
    if (Number(pageToken)) {
      modelParams.tracksOffset = Number(pageToken);
    }
    if (!loadAllTracks) {
      modelParams.tracksLimit = sc.getConfigValue('itemsPerPage');
    }

    const album = await this.getModel(ModelType.Album).getAlbum(albumId, modelParams);

    if (!album) {
      throw Error('Failed to fetch album');
    }

    return {
      folder: album,
      tracksOffset: modelParams.tracksOffset,
      tracksLimit: modelParams.tracksLimit
    };
  }
}
