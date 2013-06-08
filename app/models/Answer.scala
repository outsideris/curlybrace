package models

import org.joda.time._
import helpers.TypeMapper._
import slick.driver.PostgresDriver.simple._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 30.
 * Time: 오후 10:40
 */
case class Answer(
  id: Int,
  questionId: Int,
  contents: String,
  userId: Int,
  voteup: Int = 0,
  votedown: Int = 0,
  commentsCount: Int = 0,
  createdAt: DateTime = DateTime.now
)

object Answers extends Table[Answer]("answer") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def questionId = column[Int]("question_id", O.NotNull)
  def contents = column[String]("contents", O.NotNull)
  def userId = column[Int]("user_id", O.NotNull)
  def voteup = column[Int]("vote_up")
  def votedown = column[Int]("vote_down")
  def commentsCount = column[Int]("comments_count")
  def createdAt = column[DateTime]("createdAt", O.NotNull)
  // FIXME: add user, voting
  def * = id ~ questionId ~ contents ~ userId ~ voteup ~ votedown ~ commentsCount ~ createdAt <> (Answer, Answer.unapply _)
  def idx = index("idx_answer", (questionId))

  def add(answer: Answer)(implicit session: Session) = {
    // validation
    require(answer.contents != null && !answer.contents.trim.isEmpty, "contents")

    Answers.insert(answer)
    answer
  }

  def findByQuestionId(questionId: Int)(implicit session: Session) = {
    (for {
      answer <- Answers
      if answer.questionId === questionId
    } yield answer).list
  }
}

