const BaseEntity = require('./base');
const { EOL } = require('os');

class Selection extends BaseEntity {

    getId() {
        return this.getJSON('id');
    }

    getType() {
        return 'selection';
    }

    getTitle() {
        return this.getJSON('title');
    }

    getNextUri() {
        return this.getJSON('items').next_href;
    }

    getItems() {
        let self = this;
        return self.lazyGet('items', () => {
            let buildCollection = require('../collections').build;
            return buildCollection(self.getJSON('items'), self.getClient()).getItems();
        });
    }

    toSnippet(indent = '') {
        let snippet = indent +
            `Type: ${this.getType()}${EOL}` + indent +
            `Id: ${this.getId()}${EOL}` + indent + 
            `Title: ${this.getTitle()}${EOL}` + indent +
            `Items: ${EOL}`;
        this.getItems().forEach( (item, index) => {
            snippet += indent + '  ' + `${index}:${EOL}`;
            snippet += item.toSnippet(indent + '    ');
        });
        return snippet;
    }
}

module.exports = Selection;