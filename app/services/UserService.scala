package services

import play.api.{Logger, Application}
import play.api.db.DB
import play.api.Play.current
import slick.driver.PostgresDriver.simple._
import Database.threadLocalSession

import securesocial.core._
import securesocial.core.providers.Token
import securesocial.core.UserId

import models.users._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 6. 17.
 * Time: 오후 9:44
 */
class UserService(application: Application) extends UserServicePlugin(application) {

  lazy val database = Database.forDataSource(DB.getDataSource())

  def find(id: UserId): Option[Identity] = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"UserService.find: $id")
    database withSession {
      SocialUsers.findByUserId(id) map {
        u => MyIdentity.fromSocialUser(u)
      }
    }
  }

  def findByEmailAndProvider(email: String, providerId: String): Option[Identity] = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"UserService.findByEmailAndProvider: $email and $providerId")
    database withSession {
      SocialUsers.findByEmailAndProvider(email, providerId) map {
        u => MyIdentity.fromSocialUser(u)
      }
    }
  }

  def save(identity: Identity): Identity = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"UserService.save: $identity")
    database withSession {
      val u = SocialUsers.fromIdentity(identity)
      MyIdentity.fromSocialUser(SocialUsers.save(u))
    }
  }

  def save(token: Token) {
    if ( Logger.isDebugEnabled ) Logger.debug(s"UserService.save(token): $token")
    database withSession {
      Tokens.save(token)
    }
  }

  def findToken(token: String): Option[Token] = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"UserService.findToken: $token")
    database withSession {
      Tokens.findByUUID(token)
    }
  }

  def deleteToken(uuid: String) {
    if ( Logger.isDebugEnabled ) Logger.debug(s"UserService.deleteToken: $uuid")
    database withSession {
      Tokens.delete(uuid)
    }
  }

  def deleteTokens() {
    if ( Logger.isDebugEnabled ) Logger.debug(s"UserService.deleteTokens")
    database withSession {
      Tokens.deleteAll()
    }
  }

  def deleteExpiredTokens() {
    if ( Logger.isDebugEnabled ) Logger.debug(s"UserService.deleteExpiredTokens")
    database withSession {
      Tokens.deleteExpiredTokens()
    }
  }
}
