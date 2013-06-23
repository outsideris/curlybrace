package models.users

import play.api.libs.Codecs
import play.api.Logger

import securesocial.core._
import slick.driver.PostgresDriver.simple._

import helpers.Constant._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 30.
 * Time: 오후 9:13
 */
case class MyIdentity(
  pid: Option[Long] = None,
  userId: String,
  providerId: String,
  email: Option[String],
  firstName: String,
  lastName: String,
  fullName: String,
  avatarUrl: Option[String],
  authMethod: AuthenticationMethod,
  oAuth1Info: Option[OAuth1Info] = None,
  oAuth2Info: Option[OAuth2Info] = None,
  passwordInfo: Option[PasswordInfo] = None
) extends Identity {
  def id: UserId = UserId(userId, providerId)

  def gravatar: Option[String] = email.map {
    e => s"http://www.gravatar.com/avatar/${Codecs.md5(e.getBytes)}.png"
  }
}

object MyIdentity {
  def fromIdentity(user: Identity)  = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"MyIdentity.fromIdentity: $user")
    MyIdentity(
      pid = None,
      userId = user.id.id,
      providerId = user.id.providerId,
      email = user.email,
      firstName = user.firstName,
      lastName = user.lastName,
      fullName = user.fullName,
      avatarUrl = user.avatarUrl,
      authMethod = user.authMethod,
      oAuth1Info = user.oAuth1Info,
      oAuth2Info = user.oAuth2Info,
      passwordInfo = user.passwordInfo
    )
  }

  def fromSocialUser(user: SocialUser) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"MyIdentity.fromSocialUser: $user")
    MyIdentity(
      pid = None,
      userId = user.userId,
      providerId = user.providerId,
      email = user.email,
      firstName = user.firstName,
      lastName = user.lastName,
      fullName = user.fullName,
      avatarUrl = user.avatarUrl,
      authMethod = user.authMethod
//      oAuth1Info = user.oAuth1Info,
//      oAuth2Info = user.oAuth2Info,
//      passwordInfo = user.passwordInfo
    )
  }
}

case class SocialUser(
  pid: Option[Long] = None,
  userId: String,
  providerId: String,
  firstName: String,
  lastName: String,
  fullName: String,
  email: Option[String],
  avatarUrl: Option[String],
  authMethod: AuthenticationMethod
//  oAuth1Info: Option[OAuth1Info],
//  oAuth2Info: Option[OAuth2Info],
//  passwordInfo: Option[PasswordInfo]
) {
  def id: UserId = UserId(userId, providerId)
}

object SocialUsers extends Table[SocialUser](TablePrefix + "_socialusers") {
  implicit def string2AuthenticationMethod:TypeMapper[AuthenticationMethod] = MappedTypeMapper.base[AuthenticationMethod, String](
    authenticationMethod => authenticationMethod.method,
    string => AuthenticationMethod(string)
  )

  def pid = column[Long]("id", O.PrimaryKey, O.AutoInc)
  def userId = column[String]("user_id")
  def providerId = column[String]("provider_id")
  def firstName = column[String]("first_name")
  def lastName = column[String]("last_name")
  def fullName = column[String]("full_name")
  def email = column[Option[String]]("email")
  def avatarUrl = column[Option[String]]("avatar_url")
  def authMethod = column[AuthenticationMethod]("auth_method")
  // FIXME: oAuthInfo 저장 내용과 방법 확인해야 함.
//  def oAuth1Info = column[Option[OAuth1Info]]("oauth_1_info")
//  def oAuth2Info = column[Option[OAuth2Info]]("oauth_2_info")
//  def passwordInfo = column[Option[PasswordInfo]]("password_info")

  def * = {
    pid.? ~
    userId ~
    providerId ~
    firstName ~
    lastName ~
    fullName ~
    email ~
    avatarUrl ~
    authMethod <> (SocialUser, SocialUser.unapply _)
//    oAuth1Info ~
//    oAuth2Info ~
//    passwordInfo
  }
  def autoInc = * returning pid
  def forInsert = {
    userId ~
    providerId ~
    firstName ~
    lastName ~
    fullName ~
    email ~
    avatarUrl ~
    authMethod <>
      ({ (u,p,f,l,fu,e,av,au) => SocialUser(None, u,p,f,l,fu,e,av,au)},
       {(su: SocialUser) =>
         Some((su.userId,
               su.providerId,
               su.firstName,
               su.lastName,
               su.fullName,
               su.email,
               su.avatarUrl,
               su.authMethod))
       }
      )
  }

  def idxId = index("idx_socialusers_id", (userId, providerId))

  def save(su: SocialUser)(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"SocialUsers.save: $su")
    findByUserId(su.id) match {
      case None => {
        val pid = this.forInsert.insert(su)
        su.copy(pid = Some(pid))
      }
      case Some(u) => {
        (for {
          s <- SocialUsers
          if s.pid is u.pid
        } yield s).update(su.copy(pid = u.pid))
        su
      }
    }
  }

  def findByUserId(userId: UserId)(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"SocialUsers.findByUserId: $userId")
    (for {
      s <- SocialUsers
      if (s.userId is userId.id) && (s.providerId is userId.providerId)
    } yield s).firstOption
  }

  def delete(pid: Long)(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"SocialUsers.delete: $pid}")
    this.where(_.pid is pid).mutate(_.delete)
  }

  def all()(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"SocialUsers.all")
    (for {
      s <- SocialUsers
    } yield s).list
  }

  def findById(pid: Long)(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"SocialUsers.findById: $pid")
    (for {
      s <- SocialUsers
      if s.pid is pid
    } yield s).firstOption
  }

  def findByEmailAndProvider(email: String, providerId: String)(implicit session: Session) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"SocialUsers.findByEmailAndProvider: $email and $providerId")
    (for {
      s <- SocialUsers
      if (s.email is email) && (s.providerId is providerId)
    } yield s).firstOption
  }

  def fromIdentity(user: Identity) = {
    if ( Logger.isDebugEnabled ) Logger.debug(s"SocialUsers.fromIdentity: $user")
    SocialUser(
      pid = None,
      userId = user.id.id,
      providerId = user.id.providerId,
      email = user.email,
      firstName = user.firstName,
      lastName = user.lastName,
      fullName = user.fullName,
      avatarUrl = user.avatarUrl,
      authMethod = user.authMethod
//      oAuth1Info = user.oAuth1Info,
//      oAuth2Info = user.oAuth2Info,
//      passwordInfo = user.passwordInfo
    )
  }
}

