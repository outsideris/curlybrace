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
 * Date: 13. 5. 23.
 * Time: 오후 8:32
 */
class QuestionSpec extends FunSpec with BeforeAndAfter with ShouldMatchers {

  implicit var session: Session = _

  val questionFixture = Question(
    _: Int,
    "질문 제목",
    "질문 내용"
  )

  before {
    session = Database.forURL("jdbc:h2:mem:curlytest", driver = "org.h2.Driver").createSession()
    (
      Questions.ddl ++
      Tags.ddl ++
      QuestionsToTags.ddl
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
      q.get.voteup should equal (0)
      q.get.votedown should equal (0)
    }
    it("제목이 null 저장되지 않는다") {
      // given
      val fixture = Question(1, null, "질문 내용")
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("제목이 빈값이면 저장되지 않는다") {
      // given
      val fixture = Question(1, "", "질문 내용")
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("제목이 공백이면 저장되지 않는다") {
      // given
      val fixture = Question(1, "   ", "질문 내용")
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("내용이 null 저장되지 않는다") {
      // given
      val fixture = Question(1, "제목", null)
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("내용이 빈값이면 저장되지 않는다") {
      // given
      val fixture = Question(1, "제목", "")
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("내용이 공백이면 저장되지 않는다") {
      // given
      val fixture = Question(1, "제목", "  ")
      // then
      intercept[IllegalArgumentException] {
        // when
        Questions.add(fixture)
      }
    }
    it("태그를 함께 저장한다") {

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
}
