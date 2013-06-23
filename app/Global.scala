import play.api.db.DB
import play.api.GlobalSettings

import slick.driver.PostgresDriver.simple._
import scala.slick.jdbc.meta._
import Database.threadLocalSession

import play.api.Application
import play.api.Play.current
import helpers.Constant._
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
      val existTables = MTable.getTables.list.filter(_.name.name.startsWith(TablePrefix + "_"))
      val existTableNames = existTables.map(_.name.name)

      // create table if not exist
      if (!existTableNames.contains(Questions.tableName)) Questions.ddl.create
      if (!existTableNames.contains(Answers.tableName)) Answers.ddl.create
      if (!existTableNames.contains(Tags.tableName)) { Tags.ddl.create; Tags.init }
      if (!existTableNames.contains(QuestionsToTags.tableName)) QuestionsToTags.ddl.create
      if (!existTableNames.contains(Comments.tableName)) Comments.ddl.create
      if (!existTableNames.contains(Votes.tableName)) Votes.ddl.create
      if (!existTableNames.contains(Users.tableName)) Users.ddl.create
      if (!existTableNames.contains(SocialUsers.tableName)) SocialUsers.ddl.create
      if (!existTableNames.contains(Tokens.tableName)) Tokens.ddl.create
    }
  }

}
