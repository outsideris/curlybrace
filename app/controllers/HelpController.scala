package controllers

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 19.
 * Time: 오후 8:54
 */

import play.api.mvc.{Action, Controller}

object HelpController extends Controller {

  def markdown = Action {
    Ok(views.html.helps.markdown())
  }
}



