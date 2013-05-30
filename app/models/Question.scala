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
  id: Int,
  title: String,
  contents: String,
  userId: Int,
  createdAt: DateTime = DateTime.now,
  voteup: Int = 0,
  votedown: Int = 0,
  answerCount: Int = 0,
  commentsCount: Int = 0
)

object Questions extends Table[Question]("questions") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def title = column[String]("title", O.NotNull)
  def contents = column[String]("contents", O.NotNull)
  def userId = column[Int]("user_id", O.NotNull)
  def createdAt = column[DateTime]("created_at", O.NotNull)
  def voteup = column[Int]("vote_up")
  def votedown = column[Int]("vote_down")
  def answerCount = column[Int]("answer_count")
  def commentsCount = column[Int]("comments_count")
  // FIXME: add user, voting
  def * = id ~ title ~ contents ~ userId ~ createdAt ~ voteup ~ votedown ~ answerCount  ~ commentsCount  <> (Question, Question.unapply _)

  def add(question: Question)(implicit session: Session) = {
    // validation
    require(question.title != null && !question.title.trim.isEmpty, "title")
    require(question.contents != null && !question.contents.trim.isEmpty, "contents")

    Questions.insert(question)
    question
  }

  def findById(id: Int)(implicit session: Session) = {
    Query(Questions).filter(_.id === id).firstOption
  }

  def addWithTags(question: Question, tags: List[String])(implicit session: Session) = {
    val q = Questions.add(question)
    QuestionsToTags.addAll(q.id, tags)
  }
}

