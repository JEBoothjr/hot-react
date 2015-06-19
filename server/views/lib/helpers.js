'use strict';

exports.contentFor = function(name, options) {
    if (!this.block) this.block = {};
    this.block[name] = options.fn(this);
    return null;
};
