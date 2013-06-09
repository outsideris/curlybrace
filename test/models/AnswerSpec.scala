package models

import org.scalatest.FunSpec
import org.scalatest.BeforeAndAfter
import org.scalatest.matchers.ShouldMatchers
import scala.slick.driver.H2Driver.simple._

import java.lang.IllegalArgumentException

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 30.
 * Time: 오후 10:50
 */
class AnswerSpec extends FunSpec with BeforeAndAfter with ShouldMatchers {

  implicit var session: Session = _

  val questionId = 2
  val userId = 1
  val answerFixture = Answer(_: Int, questionId, "답변 내용", userId)

  before {
    session = Database.forURL("jdbc:h2:mem:curlytest", driver = "org.h2.Driver").createSession()
    (
      Questions.ddl ++
      Answers.ddl
    ).create
    Questions.add( Question(questionId, "질문 제목", "질문 내용", userId) )
  }

  after {
    session.close()
  }

  describe("add") {
    it("답변을 저장한다") {
      // given
      val id = 2
      Answers.add(answerFixture(id))
      // when
      val a = (for { answer <- Answers if answer.id === id } yield answer).list
      // then
      a.size should equal(1)
    }
    it("내용이 null 저장되지 않는다") {
      // given
      val fixture = Answer(1, 2, null, 1)
      // then
      intercept[IllegalArgumentException] {
        // when
        Answers.add(fixture)
      }
    }
    it("내용이 빈값이면 저장되지 않는다") {
      // given
      val fixture = Answer(1, 2, "", 1)
      // then
      intercept[IllegalArgumentException] {
        // when
        Answers.add(fixture)
      }
    }
    it("내용이 공백이면 저장되지 않는다") {
      // given
      val fixture = Answer(1, 2, "  ", 1)
      // then
      intercept[IllegalArgumentException] {
        // when
        Answers.add(fixture)
      }
    }
    it("답변을 저장시 질문의 답변갯수를 증가시킨다") {
      // given
      val id = 2
      Questions.findById((questionId)).get.answerCount should equal(0)
      // when
      Answers.add(answerFixture(id))
      // then
      Questions.findById((questionId)).get.answerCount should equal(1)
    }
  }

  describe("findByQuestionId") {
    it("질문 ID로 답변을 조회한다") {
      // given
      Answers.add(answerFixture(2))
      Answers.add(answerFixture(3))
      Answers.add(answerFixture(6))
      // when
      val a = Answers.findByQuestionId(2)
      // then
      a.size should equal(3)
    }
  }

  describe("upVote") {
    it("기존의 답변에 upVote가 0일 때 증가시킨다") {
      // given
      val answerId = 1
      Answers.add(answerFixture(answerId))
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteUp should equal(0)
      // when
      Answers.upVote(answerId)
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteUp should equal(1)
    }
    it("기존의 답변에 upVote가 존재할 때 증가시킨다") {
      // given
      val answerId = 1
      Answers.add(answerFixture(answerId))
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteUp should equal(0)
      // when
      Answers.upVote(answerId)
      Answers.upVote(answerId)
      Answers.upVote(answerId)
      Answers.upVote(answerId)
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteUp should equal(4)
    }
    it("답변에 upVote시 point를 지정하면 해당 point를 적용한다") {
      // given
      val answerId = 1
      Answers.add(answerFixture(answerId))
      Answers.upVote(answerId)
      Answers.upVote(answerId)
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteUp should equal(2)
      // when
      Answers.upVote(answerId, -1)
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteUp should equal(1)
    }
  }

  describe("downVote") {
    it("기존의 답변에 downVote가 0일 때 증가시킨다") {
      // given
      val answerId = 1
      Answers.add(answerFixture(answerId))
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteDown should equal(0)
      // when
      Answers.downVote(answerId)
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteDown should equal(1)
    }
    it("기존의 답변에 downVote가 존재할 때 증가시킨다") {
      // given
      val answerId = 1
      Answers.add(answerFixture(answerId))
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteDown should equal(0)
      // when
      Answers.downVote(answerId)
      Answers.downVote(answerId)
      Answers.downVote(answerId)
      Answers.downVote(answerId)
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteDown should equal(4)
    }
    it("답변에 downVote시 point를 지정하면 해당 point를 적용한다") {
      // given
      val answerId = 1
      Answers.add(answerFixture(answerId))
      Answers.downVote(answerId)
      Answers.downVote(answerId)
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteDown should equal(2)
      // when
      Answers.downVote(answerId, -1)
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.voteDown should equal(1)
    }
  }

  describe("updateCommentsCount") {
    it("답변의 댓글 갯수를 증가시킨다") {
      // given
      val answerId = 1
      Answers.add(answerFixture(answerId))
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.commentsCount should equal(0)
      // when
      Answers.updateCommentsCount(answerId)
      Answers.updateCommentsCount(answerId)
      Answers.updateCommentsCount(answerId)
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.commentsCount should equal(3)
    }
    it("답변의 댓글 갯수를 감소시킨다") {
      // given
      val answerId = 1
      Answers.add(answerFixture(answerId))
      Answers.updateCommentsCount(answerId)
      Answers.updateCommentsCount(answerId)
      Answers.updateCommentsCount(answerId)
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.commentsCount should equal(3)
      // when
      Answers.updateCommentsCount(answerId, -1)
      Answers.updateCommentsCount(answerId, -1)
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.commentsCount should equal(1)
    }
  }
}
