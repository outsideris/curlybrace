package models.users

import org.scalatest.FunSpec
import org.scalatest.BeforeAndAfter
import org.scalatest.matchers.ShouldMatchers
import scala.slick.driver.H2Driver.simple._
import org.h2.jdbc.JdbcSQLException

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 30.
 * Time: 오후 9:39
 */
class UserSpec extends FunSpec with BeforeAndAfter with ShouldMatchers {

  implicit var session: Session = _

  before {
    session = Database.forURL("jdbc:h2:mem:curlytest", driver = "org.h2.Driver").createSession()
    Users.ddl.drop
    Users.ddl.create
  }

  after {
    session.close()
  }

  describe("add") {
    it("사용자 정보를 저장한다") {
      // given
      val id = 1
      val user = User(id, "Outsider")
      // when
      Users.add(user)
      // then
      val results = (for {acc <- Users if acc.id === id} yield acc).list
      results.size should equal(1)
    }
  }

  describe("findById") {
    it("아이디로 조회한다") {
      // given
      val id = 1
      Users.add(User(id, "Outsider"))
      // when
      val user = Users.findById(id)
      // then
      user.get.id should equal(id)
    }
    it("존재하지 않는 아이디는 조회되지 않는다") {
      // given
      Users.add(User(1, "Outsider"))
      // when
      val user = Users.findById(2)
      // then
      user should equal(None)
    }
  }
}
