package models

import org.specs2.mutable._
import play.api.test._
import play.api.test.Helpers._
import models.{Question, AppDB}
import slick.session.Session

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

  "Question" should {
    "be saved" in {
      running(FakeApplication(additionalConfiguration = inMemoryDatabase())) {
        AppDB.database.withSession {
          implicit session: Session =>
            AppDB.dal.Questions.add(Question(Some(2), "hola"))
            AppDB.dal.Questions.findById(Some(2)) must beEqualTo(1)
            AppDB.dal.Questions.findById(Some(1)) must beEqualTo(0)
        }
      }
    }
  }

}
