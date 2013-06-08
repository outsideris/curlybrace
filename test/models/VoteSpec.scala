package models

import org.scalatest.FunSpec
import org.scalatest.BeforeAndAfter
import org.scalatest.matchers.ShouldMatchers
import scala.slick.driver.H2Driver.simple._
import helpers.TypeMapper._
import helpers.VoteType._
import helpers.PostType._
import org.h2.jdbc.JdbcSQLException


/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 6. 8.
 * Time: 오후 7:36
 */
class VoteSpec extends FunSpec with BeforeAndAfter with ShouldMatchers {

  implicit var session: Session = _

  val questionId = 2
  val userId = 1
  val questionFixture = Question(_: Int, "질문 제목", "질문 내용", userId)
  val answerFixture = Answer(_: Int, questionId, "답변 내용", userId)

  before {
    session = Database.forURL("jdbc:h2:mem:curlytest", driver = "org.h2.Driver").createSession()
    Votes.ddl.create
  }

  after {
    session.close()
  }

  describe("add") {
    it("질문의 추천을 저장한다") {
      // given
      val questionId = 2
      // when
      Votes.add(Vote(questionId, QuestionType, userId, UpVote))
      // then
      val result = (for {
        vote <- Votes
        if vote.targetId === questionId
        if vote.targetType === QuestionType
      } yield vote).list
      result.size should equal(1)
      result(0).targetId should equal(questionId)
      result(0).targetType should equal(QuestionType)
      result(0).voteType should equal(UpVote)
    }
    it("질문의 비추천을 저장한다") {
      // given
      val questionId = 2
      // when
      Votes.add(Vote(questionId, QuestionType, userId, DownVote))
      // then
      val result = (for {
        vote <- Votes
        if vote.targetId === questionId
        if vote.targetType === QuestionType
      } yield vote).list
      result.size should equal(1)
      result(0).targetId should equal(questionId)
      result(0).targetType should equal(QuestionType)
      result(0).voteType should equal(DownVote)
    }
    it("답변의 추천을 저장한다") {
      // given
      val answerId = 2
      // when
      Votes.add(Vote(answerId, AnswerType, userId, UpVote))
      // then
      val result = (for {
        vote <- Votes
        if vote.targetId === answerId
        if vote.targetType === AnswerType
      } yield vote).list
      result.size should equal(1)
      result(0).targetId should equal(answerId)
      result(0).targetType should equal(AnswerType)
      result(0).voteType should equal(UpVote)
    }
    it("한 질문에 같은 사용자가 여러번 추천할 수 없다") {
      // given
      val questionId = 2
      Votes.add(Vote(questionId, QuestionType, userId, UpVote))
      // then
      intercept[JdbcSQLException] {
        // when
        Votes.add(Vote(questionId, QuestionType, userId, UpVote))
      }
    }
    it("같은 아이디의 질문과 답변에 추천할 수 있다") {
      // given
      val questionId = 2
      val answerId = 2
      // when
      Votes.add(Vote(questionId, QuestionType, userId, UpVote))
      Votes.add(Vote(answerId, AnswerType, userId, UpVote))
      // then
      val questionVote = (for {
        vote <- Votes
        if vote.targetId === questionId
        if vote.targetType === QuestionType
      } yield vote).list
      questionVote.size should equal(1)

      val answerVote = (for {
        vote <- Votes
        if vote.targetId === answerId
        if vote.targetType === AnswerType
      } yield vote).list
      answerVote.size should equal(1)
    }
  }

  describe("findByQuestionId") {
    it("질문의 추천내역을 가져온다") {
      // given
      val questionId = 2
      val size = 5
      for (
        uid <- 1 to size
      ) Votes.add(Vote(questionId, QuestionType, uid, UpVote))
      Votes.add(Vote(3, QuestionType, 1, UpVote))
      // when
      val votes = Votes.findByQuestionId(questionId)
      // then
      votes.size should equal(size)
    }
  }

  describe("findByAnswerId") {
    it("답변의 추천내역을 가져온다") {
      // given
      val answerId = 2
      val size = 5
      for (
        uid <- 1 to size
      ) Votes.add(Vote(answerId, AnswerType, uid, UpVote))
      Votes.add(Vote(3, AnswerType, 1, UpVote))
      // when
      val votes = Votes.findByAnswerId(answerId)
      // then
      votes.size should equal(size)
    }  }
}
