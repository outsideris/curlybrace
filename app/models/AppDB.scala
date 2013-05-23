package models

import play.api.Play.current

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 23.
 * Time: 오후 8:23
 */
object AppDB extends DBeable {

  lazy val database = getDb
  lazy val dal = getDal

}
