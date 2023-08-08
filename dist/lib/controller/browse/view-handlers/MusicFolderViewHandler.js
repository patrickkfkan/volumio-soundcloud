"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SoundCloudContext_1 = __importDefault(require("../../../SoundCloudContext"));
const model_1 = require("../../../model");
const ExplodableViewHandler_1 = __importDefault(require("./ExplodableViewHandler"));
const renderers_1 = require("./renderers");
class MusicFolderViewHandler extends ExplodableViewHandler_1.default {
    browse() {
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
    async browseSearch(query) {
        const { combinedSearch, pageRef } = this.currentView;
        const pageToken = pageRef?.pageToken;
        const pageOffset = pageRef?.pageOffset;
        const limit = combinedSearch ? SoundCloudContext_1.default.getConfigValue('combinedSearchResults') : SoundCloudContext_1.default.getConfigValue('itemsPerPage');
        const modelParams = { search: query };
        if (pageToken !== undefined) {
            modelParams.pageToken = pageToken;
        }
        if (pageOffset !== undefined) {
            modelParams.pageOffset = pageOffset;
        }
        modelParams.limit = limit;
        const result = await this.getFolders(modelParams);
        return this.buildPageFromLoopFetchResult(result, this.getFolderRenderer(), this.getFoldersListTitle());
    }
    async browseByUser(userId) {
        const { pageRef, inSection } = this.currentView;
        const pageToken = pageRef?.pageToken;
        const pageOffset = pageRef?.pageOffset;
        const limit = inSection ? SoundCloudContext_1.default.getConfigValue('itemsPerSection') : SoundCloudContext_1.default.getConfigValue('itemsPerPage');
        const modelParams = { userId };
        if (pageToken !== undefined) {
            modelParams.pageToken = pageToken;
        }
        if (pageOffset !== undefined) {
            modelParams.pageOffset = pageOffset;
        }
        modelParams.limit = limit;
        const result = await this.getFolders(modelParams);
        const page = this.buildPageFromLoopFetchResult(result, this.getFolderRenderer(), this.getFoldersListTitle());
        if (!inSection && page.navigation) {
            const userData = await this.getModel(model_1.ModelType.User).getUser(userId);
            if (userData) {
                const header = this.getRenderer(renderers_1.RendererType.User).renderToHeader(userData);
                if (header) {
                    page.navigation.info = header;
                }
            }
        }
        return page;
    }
    async browseFolder(id) {
        const { folder, tracksOffset, tracksLimit } = await this.getFolder(id);
        const renderer = this.getRenderer(renderers_1.RendererType.Track);
        const listItems = folder.tracks.reduce((result, track) => {
            const rendered = renderer.renderToListItem(track);
            if (rendered) {
                result.push(rendered);
            }
            return result;
        }, []);
        if (!SoundCloudContext_1.default.getConfigValue('loadFullPlaylistAlbum') && tracksLimit !== undefined) {
            const nextOffset = (tracksOffset || 0) + tracksLimit;
            if ((folder.trackCount || 0) > nextOffset) {
                const nextPageRef = this.constructPageRef(nextOffset.toString(), 0);
                if (nextPageRef) {
                    listItems.push(this.constructNextPageItem(nextPageRef));
                }
            }
        }
        let title = this.currentView.title || SoundCloudContext_1.default.getI18n('SOUNDCLOUD_LIST_TITLE_TRACKS');
        if (folder.permalink) {
            title = this.addLinkToListTitle(title, folder.permalink, this.getVisitLinkTitle());
        }
        const list = {
            title,
            availableListViews: ['list', 'grid'],
            items: listItems
        };
        return {
            navigation: {
                prev: { uri: this.constructPrevUri() },
                info: this.getFolderRenderer().renderToHeader(folder),
                lists: [list]
            }
        };
    }
    async getTracksOnExplode() {
        const id = this.getFolderIdFromView();
        if (id === undefined || id === null) {
            throw Error('Id of target not specified');
        }
        const { folder } = await this.getFolder(id);
        const fromParamName = this.getExplodedTrackInfoFromParamName();
        const trackInfos = folder?.tracks.map((track) => {
            const info = { ...track };
            Reflect.set(info, fromParamName, id);
            return info;
        }) || [];
        return trackInfos;
    }
}
exports.default = MusicFolderViewHandler;
//# sourceMappingURL=MusicFolderViewHandler.js.map