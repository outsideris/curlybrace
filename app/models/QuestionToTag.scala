package models

import slick.driver.PostgresDriver.simple._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 29.
 * Time: 오후 7:06
 */
case class QuestionToTag(
  questionId: Int,
  tagName: String
)

object QuestionsToTags extends Table[QuestionToTag]("question_to_tag") {
  def questionId = column[Int]("question_id")
  def tagName = column[String]("tag_name")
  def * = questionId ~ tagName <> (QuestionToTag, QuestionToTag.unapply _)
  def idx = index("idx_question_to_tag", (questionId, tagName), unique = true)

  def addAll(questionId: Int, tags: List[String])(implicit session: Session) = {
    // validation
    require(Tags.findAllExist(tags).size > 0, "tags")

    tags.foreach(x => QuestionsToTags.insert(QuestionToTag(questionId, x)))
  }

  def findByQuestionId(questionId: Int)(implicit session: Session) = {
    (for {
      q2t <- QuestionsToTags
      if q2t.questionId === questionId
    } yield q2t).list
  }
}

