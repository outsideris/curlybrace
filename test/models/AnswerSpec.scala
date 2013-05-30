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

  val answerFixture = Answer(
    _: Int,
    2,
    "답변 내용",
    1
  )

  before {
    session = Database.forURL("jdbc:h2:mem:curlytest", driver = "org.h2.Driver").createSession()
    Answers.ddl.create
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
}
