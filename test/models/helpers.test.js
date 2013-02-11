"use strict";

var helpers = require('../../app/models/helpers');

describe('helpers', function() {
  describe('isEmpty', function() {
    it('없는 객체는 true이다', function() {
      // given
      var obj = {};
      // when
      var result = helpers.isEmpty(obj.test);
      // then
      result.should.be.true;
    });
    it('빈 문자열은 true이다', function() {
      // given
      var str = "";
      // when
      var result = helpers.isEmpty(str);
      // then
      result.should.be.true;
    });
    it('공백 문자열은 true이다', function() {
      // given
      var str = "  ";
      // when
      var result = helpers.isEmpty(str);
      // then
      result.should.be.true;
    });
    it('존재하는 객체는 false이다', function() {
      // given
      var obj = {test: 1};
      // when
      var result = helpers.isEmpty(obj);
      // then
      result.should.be.false;
    });
    it('문자열이 있으면 false이다', function() {
      // given
      var str = " test ";
      // when
      var result = helpers.isEmpty(str);
      // then
      result.should.be.false;
    });
    it('primitive 타입은 false이다', function() {
      // given
      var t = 1;
      // when
      var result = helpers.isEmpty(t);
      // then
      result.should.be.false;
    });
  });
});

