package models

import slick.session.Database
import play.api.db.DB
import play.api.Application
import slick.driver.ExtendedProfile

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 21.
 * Time: 오후 10:08
 */
trait DBeable {
  val SLICK_DRIVER = "slick.db.driver"
  val DEFAULT_SLICK_DRIVER = "scala.slick.driver.H2Driver"

  def getDal(implicit app: Application): DAL = {
    val driverClass = app.configuration.getString(SLICK_DRIVER).getOrElse(DEFAULT_SLICK_DRIVER)
    val driver = singleton[ExtendedProfile](driverClass)
    new DAL(driver)
  }

  def getDb(implicit app: Application) = {
    Database.forDataSource(DB.getDataSource())
  }

  private def singleton[T](name: String)(implicit man: Manifest[T]):T =
      Class.forName(name + "$").getField("MODULE$").get(man.runtimeClass).asInstanceOf[T]
}
