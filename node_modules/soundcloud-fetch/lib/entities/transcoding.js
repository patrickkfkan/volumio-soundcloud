const BaseEntity = require('./base');

class MediaTranscoding extends BaseEntity {

    getType() {
        return 'media-transcoding';
    }

    getUrl() {
        return this.getJSON('url');
    }

    getPreset() {
        return this.getJSON('preset');
    }

    getDuration() {
        return this.getJSON('duration');
    }

    isSnipped() {
        return this.getJSON('snipped');
    }

    getProtocol() {
        let format = this.getJSON('format');
        if (format) {
            return format.protocol;
        }
        return null;
    }

    getMimeType() {
        let format = this.getJSON('format');
        if (format) {
            return format.mime_type;
        }
        return null;
    }

    getQuality() {
        return this.getJSON('quality');
    }
}

module.exports = MediaTranscoding;