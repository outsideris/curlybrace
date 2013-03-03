// # 공통으로 사용할 헬퍼 메서드 모음
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>

"use strict";

var hat = require('hat')
  , moment = require('moment')
  , logger = require('../../src/conf/config').logger;

// moment의 언어 설정
moment.lang('ko');

module.exports = {
  // 전달한 객체가 빈 객체인지 검사한다
  // 문자열일 경우는 `trim`한 값으로 검사한다.
  isEmpty: function(elem) {
    logger.debug('helpers.isEmpty', {elem: elem});
    if (!elem) { return true; }
    if (elem.trim && !elem.trim()) { return true; }
    return false;
  },
  // uuid를 생성한다.
  generateUUID: function() {
    logger.debug('helpers.generateUUID');
    return hat(32, 16);
  },
  // 시간 포매팅
  getTimeFromNow: function(time) {
    logger.debug('helpers.getTimeFromNow', {time: time});
    return moment(time).fromNow();
  },
  formatDate: function(time) {
    logger.debug('helpers.formatDate', {time: time});
    return moment(time).format('YYYY-MM-DD hh:mm:ss A');
  }
};