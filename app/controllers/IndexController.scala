package controllers

import securesocial.core._
import play.api.mvc.{Action, Controller}

object IndexController extends Controller with SecureSocial {
    
  def index = UserAwareAction { implicit request =>
    // FIXME: get date from DB
    val questions = List(1,2,3,4,5,6,7,8)
    Ok(views.html.index.render(questions))
  }
    
}
