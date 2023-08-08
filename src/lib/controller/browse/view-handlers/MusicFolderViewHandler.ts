import sc from '../../../SoundCloudContext';
import { ModelType } from '../../../model';
import ExplodableViewHandler, { ExplodedTrackInfo } from './ExplodableViewHandler';
import View from './View';
import { RenderedList, RenderedPage } from './ViewHandler';
import { RendererType } from './renderers';
import BaseRenderer, { RenderedListItem } from './renderers/BaseRenderer';
import MusicFolderEntity from '../../../entities/MusicFolderEntity';
import { LoopFetchResult } from '../../../model/BaseModel';

export interface MusicFolderView extends View {
  search?: string;
  userId?: string;
  title?: string;
  // Flag
  combinedSearch?: '1';
}

export interface MusicFolderViewHandlerGetFoldersParams {
  userId?: number;
  search?: string;
  pageToken?: string;
  pageOffset?: number;
  limit?: number;
}

export default abstract class MusicFolderViewHandler<T extends MusicFolderView, ID extends string | number, E extends MusicFolderEntity> extends ExplodableViewHandler<T> {

  protected abstract getFolderIdFromView(): ID | null | undefined;
  protected abstract getFolder(id: ID): Promise<{ folder: E, tracksOffset?: number, tracksLimit?: number }>;
  protected abstract getFolders(modelParams: MusicFolderViewHandlerGetFoldersParams): Promise<LoopFetchResult<E>>;
  protected abstract getFoldersListTitle(): string;
  protected abstract getFolderRenderer(): BaseRenderer<E>;
  protected abstract getExplodedTrackInfoFromParamName(): 'fromAlbumId' | 'fromPlaylistId';
  protected abstract getVisitLinkTitle(): string;

  browse(): Promise<RenderedPage> {
    const view = this.currentView;
    const id = this.getFolderIdFromView();

    if (view.search) {
      return this.browseSearch(view.search);
    }
    else if (view.userId) {
      return this.browseByUser(Number(view.userId));
    }
    else if (id !== null && id !== undefined) {
      return this.browseFolder(id);
    }

    throw Error('Unknown criteria');
  }

  protected async browseSearch(query: string): Promise<RenderedPage> {
    const { combinedSearch, pageRef } = this.currentView;
    const pageToken = pageRef?.pageToken;
    const pageOffset = pageRef?.pageOffset;
    const limit = combinedSearch ? sc.getConfigValue('combinedSearchResults') : sc.getConfigValue('itemsPerPage');

    const modelParams: Record<string, any> = { search: query };
    if (pageToken !== undefined) {
      modelParams.pageToken = pageToken;
    }
    if (pageOffset !== undefined) {
      modelParams.pageOffset = pageOffset;
    }
    modelParams.limit = limit;

    const result = await this.getFolders(modelParams);

    return this.buildPageFromLoopFetchResult(
      result,
      this.getFolderRenderer(),
      this.getFoldersListTitle()
    );
  }

  protected async browseByUser(userId: number): Promise<RenderedPage> {
    const { pageRef, inSection } = this.currentView;
    const pageToken = pageRef?.pageToken;
    const pageOffset = pageRef?.pageOffset;
    const limit = inSection ? sc.getConfigValue('itemsPerSection') : sc.getConfigValue('itemsPerPage');

    const modelParams: Record<string, any> = { userId };
    if (pageToken !== undefined) {
      modelParams.pageToken = pageToken;
    }
    if (pageOffset !== undefined) {
      modelParams.pageOffset = pageOffset;
    }
    modelParams.limit = limit;

    const result = await this.getFolders(modelParams);

    const page = this.buildPageFromLoopFetchResult(
      result,
      this.getFolderRenderer(),
      this.getFoldersListTitle()
    );

    if (!inSection && page.navigation) {
      const userData = await this.getModel(ModelType.User).getUser(userId);
      if (userData) {
        const header = this.getRenderer(RendererType.User).renderToHeader(userData);
        if (header) {
          page.navigation.info = header;
        }
      }
    }

    return page;
  }

  protected async browseFolder(id: ID): Promise<RenderedPage> {
    const { folder, tracksOffset, tracksLimit } = await this.getFolder(id);
    const renderer = this.getRenderer(RendererType.Track);
    const listItems = folder.tracks.reduce<RenderedListItem[]>((result, track) => {
      const rendered = renderer.renderToListItem(track);
      if (rendered) {
        result.push(rendered);
      }
      return result;
    }, []);

    if (!sc.getConfigValue('loadFullPlaylistAlbum') && tracksLimit !== undefined) {
      const nextOffset = (tracksOffset || 0) + tracksLimit;
      if ((folder.trackCount || 0) > nextOffset) {
        const nextPageRef = this.constructPageRef(nextOffset.toString(), 0);
        if (nextPageRef) {
          listItems.push(this.constructNextPageItem(nextPageRef));
        }
      }
    }

    let title = this.currentView.title || sc.getI18n('SOUNDCLOUD_LIST_TITLE_TRACKS');
    if (folder.permalink) {
      title = this.addLinkToListTitle(
        title,
        folder.permalink,
        this.getVisitLinkTitle()
      );
    }

    const list: RenderedList = {
      title,
      availableListViews: [ 'list', 'grid' ],
      items: listItems
    };

    return {
      navigation: {
        prev: { uri: this.constructPrevUri() },
        info: this.getFolderRenderer().renderToHeader(folder),
        lists: [ list ]
      }
    };
  }

  protected async getTracksOnExplode(): Promise<ExplodedTrackInfo | ExplodedTrackInfo[]> {
    const id = this.getFolderIdFromView();
    if (id === undefined || id === null) {
      throw Error('Id of target not specified');
    }
    const { folder } = await this.getFolder(id);
    const fromParamName = this.getExplodedTrackInfoFromParamName();

    const trackInfos = folder?.tracks.map((track) => {
      const info: ExplodedTrackInfo = { ...track };
      Reflect.set(info, fromParamName, id);
      return info;
    }) || [];

    return trackInfos;
  }
}
