import play.api.db.DB
import play.api.GlobalSettings

import slick.driver.PostgresDriver.simple._
import Database.threadLocalSession

import play.api.Application
import play.api.Play.current
import models._
import models.users._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 21.
 * Time: 오후 10:37
 */
object Global extends GlobalSettings {

  override def onStart(app: Application) {

    lazy val database = Database.forDataSource(DB.getDataSource())

    database .withSession {
      (
        Questions.ddl ++
        Answers.ddl ++
        Tags.ddl ++
        QuestionsToTags.ddl ++
        Comments.ddl ++
        Votes.ddl ++
        Users.ddl ++
        Socials.ddl
      ).create
      // insert initial tags
      Tags.init
    }
  }

}
