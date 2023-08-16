import sc from '../../../SoundCloudContext';
import AlbumEntity from '../../../entities/AlbumEntity';
import PlaylistEntity from '../../../entities/PlaylistEntity';
import TrackEntity from '../../../entities/TrackEntity';
import { ModelType } from '../../../model';
import { HistoryModelGetPlayHistoryItemsParams } from '../../../model/HistoryModel';
import BaseViewHandler from './BaseViewHandler';
import View from './View';
import { RenderedPage } from './ViewHandler';
import { RendererType } from './renderers';

export interface HistoryView extends View {
  name: 'history';
  type?: 'set' | 'track';
}

export default class HistoryViewHandler extends BaseViewHandler<HistoryView> {

  async browse(): Promise<RenderedPage> {
    const { type } = this.currentView;

    if (type) {
      return this.#browseType(type, false);
    }

    const sets = (await this.#browseType('set', true)).navigation?.lists || [];
    const tracks = (await this.#browseType('track', true)).navigation?.lists || [];

    return {
      navigation: {
        prev: { uri: this.constructPrevUri() },
        lists: [ ...sets, ...tracks ]
      }
    };
  }

  async #browseType(type: 'set' | 'track', inSection: boolean) {
    const { pageRef } = this.currentView;
    const pageToken = pageRef?.pageToken;
    const pageOffset = pageRef?.pageOffset;
    const modelParams: HistoryModelGetPlayHistoryItemsParams = { type };

    if (pageToken) {
      modelParams.pageToken = pageRef.pageToken;
    }
    if (pageOffset) {
      modelParams.pageOffset = pageRef.pageOffset;
    }

    if (inSection) {
      modelParams.limit = sc.getConfigValue('itemsPerSection');
    }
    else {
      modelParams.limit = sc.getConfigValue('itemsPerPage');
    }

    const items = await this.getModel(ModelType.History).getPlayHistory(modelParams);
    const page = this.buildPageFromLoopFetchResult(
      items,
      this.#getRenderer.bind(this),
      type === 'track' ? sc.getI18n('SOUNDCLOUD_LIST_TITLE_RECENTLY_PLAYED_TRACKS') : sc.getI18n('SOUNDCLOUD_LIST_TITLE_RECENTLY_PLAYED')
    );

    return page;
  }

  #getRenderer(item: AlbumEntity | PlaylistEntity | TrackEntity) {
    if (item.type === 'album') {
      return this.getRenderer(RendererType.Album);
    }
    else if (item.type === 'playlist' || item.type === 'system-playlist') {
      return this.getRenderer(RendererType.Playlist);
    }
    else if (item.type === 'track') {
      return this.getRenderer(RendererType.Track);
    }
    return null;
  }
}
