package models

import org.scalatest.FunSpec
import org.scalatest.BeforeAndAfter
import org.scalatest.matchers.ShouldMatchers
import scala.slick.driver.H2Driver.simple._

import Database.threadLocalSession

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

  val questionFixture = Question(
    _: Option[Int],
    "질문 제목",
    "질문 내용"
  )

  describe("add") {
    it("질문을 저장한다") {
      Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver") withSession {
        // given
        Questions.ddl.create
        Questions.add(questionFixture(Some(2)))
        // when
        val q = Questions.findById(Some(2))
        // then
        q.get.title should equal (questionFixture(Some(2)).title)
        q.get.contents should equal (questionFixture(Some(2)).contents)
        q.get.voteup should equal (0)
        q.get.votedown should equal (0)
      }
    }
  }

  describe("findById") {
    it("존재하지 않는 질문을 조회하면 None이 된다") {
      Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver") withSession {
        // given
        Questions.ddl.create
        Questions.add(questionFixture(Some(2)))
        // when
        val q = Questions.findById(Some(10))
        // then
        q should equal (None)
      }
    }
  }
}
