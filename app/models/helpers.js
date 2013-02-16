// # 공통으로 사용할 헬퍼 메서드 모음
"use strict";

module.exports = {
  // 전달한 객체가 빈 객체인지 검사한다
  // 문자열일 경우는 `trim`한 값으로 검사한다.
  isEmpty: function(elem) {
    if (!elem) { return true; }
    if (elem.trim && !elem.trim()) { return true; }
    return false;
  }
};