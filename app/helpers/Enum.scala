package helpers

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 6. 8.
 * Time: 오후 8:41
 */
object VoteType extends Enumeration {
  type VoteType = Value
  val UpVote = Value("upvote")
  val DownVote = Value("downvote")
}

object PostType extends Enumeration {
  type PostType = Value
  val QuestionType = Value("question")
  val AnswerType = Value("answer")
}
