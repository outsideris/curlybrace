/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 11.
 * Time: 오후 7:44
 */
package test

import org.specs2.mutable._

import play.api.test._
import play.api.test.Helpers._

class MainControllerSpec extends Specification {

  "MainController" should {

    "index template should contain the correct string" in new WithApplication {
      val result = controllers.MainController.index(FakeRequest())

      status(result) must equalTo(OK)
      contentType(result) must beSome("text/html")
      charset(result) must beSome("utf-8")
      contentAsString(result) must contain("Hello from Java")
    }

  }
}

