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
 * Date: 13. 5. 26.
 * Time: 오후 9:06
 */
class TagSpec extends FunSpec with BeforeAndAfter with ShouldMatchers {

  implicit var session: Session = _

  before {
    session = Database.forURL("jdbc:h2:mem:curlytest", driver = "org.h2.Driver").createSession()
    Tags.ddl.drop
    Tags.ddl.create
    Tags.init
  }

  after {
    session.close()
  }

  describe("findNamesContain") {
    it("검색어가 포함된 태그를 조회한다") {
      // when
      val tags = Tags.findNamesContain("script")
      // then
      tags.size should equal(3)
    }
    it("별칭으로 검색된 경우는 원태그만 반환한다.") {
      // when
      val tags = Tags.findNamesContain("vn")
      // then
      tags.size should equal(2)
      tags should contain("Maven")
    }
    it("별칭과 태그명으로 검색된 경우는 원태그만 반환한다.") {
      // when
      val tags = Tags.findNamesContain("ruby")
      // then
      tags.size should equal(2)
      tags should contain("Rails")
    }
  }
  describe("findAll") {
    it("전체 태그를 조회할 때 별칭은 가져오지 않는다") {
      // when
      val tags = Tags.findAll()
      // then
      tags.size should equal(64)
      tags.forall(_.aliasTo == None) should equal(true)
    }
  }
  describe("findAllExist") {
    it("존재하는 태그만 가져온다") {
      // when
      val tags = Tags.findAllExist(List("Java", "node", "Scala"))
      // then
      tags.size should equal(2)
      tags.contains("node") should equal(false)
    }
  }
}
