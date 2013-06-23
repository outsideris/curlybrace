package models.users

import play.api.Logger

import org.joda.time._
import helpers.Constant._
import helpers.TypeMapper._
import slick.driver.PostgresDriver.simple._
import securesocial.core.providers.Token

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 6. 22.
 * Time: 오전 12:19
 */
object Tokens extends Table[Token](TablePrefix + "_tokens") {
  def uuid = column[String]("uuid")
  def email =column[String]("email")
  def createdAt = column[DateTime]("created_at")
  def expiredAt = column[DateTime]("expired_at")
  def isSignUp = column[Boolean]("is_signup")
  def * = uuid ~ email ~ createdAt ~ expiredAt ~ isSignUp <> (Token, Token.unapply _)

  def findByUUID(uuid: String)(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"Tokens.findByUUID: $uuid")
    (for(
      t <- Tokens
      if t.uuid === uuid
    ) yield t).firstOption
  }

  def save(token: Token)(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"Tokens.save: $token")
    findByUUID(token.uuid) map { t =>
      (for (
        tk <- Tokens
        if tk.uuid === t.uuid
      ) yield tk).update(token)
    } getOrElse {
      this.insert(token)
    }
    token
  }

  def delete(uuid: String)(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"Tokens.delete: $uuid")
    this.where(_.uuid is uuid).mutate(_.delete)
  }

  def deleteAll()(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"Tokens.deleteAll")
    Query(Tokens).mutate(_.delete)
  }

  def deleteExpiredTokens()(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"Tokens.deleteExpiredTokens")
    Query(Tokens).where(_.expiredAt <= DateTime.now).mutate(_.delete)
  }

  def all()(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"Tokens.all")
    val q = for (user <- Users) yield user
    q.list
  }
}
