package models

import org.scalatest.FunSpec
import org.scalatest.BeforeAndAfter
import org.scalatest.matchers.ShouldMatchers
import scala.slick.driver.H2Driver.simple._
import helpers.TypeMapper._
import helpers.PostType._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 6. 9.
 * Time: 오후 4:49
 */
class CommentSpec extends FunSpec with BeforeAndAfter with ShouldMatchers {

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
      Comments.ddl
    ).create
    Questions.add(questionFixture(questionId))
    Answers.add(answerFixture(answerId))
  }

  after {
    (
      Questions.ddl ++
      Answers.ddl ++
      Comments.ddl
    ).drop
    session.close()
  }

  describe("add") {
    it("질문에 댓글을 저장한다") {
      // given
      Answers.add(answerFixture(2))
      // when
      Comments.add( Comment(1, "댓글 내용", userId, questionId, QuestionType) )
      // then
      val result = (for {
        c <- Comments
        if c.parentId === questionId
        if c.parentType === QuestionType
      } yield c).list
      result.size should equal(1)
      result(0).contents should equal("댓글 내용")
    }
    it("답변에 댓글을 저장한다") {
      // given
      val answerId = 2
      Answers.add(answerFixture(answerId))
      // when
      Comments.add( Comment(1, "댓글 내용", userId, answerId, AnswerType) )
      // then
      val result = (for {
        c <- Comments
        if c.parentId === answerId
        if c.parentType === AnswerType
      } yield c).list
      result.size should equal(1)
      result(0).contents should equal("댓글 내용")
    }
    it("질문에 댓글을 저장할 때 질문의 댓글갯수를 증가시킨다") {
      // given
      Questions.findById(questionId).get.commentsCount should equal(0)
      // when
      Comments.add( Comment(1, "댓글 내용", userId, questionId, QuestionType) )
      Comments.add( Comment(2, "댓글 내용", userId, questionId, QuestionType) )
      // then
      Questions.findById(questionId).get.commentsCount should equal(2)
    }
    it("답변에 댓글을 저장할 때 답변의 댓글갯수를 증가시킨다") {
      // given
      val answerId = 2
      Answers.add(answerFixture(answerId))
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.commentsCount should equal(0)
      // when
      Comments.add( Comment(1, "댓글 내용", userId, answerId, AnswerType) )
      Comments.add( Comment(2, "댓글 내용", userId, answerId, AnswerType) )
      // then
      (for {a <- Answers if a.id === answerId} yield a).firstOption.get.commentsCount should equal(2)
    }
  }

  describe("findByParent") {
    it("질문에 대한 댓글을 조회한다") {
      // given
      Comments.add( Comment(1, "댓글 내용", userId, questionId, QuestionType) )
      Comments.add( Comment(2, "댓글 내용", userId, questionId, QuestionType) )
      Comments.add( Comment(3, "댓글 내용", userId, questionId, QuestionType) )
      Questions.add(questionFixture(3))
      Comments.add( Comment(4, "댓글 내용", userId, 3, QuestionType) )
      // when
      val list = Comments.findByParent(questionId, QuestionType)
      // then
      list.size should equal(3)
    }
    it("답변에 대한 댓글을 조회한다") {
      // given
      val answerId = 2
      Answers.add(answerFixture(answerId))
      Comments.add( Comment(1, "댓글 내용", userId, answerId, AnswerType) )
      Comments.add( Comment(2, "댓글 내용", userId, answerId, AnswerType) )
      Comments.add( Comment(3, "댓글 내용", userId, answerId, AnswerType) )
      Answers.add(answerFixture(4))
      Comments.add( Comment(4, "댓글 내용", userId, 4, AnswerType) )
      // when
      val list = Comments.findByParent(answerId, AnswerType)
      // then
      list.size should equal(3)
    }
  }
}
