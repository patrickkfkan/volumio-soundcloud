const Playlist = require('./playlist');

class Album extends Playlist {

    getType() {
        return 'album';
    }

    getSharingInfo() {
        let self = this;
        return self.lazyGet('sharing', () => {
            return {
                shareability: self.getJSON('sharing'),
                embeddableBy: self.getJSON('embeddable_by'),
                secretToken: self.getJSON('secret_token')
            };
        });
    }

    getDates() {
        let self = this;
        return self.lazyGet('dates', () => {
            return {
                created: self.getJSON('created_at'),
                published: self.getJSON('published_at'),
                modified: self.getJSON('last_modified'),
                display: self.getJSON('display_date'),
                release: self.getJSON('release_date')
            };
        });
    }

    getGenre() {
        return this.getJSON('genre');
    }

    getLabel() {
        return this.getJSON('label_name');
    }

    getLicense() {
        return this.getJSON('license');
    }

    getPurchaseInfo() {
        let self = this;
        return self.lazyGet('purchase', () => {
            return {
                title: self.getJSON('purchase_title'),
                url: self.getJSON('purchase_url'),
            };
        });
    }

    getTags() {
        return this.getJSON('tag_list');
    }

}

module.exports = Album;