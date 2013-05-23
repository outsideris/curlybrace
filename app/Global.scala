import models.{Question, DBeable, AppDB}
import play.api.db.DB
import play.api.GlobalSettings

import play.api.Application
import slick.session.Session

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 21.
 * Time: 오후 10:37
 */
object Global extends GlobalSettings with DBeable {

  override def onStart(app: Application) {
    implicit val application = app
    lazy val database = getDb
    lazy val dal = getDal
    database.withSession {
      implicit session: Session =>
        dal.create
    }
  }

}
