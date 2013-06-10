package models

import org.joda.time._
import helpers.Constant._
import helpers.TypeMapper._
import helpers.PostType._
import slick.driver.PostgresDriver.simple._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 6. 9.
 * Time: 오후 4:22
 */
case class Comment(
  id: Int,
  contents: String,
  userId: Int,
  parentId: Int,
  parentType: PostType,
  createdAt: DateTime = DateTime.now
)

object Comments extends Table[Comment](TablePrefix + "_comments") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def contents = column[String]("contents", O.NotNull)
  def userId = column[Int]("user_id", O.NotNull)
  def parentId = column[Int]("parent_id", O.NotNull)
  def parentType = column[PostType]("parent_type", O.NotNull)
  def createdAt = column[DateTime]("createdAt", O.NotNull)
  def * = id ~ contents ~ userId ~ parentId ~ parentType ~ createdAt <> (Comment, Comment.unapply _)
  def idx = index("idx_comments", (parentId, parentType))

  def add(comment: Comment)(implicit session: Session) = {
    // validation
    require(comment.contents != null && !comment.contents.trim.isEmpty, "contents")

    Comments.insert(comment)
    comment.parentType match {
      case QuestionType => Questions.updateCommentsCount(comment.parentId)
      case AnswerType => Answers.updateCommentsCount(comment.parentId)
    }
    comment
  }

  def findByParent(parentId: Int, parentType: PostType)(implicit session: Session) = {
    (for {
      c <- Comments
      if c.parentId === parentId
      if c.parentType === parentType
    } yield c).sortBy(_.createdAt.asc).list
  }
}

