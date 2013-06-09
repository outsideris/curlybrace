package models.users

import org.scalatest.FunSpec
import org.scalatest.BeforeAndAfter
import org.scalatest.matchers.ShouldMatchers
import scala.slick.driver.H2Driver.simple._
import org.h2.jdbc.JdbcSQLException
import scala.slick.jdbc.meta._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 30.
 * Time: 오후 9:39
 */
class SocialSpec extends FunSpec with BeforeAndAfter with ShouldMatchers {

  implicit var session: Session = _

  before {
    session = Database.forURL("jdbc:h2:mem:curlytest", driver = "org.h2.Driver").createSession()
    if (!MTable.getTables("socials").list.isEmpty) Socials.ddl.drop
    Socials.ddl.create
  }

  after {
    session.close()
  }

  describe("add") {
    it("소셜인증 정보를 저장한다") {
      // given
      val id = "outsider"
      val s = Social(id, "facebook", 1)
      // when
      Socials.add(s)
      // then
      val results = (for {acc <- Socials if acc.id === id} yield acc).list
      results.size should equal(1)
    }
    it("같은 아이디의 소셜서비스로는 저장하지 않는다") {
      // given
      val id = "outsider"
      // when
      Socials.add(Social(id, "twitter", 2))
      // then
      intercept[JdbcSQLException] {
        Socials.add(Social(id, "twitter", 3))
      }
    }
  }

  describe("findByIdAndOrigin") {
    it("아이디와 소설서비스 종류로 조회한다") {
      // given
      val id = "outsider"
      val origin = "twitter"
      Socials.add(Social(id, origin, 2))
      // when
      val socials = Socials.findByIdAndOrigin(id, origin)
      // then
      socials.size should equal(1)
    }
    it("존재하지 않는 아이디와 소설서비스 종류는 조회되지 않는다") {
      // given
      val id = "outsider"
      val origin = "twitter"
      // when
      val socials = Socials.findByIdAndOrigin(id, origin)
      // then
      socials.size should equal(0)
    }
  }

  describe("findByUserId") {
    it("사용자 아이디와 관련된 소셜인증정보를 가져온다") {
      // given
      val userId = 1
      // when
      Socials.add(Social("outsider", "facebook", userId))
      Socials.add(Social("outsider", "twitter", userId))
      // then
      Socials.findByUserId(userId).size should equal(2)
    }
  }
}
