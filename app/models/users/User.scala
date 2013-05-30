package models.users

import org.joda.time._
import helpers.DateTimeMapper._
import slick.driver.PostgresDriver.simple._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 30.
 * Time: 오후 8:52
 */
case class User(
  id: Int,
  name: String,
  email: Option[String] = None,
  profileImage: Option[String] = None,
  createdAt: DateTime = DateTime.now,
  updatedAt: DateTime = DateTime.now,
  lastLoginedAt: DateTime = DateTime.now,
  loginCount: Int = 0
)

object Users extends Table[User]("users") {
  def id = column[Int]("id", O.PrimaryKey, O.AutoInc)
  def name = column[String]("name", O.NotNull)
  def email = column[Option[String]]("email", O.Nullable)
  def profileImage = column[Option[String]]("profile_image", O.Nullable)
  def createdAt = column[DateTime]("created_at", O.NotNull)
  def updatedAt = column[DateTime]("updated_at", O.NotNull)
  def lastLoginedAt = column[DateTime]("last_logined_at", O.NotNull)
  def loginCount = column[Int]("login_count")
  def * = id ~ name ~ email ~ profileImage ~ createdAt ~ updatedAt ~ lastLoginedAt ~ loginCount <> (User, User.unapply _)

  def add(user: User)(implicit session: Session) = {
    // validation
    require(user.name != null, "name")

    Users.insert(user)
    user
  }

  def findById(id: Int)(implicit session: Session) = {
    (for {
      user <- Users
      if user.id === id
    } yield user).firstOption
  }
}

