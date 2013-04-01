// # 헬퍼 클래스 테스트
//
// Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
// Licensed under the MIT license.
// <http://outsider.mit-license.org/>
/*global describe, it */
"use strict";

var should = require('should'),
    helpers = require('../../src/models/helpers'),
    logger = require('../../src/conf/config').logger;

describe('helpers >', function() {
  describe('isEmpty >', function() {
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
  describe('generateUUID >', function() {
    it('타임스탬프 기반으로 UUID를 획득한다', function() {
      // given
      // when
      var caseA = helpers.generateUUID();
      var caseB = helpers.generateUUID();

      // then
      caseA.should.not.equal(caseB);
    });
  });
  describe('logger >', function() {
    it('로깅 테스트 1', function() {
      var err = new Error('questions collection should not be null.');
      logger.error('Error Occured during querying MongoDB', {error: err.stack});
    });
    it('로깅 테스트 2', function() {
      var err = new Error('questions collection should not be null.');
      logger.error('Error Occured during querying MongoDB', {error: err});
    });
  });
  describe('time conversion >', function() {
    it('현재부터 어느정도 전인지 문자로 나타낼 수 있어야 한다', function() {
      // given
      var time = new Date();
      time.setDate(time.getDate() - 2);

      // when
      var formattedTime = helpers.getTimeFromNow(time);

      // then
      formattedTime.should.equal('2일 전');
    });
    it('시간을 휴먼리더블하게 포매팅한다', function() {
      // given
      var time = new Date('2013-03-04 11:00:00');

      // when
      var formattedTime = helpers.formatDate(time);

      // then
      formattedTime.should.equal('2013-03-04 11:00:00 오전');
    });
  });
  describe('validateNumericType >', function() {
    it('인자가 숫자타입이면 true를 반환한다', function() {
      // given
      var id = 1423;

      // when
      var result = helpers.validateNumericType({id: id}, function() {});

      // then
      result.should.be.ok;
    });
    it('인자를 숫자타입으로 변환할 수 있으면 true를 반환한다', function() {
      // given
      var id = '1423';

      // when
      var result = helpers.validateNumericType({id: id}, function() {});

      // then
      result.should.be.ok;
    });
    it('인자를 숫자타입으로 변환할 수 없으면 콜백으로 오류를 던진다', function() {
      // given
      var id = 'test';

      // when
      var result = helpers.validateNumericType({id: id}, function(err) {
        // then
        err.toString().should.equal('Error: id must be number or convertable to number');
      });
    });
  });
  describe('validateEmpty >', function() {
    it('null을 전달하면 오류를 콜백으로 반환한다', function(){
      // given
      var str = null;
      // when
      var result = helpers.validateNotEmpty(str, function(err) {
        // then
        should.exist(err);
        err.toString().should.equal('Error: str shoule be exist');
      });
    });
  });
});

