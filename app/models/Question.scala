package models

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 21.
 * Time: 오후 9:57
 */
case class Question(id: Option[Int], title: String)

trait QuestionComponent {
  this: Profile =>

  import profile.simple._

  object Questions extends Table[Question]("questions") {
    def id = column[Int]("id", O.PrimaryKey)
    def title = column[String]("title", O.NotNull)
    def * = id.? ~ title <> (Question, Question.unapply _)

    def add(question: Question)(implicit session: Session) = {
      this.insert(question)
    }

    def findById(id: Option[Int])(implicit session: Session) = {
      (for {
        question <- Questions
        if (question.id === id)
      } yield(question)).list.size
    }
  }
}

