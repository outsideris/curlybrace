package controllers

import securesocial.core._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 17.
 * Time: 오후 5:37
 */

import play.api.mvc.{Action, Controller}

object QuestionController extends Controller with SecureSocial {

  def addFrom = SecuredAction { implicit request =>
    Ok(views.html.questions.add())
  }
}



