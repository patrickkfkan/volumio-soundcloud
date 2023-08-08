import { Album, EntityType, Playlist, Selection, SystemPlaylist, Track, User } from 'soundcloud-fetch';
import UserEntity from '../entities/UserEntity';
import PlaylistEntity from '../entities/PlaylistEntity';
import TrackEntity from '../entities/TrackEntity';
import AlbumEntity from '../entities/AlbumEntity';
import { ArtworkImageUrls, AvatarImageUrls } from 'soundcloud-fetch/dist/mjs/lib/entities/Entity';
import SelectionEntity from '../entities/SelectionEntity';

export default class Mapper {

  static mapUser(data: User) {
    const { id, names, location, permalink } = data;
    let locationFull = '';
    if (location?.city) {
      locationFull = location.city;
      if (location.country) {
        locationFull += `, ${location.country}`;
      }
    }

    const result: UserEntity = {
      id,
      username: names?.username,
      fullname: names?.full,
      thumbnail: this.#getThumbnail(data),
      permalink: permalink?.full,
      location: locationFull
    };

    return result;
  }

  static mapPlaylist(data: Playlist | SystemPlaylist) {
    const { id, permalink, user, trackCount } = data;
    let title, description;
    let type: 'playlist' | 'system-playlist';

    if (data instanceof SystemPlaylist) {
      title = (data as SystemPlaylist).texts?.title?.full;
      description = (data as SystemPlaylist).texts?.description?.full;
      type = 'system-playlist';
    }
    else {
      title = data.texts?.title;
      description = data.texts?.description;
      type = 'playlist';
    }

    const result: PlaylistEntity = {
      type,
      id,
      title,
      description,
      thumbnail: this.#getThumbnail(data),
      permalink: permalink?.full,
      user: user ? this.mapUser(user) : null,
      tracks: [],
      trackCount: trackCount
    };

    return result;
  }

  static mapTrack(data: Track) {
    const { id, texts, publisher, mediaInfo, user } = data;
    const album = publisher?.albumTitle || publisher?.releaseTitle || null;
    const playableState =
      data.isBlocked ? 'blocked' :
        data.isSnipped ? 'snipped' :
          'allowed';
    const transcodings: TrackEntity['transcodings'] = mediaInfo?.transcodings?.map((t) => ({
      url: t.url,
      protocol: t.protocol,
      mimeType: t.mimeType
    })) || [];

    const result: TrackEntity = {
      type: 'track',
      id,
      title: texts?.title,
      album,
      thumbnail: this.#getThumbnail(data),
      playableState,
      transcodings,
      user: user ? this.mapUser(user) : null
    };

    return result;
  }

  static mapAlbum(data: Album) {
    const { id, permalink, user, trackCount } = data;
    const title = data.texts?.title;
    const description = data.texts?.description;

    const result: AlbumEntity = {
      id,
      type: 'album',
      title,
      description,
      thumbnail: this.#getThumbnail(data),
      permalink: permalink?.full,
      user: user ? this.mapUser(user) : null,
      tracks: [],
      trackCount
    };

    return result;
  }

  static mapSelection(data: Selection) {
    const items = data.items.reduce<PlaylistEntity[]>((result, item) => {
      if (item instanceof Playlist || item instanceof SystemPlaylist) {
        result.push(this.mapPlaylist(item));
      }
      return result;
    }, []);

    const result: SelectionEntity = {
      type: 'selection',
      id: data.id,
      title: data.title,
      items
    };

    return result;
  }

  static #getThumbnail(data: EntityType): string | null {
    let artwork: ArtworkImageUrls | AvatarImageUrls | null | undefined;
    if (data instanceof User) {
      artwork = data.avatar;
    }
    else if (data instanceof SystemPlaylist) {
      artwork = data.artwork?.original || data.artwork?.calculated;
    }
    else if (data instanceof Playlist || data instanceof Track) {
      artwork = data.artwork;
    }
    else {
      artwork = null;
    }

    if (artwork) {
      return artwork.t500x500;
    }

    if (!artwork && (
      data instanceof Track || data instanceof Playlist ||
      data instanceof SystemPlaylist || data instanceof Album) && data.user) {
      return this.#getThumbnail(data.user);
    }

    return null;
  }
}
