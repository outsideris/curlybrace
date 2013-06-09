package models

import org.scalatest.FunSpec
import org.scalatest.BeforeAndAfter
import org.scalatest.matchers.ShouldMatchers
import scala.slick.driver.H2Driver.simple._

import java.lang.IllegalArgumentException
import models.users._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 23.
 * Time: 오후 8:32
 */
class QuestionSpec extends FunSpec with BeforeAndAfter with ShouldMatchers {

  implicit var session: Session = _

  val userId = 1
  val questionFixture = Question(_: Int, "질문 제목", "질문 내용", userId)

  before {
    session = Database.forURL("jdbc:h2:mem:curlytest", driver = "org.h2.Driver").createSession()
    (
      Questions.ddl ++
      Tags.ddl ++
      QuestionsToTags.ddl ++
      Users.ddl
    ).create
    Tags.insertAll(
      Tag("Java"),
      Tag("Python"),
      Tag("Scala")
    )
  }

  after {
    session.close()
  }

  describe("add") {
    it("질문을 저장한다") {
      // given
      Questions.add(questionFixture(2))
      // when
      val q = Questions.findById(2)
      // then
      q.get.title should equal (questionFixture(2).title)
      q.get.contents should equal (questionFixture(2).contents)
      q.get.voteUp should equal (0)
      q.get.voteDown should equal (0)
    }
    it("제목이 null 저장되지 않는다") {
      // given
      val fixture = Question(1, null, "질문 내용", 1)
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("제목이 빈값이면 저장되지 않는다") {
      // given
      val fixture = Question(1, "", "질문 내용", 1)
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("제목이 공백이면 저장되지 않는다") {
      // given
      val fixture = Question(1, "   ", "질문 내용", 1)
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("내용이 null 저장되지 않는다") {
      // given
      val fixture = Question(1, "제목", null, 1)
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("내용이 빈값이면 저장되지 않는다") {
      // given
      val fixture = Question(1, "제목", "", 1)
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("내용이 공백이면 저장되지 않는다") {
      // given
      val fixture = Question(1, "제목", "  ", 1)
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
  }

  describe("findById") {
    it("존재하지 않는 질문을 조회하면 None이 된다") {
        // given
        Questions.add(questionFixture(2))
        // when
        val q = Questions.findById(10)
        // then
        q should equal (None)
    }
  }

  describe("addWithTags") {
    it("질문을 태그와 함께 인서트한다") {
      // given
      val id = 3
      Questions.addWithTags(questionFixture(id), List("Java", "Scala"))
      // when
      val q = Questions.findById(id)
      // then
      q.get.title should equal (questionFixture(id).title)
      QuestionsToTags.findByQuestionId(id).size should equal(2)
    }
  }

  describe("findWithAllById") {
    it("질문을 작성자 정보와 태그를 함께 조회한다") {
      // given
      val questionId = 1
      val userId = 1
      Questions.addWithTags(questionFixture(questionId), List("Java", "Scala"))
      Users.add(User(userId, "Outsider"))
      // when
      val q = Questions.findWithAllById((questionId))
      // then
      q.size should equal(1)
      q(0).question.id should equal(questionId)
      q(0).user.id should equal(userId)
      q(0).tags.size should equal(2)
    }
    it("작성자가 여럿인 경우에도 질문을 작성자 정보와 태그를 함께 조회한다") {
      // given
      val questionId = 1
      val userId = 1
      Questions.addWithTags(questionFixture(questionId), List("Java", "Scala"))
      Users.add(User(2, "other"))
      Users.add(User(userId, "Outsider"))
      // when
      val q = Questions.findWithAllById((questionId))
      // then
      q.size should equal(1)
      q(0).question.id should equal(questionId)
      q(0).user.id should equal(userId)
      q(0).tags.size should equal(2)
    }
  }

  describe("upVote") {
    it("기존의 질문에 upVote가 0일 때 증가시킨다") {
      // given
      val questionId = 1
      Questions.add(questionFixture(questionId))
      Questions.findById((questionId)).get.voteUp should equal(0)
      // when
      Questions.upVote(questionId)
      // then
      Questions.findById((questionId)).get.voteUp should equal(1)
    }
    it("기존의 질문에 upVote가 존재할 때 증가시킨다") {
      // given
      val questionId = 1
      Questions.add(questionFixture(questionId))
      Questions.findById((questionId)).get.voteUp should equal(0)
      // when
      Questions.upVote(questionId)
      Questions.upVote(questionId)
      Questions.upVote(questionId)
      Questions.upVote(questionId)
      // then
      Questions.findById((questionId)).get.voteUp should equal(4)
    }
    it("upVote시 point를 지정하면 해당 point를 적용한다") {
      // given
      val questionId = 1
      Questions.add(questionFixture(questionId))
      Questions.upVote(questionId)
      Questions.upVote(questionId)
      Questions.upVote(questionId)
      Questions.findById((questionId)).get.voteUp should equal(3)
      // when
      Questions.upVote(questionId, -1)
      // then
      Questions.findById((questionId)).get.voteUp should equal(2)
    }
  }

  describe("downVote") {
    it("기존의 질문에 downVote가 0일 때 증가시킨다") {
      // given
      val questionId = 1
      Questions.add(questionFixture(questionId))
      Questions.findById((questionId)).get.voteDown should equal(0)
      // when
      Questions.downVote(questionId)
      // then
      Questions.findById((questionId)).get.voteDown should equal(1)
    }
    it("기존의 질문에 downVote가 존재할 때 증가시킨다") {
      // given
      val questionId = 1
      Questions.add(questionFixture(questionId))
      Questions.findById((questionId)).get.voteDown should equal(0)
      // when
      Questions.downVote(questionId)
      Questions.downVote(questionId)
      Questions.downVote(questionId)
      Questions.downVote(questionId)
      // then
      Questions.findById((questionId)).get.voteDown should equal(4)
    }
    it("downVote시 point를 지정하면 해당 point를 적용한다") {
      // given
      val questionId = 1
      Questions.add(questionFixture(questionId))
      Questions.downVote(questionId)
      Questions.downVote(questionId)
      Questions.downVote(questionId)
      Questions.findById((questionId)).get.voteDown should equal(3)
      // when
      Questions.downVote(questionId, -1)
      // then
      Questions.findById((questionId)).get.voteDown should equal(2)
    }
  }

  describe("updateCommentsCount") {
    it("질문의 댓글 갯수를 증가시킨다") {
      // given
      val questionId = 1
      Questions.add(questionFixture(questionId))
      Questions.findById((questionId)).get.commentsCount should equal(0)
      // when
      Questions.updateCommentsCount(questionId)
      Questions.updateCommentsCount(questionId)
      Questions.updateCommentsCount(questionId)
      // then
      Questions.findById((questionId)).get.commentsCount should equal(3)
    }
    it("질문의 댓글 갯수를 감소시킨다") {
      // given
      val questionId = 1
      Questions.add(questionFixture(questionId))
      Questions.updateCommentsCount(questionId)
      Questions.updateCommentsCount(questionId)
      Questions.updateCommentsCount(questionId)
      Questions.findById((questionId)).get.commentsCount should equal(3)
      // when
      Questions.updateCommentsCount(questionId, -1)
      Questions.updateCommentsCount(questionId, -1)
      // then
      Questions.findById((questionId)).get.commentsCount should equal(1)
    }
  }
}
