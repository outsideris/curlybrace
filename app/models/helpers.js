"use strict";

module.exports = {
  isEmpty: function(elem) {
    if (!elem) { return true; }
    if (elem.trim && !elem.trim()) { return true; }
    return false;
  }
};