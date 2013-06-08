package models

import org.joda.time._
import helpers.TypeMapper._
import slick.driver.PostgresDriver.simple._
import models.users.{Users, User}

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
  voteUp: Int = 0,
  voteDown: Int = 0,
  answerCount: Int = 0,
  commentsCount: Int = 0
)

object Questions extends Table[Question]("questions") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def title = column[String]("title", O.NotNull)
  def contents = column[String]("contents", O.NotNull)
  def userId = column[Int]("user_id", O.NotNull)
  def createdAt = column[DateTime]("created_at", O.NotNull)
  def voteUp = column[Int]("vote_up")
  def voteDown = column[Int]("vote_down")
  def answerCount = column[Int]("answer_count")
  def commentsCount = column[Int]("comments_count")
  // FIXME: add user, voting
  def * = id ~ title ~ contents ~ userId ~ createdAt ~ voteUp ~ voteDown ~ answerCount  ~ commentsCount  <> (Question, Question.unapply _)

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

  // fk 관계인 데이터를 함께 조회한다
  def findWithAllById(id: Int)(implicit session:Session) = {
    val rawList = (for {
      question <- Questions
      user <- Users
      tags <- QuestionsToTags
      if question.id === id
      if question.userId === user.id
      if question.id === tags.questionId
    } yield (question, user, tags)).list

    rawList.
      groupBy { case (question, user, tag) => (question, user)}.
      map { case ( (question, user), tags) => new QuestionInfo(question, user, tags.map(_._3.tagName)) }.toList
  }

  def addWithTags(question: Question, tags: List[String])(implicit session: Session) = {
    val q = Questions.add(question)
    QuestionsToTags.addAll(q.id, tags)
  }

  protected[models] def upVote(id: Int)(implicit session: Session) = {
    val q = for {
      question <- Questions
      if question.id === id
    } yield question.voteUp
    q.update(q.first + 1)
  }

  protected[models] def downVote(id: Int)(implicit session: Session) = {
    val q = for {
      question <- Questions
      if question.id === id
    } yield question.voteDown
    q.update(q.first + 1)
  }
}

class QuestionInfo(
  val question: Question,
  val user: User,
  val tags: List[String]
)

