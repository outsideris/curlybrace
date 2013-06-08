package models.users

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
 * Time: 오후 9:13
 */
case class Social(
  id: String,
  origin: String,
  userId: Int,
  token: Option[String] = None,
  secret: Option[String] = None,
  name: Option[String] = None,
  profileImage: Option[String] = None,
  url: Option[String] = None,
  createdAt: DateTime = DateTime.now,
  updatedAt: DateTime = DateTime.now
)

object Socials extends Table[Social]("socials") {
  def id = column[String]("id")
  def origin = column[String]("origin")
  def userId = column[Int]("user_id")
  def token = column[Option[String]]("token", O.Nullable)
  def secret = column[Option[String]]("secret", O.Nullable)
  def name = column[Option[String]]("name", O.Nullable)
  def profileImage = column[Option[String]]("profile_image", O.Nullable)
  def url = column[Option[String]]("url", O.Nullable)
  def createdAt = column[DateTime]("created_at")
  def updatedAt = column[DateTime]("updated_at")
  def * = id ~ origin ~ userId ~ token ~ secret ~ name ~ profileImage ~ url ~ createdAt ~ updatedAt <> (Social, Social.unapply _)
  def pk = primaryKey("pk_socials", id ~ origin)
  def idxUserId = index("idx_socials_userid", (userId))

  def add(social: Social)(implicit session: Session) = {
    Socials.insert(social)
    social
  }

  def findByIdAndOrigin(id: String, origin: String)(implicit session: Session) = {
    (for {
      account <- Socials
      if account.id === id
      if account.origin === origin
    } yield account).list
  }

  def findByUserId(userId: Int)(implicit session: Session) = {
    (for {
      account <- Socials
    } yield account).list
  }
}

