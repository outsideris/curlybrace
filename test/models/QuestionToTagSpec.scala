package models

import org.scalatest.FunSpec
import org.scalatest.BeforeAndAfter
import org.scalatest.matchers.ShouldMatchers
import scala.slick.driver.H2Driver.simple._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 29.
 * Time: 오후 7:50
 */
class QuestionToTagSpec extends FunSpec with BeforeAndAfter with ShouldMatchers {

  implicit var session: Session = _

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
      Tag("Ruby")
    )
  }

  after {
    session.close()
  }

  describe("addAll") {
    it("태그 리스트를 모두 저장한다") {
      // given
      val id = 1
      val tags = List("Java", "Python", "Ruby")
      Questions.add(Question(id, "질문", "내용", 1))
      // when
      QuestionsToTags.addAll(id, tags)
      // then
      val results = (for {
                      q2t <- QuestionsToTags
                      if q2t.questionId === id
                    } yield q2t).list
      results.size should equal(3)
    }
    it("태그 테이블에 없는 태그만 있는 저장할 수 없다") {
      // given
      val id = 1
      val tags = List("Node.js", "Scala")
      Questions.add(Question(id, "질문", "내용", 1))
      // then
      intercept[IllegalArgumentException] {
        // when
        QuestionsToTags.addAll(id, tags)
      }
    }
  }

  describe("findByQuestionId") {
    it("질문에 등록된 태그목록을 조회한다") {
      // given
      val id = 1
      val tags = List("Java", "Python", "Ruby")
      Questions.add(Question(id, "질문", "내용", 1))
      QuestionsToTags.addAll(id, tags)
      // when
      val resultTags = QuestionsToTags.findByQuestionId(id)
      // then
      resultTags.size should equal(3)
    }
  }
}
