package controllers

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 19.
 * Time: 오후 8:11
 */

import play.api.mvc.{Action, Controller}

object UserController extends Controller {

  def login = Action {
    Ok(views.html.users.login())
  }

  def logout = Action {
    Ok("Log out")
  }
}



