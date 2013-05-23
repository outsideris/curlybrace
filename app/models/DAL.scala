package models

import slick.driver.ExtendedProfile

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 21.
 * Time: 오후 10:05
 */
// DataAccessLayer
class DAL(override val profile: ExtendedProfile) extends QuestionComponent with Profile {

  import profile.simple._

  def create(implicit session:Session): Unit = {
    Questions.ddl.create //helper method to create all tables
  }
}
