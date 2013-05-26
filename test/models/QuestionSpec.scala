package models

import org.scalatest.FunSpec
import org.scalatest.BeforeAndAfter
import org.scalatest.matchers.ShouldMatchers
import scala.slick.driver.H2Driver.simple._

import Database.threadLocalSession
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

  val questionFixture = Question(
    _: Option[Int],
    "질문 제목",
    "질문 내용"
  )

//  before {
//  }
//
//  after {
//  }

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
    it("제목이 null 저장되지 않는다") {
      Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver") withSession {
        // given
        val fixture = Question(Some(1), null, "질문 내용")
        Questions.ddl.create
        // then
        intercept[IllegalArgumentException] {
          // when
          Questions.add(fixture)
        }
      }
    }
    it("제목이 빈값이면 저장되지 않는다") {
      Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver") withSession {
        // given
        val fixture = Question(Some(1), "", "질문 내용")
        Questions.ddl.create
        // then
        intercept[IllegalArgumentException] {
          // when
          Questions.add(fixture)
        }
      }
    }
    it("제목이 공백이면 저장되지 않는다") {
      Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver") withSession {
        // given
        val fixture = Question(Some(1), "   ", "질문 내용")
        Questions.ddl.create
        // then
        intercept[IllegalArgumentException] {
          // when
          Questions.add(fixture)
        }
      }
    }
    it("내용이 null 저장되지 않는다") {
      Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver") withSession {
        // given
        val fixture = Question(Some(1), "제목", null)
        Questions.ddl.create
        // then
        intercept[IllegalArgumentException] {
          // when
          Questions.add(fixture)
        }
      }
    }
    it("내용이 빈값이면 저장되지 않는다") {
      Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver") withSession {
        // given
        val fixture = Question(Some(1), "제목", "")
        Questions.ddl.create
        // then
        intercept[IllegalArgumentException] {
          // when
          Questions.add(fixture)
        }
      }
    }
    it("내용이 공백이면 저장되지 않는다") {
      Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver") withSession {
        // given
        val fixture = Question(Some(1), "제목", "  ")
        Questions.ddl.create
        // then
        intercept[IllegalArgumentException] {
          // when
          Questions.add(fixture)
        }
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
