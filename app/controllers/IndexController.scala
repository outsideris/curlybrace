package controllers

import play.api.mvc.{Action, Controller}

object IndexController extends Controller {
    
  def index = Action {
    // FIXME: get date from DB
    val questions = List(1,2,3,4,5,6,7,8)
    Ok(views.html.index.render(questions))
  }
    
}
