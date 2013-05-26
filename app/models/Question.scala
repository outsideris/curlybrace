package models

import org.joda.time._
import helpers.DateTimeMapper._
import slick.driver.PostgresDriver.simple._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 21.
 * Time: 오후 9:57
 */
case class Question(
  id: Option[Int],
  title: String,
  contents: String,
  regdate: DateTime = DateTime.now,
  voteup: Int = 0,
  votedown: Int = 0
)

object Questions extends Table[Question]("questions") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def title = column[String]("title", O.NotNull)
  def contents = column[String]("contents", O.NotNull)
  def regdate = column[DateTime]("regdate", O.NotNull)
  def voteup = column[Int]("voteup")
  def votedown = column[Int]("votedown")
  // FIXME: add user, tag, voting
  def * = id.? ~ title ~ contents ~ regdate ~ voteup ~ votedown  <> (Question, Question.unapply _)

  def add(question: Question)(implicit session: Session) = {
    Questions.insert(question)
  }

  def findById(id: Option[Int])(implicit session: Session) = {
    Query(Questions).filter(_.id === id).firstOption
  }
}

