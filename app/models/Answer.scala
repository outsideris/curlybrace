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
  voteUp: Int = 0,
  voteDown: Int = 0,
  commentsCount: Int = 0,
  createdAt: DateTime = DateTime.now
)

object Answers extends Table[Answer]("answers") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def questionId = column[Int]("question_id", O.NotNull)
  def contents = column[String]("contents", O.NotNull)
  def userId = column[Int]("user_id", O.NotNull)
  def voteUp = column[Int]("vote_up")
  def voteDown = column[Int]("vote_down")
  def commentsCount = column[Int]("comments_count")
  def createdAt = column[DateTime]("createdAt", O.NotNull)
  // FIXME: add user, voting
  def * = id ~ questionId ~ contents ~ userId ~ voteUp ~ voteDown ~ commentsCount ~ createdAt <> (Answer, Answer.unapply _)
  def idx = index("idx_answers", (questionId))

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

  protected[models] def upVote(id: Int)(implicit session: Session) = {
    val q = for {
      answer <- Answers
      if answer.id === id
    } yield answer.voteUp
    q.update(q.first + 1)
  }

  protected[models] def downVote(id: Int)(implicit session: Session) = {
    val q = for {
      answer <- Answers
      if answer.id === id
    } yield answer.voteDown
    q.update(q.first + 1)
  }
}

