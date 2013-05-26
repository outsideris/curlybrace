package models

import org.specs2.mutable._
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
class QuestionSpec extends Specification {

  val questionFixture = Question(
    _: Option[Int],
    "질문 제목",
    "질문 내용"
  )

  "Question" should {
    "저장할 수 있다" in {
      Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver") withSession {
        // given
        Questions.ddl.create
        Questions.add(questionFixture(Some(2)))
        // when
        val q = Questions.findById(Some(2))
        // then
        q.get.title must beEqualTo(questionFixture(Some(2)).title)
        q.get.contents must beEqualTo(questionFixture(Some(2)).contents)
        q.get.voteup must beEqualTo(0)
        q.get.votedown must beEqualTo(0)
      }
    }
    "없는 질문은 None이 된다" in {
      Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver") withSession {
        // given
        Questions.ddl.create
        Questions.add(questionFixture(Some(2)))
        // when
        val q = Questions.findById(Some(10))
        // then
        q must beEqualTo(None)
      }
    }
  }

}
