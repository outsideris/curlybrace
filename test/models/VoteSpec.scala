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
  val answerId = 3
  val questionFixture = Question(_: Int, "질문 제목", "질문 내용", userId)
  val answerFixture = Answer(_: Int, questionId, "답변 내용", userId)

  before {
    session = Database.forURL("jdbc:h2:mem:curlytest", driver = "org.h2.Driver").createSession()
    (
      Questions.ddl ++
      Answers.ddl ++
      Votes.ddl
    ).create
  }

  after {
    session.close()
  }

  describe("add") {
    it("질문의 추천을 저장한다") {
      // given
      Questions.add(questionFixture(questionId))
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
      Questions.add(questionFixture(questionId))
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
      Questions.add(questionFixture(questionId))
      Answers.add(answerFixture(answerId))
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
      Questions.add(questionFixture(questionId))
      Votes.add(Vote(questionId, QuestionType, userId, UpVote))
      // then
      intercept[JdbcSQLException] {
        // when
        Votes.add(Vote(questionId, QuestionType, userId, UpVote))
      }
    }
    it("같은 아이디의 질문과 답변에 추천할 수 있다") {
      // given
      Questions.add(questionFixture(questionId))
      Answers.add(answerFixture(answerId))
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
    it("질문에 upVote시 질문의 upVote수를 증가시킨다") {
      // given
      Questions.add(questionFixture(questionId))
      (for {q <- Questions if q.id === questionId} yield q).firstOption.get.voteUp should equal(0)
      // when
      Votes.add( Vote(questionId, QuestionType, userId, UpVote) )
      // then
      (for {q <- Questions if q.id === questionId} yield q).firstOption.get.voteUp should equal(1)
    }
    it("질문에 downVote시 질문의 downVote수를 증가시킨다") {
      // given
      Questions.add(questionFixture(questionId))
      (for {q <- Questions if q.id === questionId} yield q).firstOption.get.voteDown should equal(0)
      // when
      Votes.add( Vote(questionId, QuestionType, userId, DownVote) )
      // then
      (for {q <- Questions if q.id === questionId} yield q).firstOption.get.voteDown should equal(1)
    }
    it("답변에 upVote시 답변의 upVote수를 증가시킨다") {
      // given
      Questions.add(questionFixture(questionId))
      Answers.add(answerFixture(answerId))
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteUp should equal(0)
      // when
      Votes.add( Vote(answerId, AnswerType, userId, UpVote) )
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteUp should equal(1)
    }
    it("답변에 downVote시 답변의 downVote수를 증가시킨다") {
      // given
      Questions.add(questionFixture(questionId))
      Answers.add(answerFixture(answerId))
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteDown should equal(0)
      // when
      Votes.add( Vote(answerId, AnswerType, userId, DownVote) )
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteDown should equal(1)
    }
  }

  describe("findByQuestionId") {
    it("질문의 추천내역을 가져온다") {
      // given
      val size = 5
      Questions.add(questionFixture(questionId))
      Questions.add(questionFixture(3))
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
      Questions.add(questionFixture(questionId))
      Answers.add(answerFixture(answerId))
      Answers.add(answerFixture(3))
      for (
        uid <- 1 to size
      ) Votes.add(Vote(answerId, AnswerType, uid, UpVote))
      Votes.add(Vote(3, AnswerType, 1, UpVote))
      // when
      val votes = Votes.findByAnswerId(answerId)
      // then
      votes.size should equal(size)
    }
  }

  describe("remove") {
    it("질문에 upVote취소시 질문의 upVote수를 감소시킨다") {
      // given
      Questions.add(questionFixture(questionId))
      Votes.add( Vote(questionId, QuestionType, 1, UpVote) )
      Votes.add( Vote(questionId, QuestionType, 2, UpVote) )
      (for {q <- Questions if q.id === questionId} yield q).firstOption.get.voteUp should equal(2)
      // when
      Votes.remove( Vote(questionId, QuestionType, 1, UpVote) )
      // then
      (for {q <- Questions if q.id === questionId} yield q).firstOption.get.voteUp should equal(1)
    }
    it("질문에 downVote취소시 질문의 downVote수를 감소시킨다") {
      // given
      Questions.add(questionFixture(questionId))
      Votes.add( Vote(questionId, QuestionType, 1, DownVote) )
      Votes.add( Vote(questionId, QuestionType, 2, DownVote) )
      (for {q <- Questions if q.id === questionId} yield q).firstOption.get.voteDown should equal(2)
      // when
      Votes.remove( Vote(questionId, QuestionType, 1, DownVote) )
      // then
      (for {q <- Questions if q.id === questionId} yield q).firstOption.get.voteDown should equal(1)
    }
    it("답변에 upVote취소시 답변의 upVote수를 감소시킨다") {
      // given
      Questions.add(questionFixture(questionId))
      Answers.add(answerFixture(answerId))
      Votes.add( Vote(answerId, AnswerType, 1, UpVote) )
      Votes.add( Vote(answerId, AnswerType, 2, UpVote) )
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteUp should equal(2)
      // when
      Votes.remove( Vote(answerId, AnswerType, 1, UpVote) )
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteUp should equal(1)
    }
    it("답변에 downVote취소시 답변의 downVote수를 감소시킨다") {
      // given
      Questions.add(questionFixture(questionId))
      Answers.add(answerFixture(answerId))
      Votes.add( Vote(answerId, AnswerType, 1, DownVote) )
      Votes.add( Vote(answerId, AnswerType, 2, DownVote) )
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteDown should equal(2)
      // when
      Votes.remove( Vote(answerId, AnswerType, 2, DownVote) )
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteDown should equal(1)
    }
  }
}
