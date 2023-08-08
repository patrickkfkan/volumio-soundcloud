import sc from '../../../SoundCloudContext';
import SelectionEntity from '../../../entities/SelectionEntity';
import { ModelType } from '../../../model';
import BaseViewHandler from './BaseViewHandler';
import { SelectionView } from './SelectionViewHandler';
import { TrackView } from './TrackViewHandler';
import View from './View';
import { RenderedList, RenderedPage } from './ViewHandler';
import ViewHandlerFactory from './ViewHandlerFactory';
import ViewHelper from './ViewHelper';
import { RendererType } from './renderers';
import { RenderedListItem } from './renderers/BaseRenderer';

export type RootView = View;

export default class RootViewHandler extends BaseViewHandler<RootView> {

  async browse(): Promise<RenderedPage> {
    const fetches = [
      this.#getTopFeaturedTracks(),
      this.#getMixedSelections()
    ];

    const fetchResults = await Promise.all(fetches);
    const lists = fetchResults.reduce<RenderedList[]>((result, list) => {
      result.push(...list);
      return result;
    }, []);

    return {
      navigation: {
        prev: { uri: '/' },
        lists
      }
    };
  }

  async #getTopFeaturedTracks(): Promise<RenderedList[]> {
    try {
      const trackView: TrackView = {
        name: 'tracks',
        topFeatured: '1',
        inSection: '1',
        title: sc.getI18n('SOUNDCLOUD_LIST_TITLE_TOP_FEATURED_TRACKS')
      };
      const tracksUri = `${this.uri}/${ViewHelper.constructUriSegmentFromView(trackView, true)}`;
      const page = await ViewHandlerFactory.getHandler(tracksUri).browse();
      const list = page.navigation?.lists?.[0];
      if (list && list.items.length > 0) {
        if (ViewHelper.supportsEnhancedTitles()) {
          list.title = `
          <div style="width: 100%;">
              <div style="padding-bottom: 8px; border-bottom: 1px solid;">
                  ${list.title}
              </div>
          </div>`;
        }
        return [ list ];
      }
      return [];
    }
    catch (error: any) {
      sc.getLogger().error(sc.getErrorMessage('[soundcloud] Failed to get top featured tracks in root view:', error, true));
      return [];
    }
  }

  async #getMixedSelections(): Promise<RenderedList[]> {
    try {
      const selections = await this.getModel(ModelType.Selection).getSelections({ mixed: true });
      const lists = selections.items.reduce<RenderedList[]>((result, selection, index) => {
        if (selection.items.length > 0) {
          result.push(this.#getListFromSelection(selection, index));
        }
        return result;
      }, []);
      return lists;
    }
    catch (error: any) {
      sc.getLogger().error(sc.getErrorMessage('[soundcloud] Failed to get selections in root view:', error, true));
      return [];
    }
  }

  #getListFromSelection(selection: SelectionEntity, index: number): RenderedList {
    const limit = sc.getConfigValue('itemsPerSection');
    const slice = selection.items.slice(0, limit);
    const renderer = this.getRenderer(RendererType.Playlist);
    const listItems = slice.reduce<RenderedListItem[]>((result, item) => {
      const rendered = renderer.renderToListItem(item);
      if (rendered) {
        result.push(rendered);
      }
      return result;
    }, []);
    if (selection.id && limit < selection.items.length) {
      const nextPageRef = this.constructPageRef(limit.toString(), 0);
      if (nextPageRef) {
        const selectionView: SelectionView = {
          name: 'selections',
          selectionId: selection.id,
          pageRef: nextPageRef
        };
        const nextUri = `${this.uri}/${ViewHelper.constructUriSegmentFromView(selectionView)}`;
        listItems.push(this.constructNextPageItem(nextUri));
      }
    }
    let listTitle;
    if (selection.title) {
      if (!ViewHelper.supportsEnhancedTitles()) {
        listTitle = selection.title;
      }
      else if (index === 0) {
        listTitle = `
              <div style="width: 100%;">
                  <div style="padding-bottom: 8px; border-bottom: 1px solid; margin-bottom: 24px;">
                      ${sc.getI18n('SOUNDCLOUD_TRENDING_PLAYLISTS')}
                  </div>
                  <span style="font-size: 16px; color: #bdbdbd;">${selection.title}</span>
              </div>`;
      }
      else {
        listTitle = `<span style="font-size: 16px; color: #bdbdbd;">${selection.title}</span>`;
      }
    }
    else {
      listTitle = sc.getI18n('SOUNDCLOUD_TRENDING_PLAYLISTS');
    }
    return {
      title: listTitle,
      availableListViews: [ 'list', 'grid' ],
      items: listItems
    };
  }
}
