package models

import slick.driver.PostgresDriver.simple._

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 26.
 * Time: 오후 8:45
 */
case class Tag(
  name: String,
  aliasTo: Option[String] = None
)

object Tags extends Table[Tag]("tags") {
  def name = column[String]("name", O.PrimaryKey)
  def aliasTo = column[String]("alias_to", O.Nullable)
  def * = name ~ aliasTo.? <> (Tag, Tag.unapply _)

  def add(tag: Tag)(implicit session: Session) = {
    Tags.insert(tag)
  }

  // alias는 원 태그만 반환한다.
  def findNamesContain(str: String)(implicit session: Session) = {
    val tags = (for {
        tag <- Tags
      } yield tag).list.filter(_.name.toLowerCase contains str.toLowerCase)

    tags.map( (x) => if (x.aliasTo != None) x.aliasTo.get else x.name )
  }

  // alias는 제외한다.
  def findAll()(implicit session: Session) = {
    (for {
      tag <- Tags if tag.aliasTo.isNull
    } yield tag).list

  }

  def init()(implicit session: Session) = {
    Tags.insertAll(
      Tag("Java"),
      Tag("Node.js"),
      Tag("Scala"),
      Tag("JavaScript"),
      Tag("C#"),
      Tag("HTML"),
      Tag("HTML5"),
      Tag("CSS"),
      Tag("PHP"),
      Tag("Python"),
      Tag("Ruby"),
      Tag("Rails"),
      Tag("Ruby on Rails", Option("Rails")),
      Tag("RoR", Option("Rails")),
      Tag("iOS"),
      Tag("ASP.net"),
      Tag("C"),
      Tag("C++"),
      Tag("Objective-C"),
      Tag("CoffeeScript"),
      Tag("ECMAScript"),
      Tag("Sass"),
      Tag("Less"),

      Tag("Spring Framework"),
      Tag("Cloud"),
      Tag("jQuery"),
      Tag("Play Framework"),
      Tag("Hadoop"),
      Tag("Pig"),
      Tag("Hive"),
      Tag("iBatis"),
      Tag("MyBatis"),
      Tag("Hibernate"),
      Tag("Backbone.js"),
      Tag("AngularJS"),

      Tag("Regular Expression"),
      Tag("regexp", Option("Regular Expression")),
      Tag("XML"),
      Tag("JSON"),
      Tag("Ajax"),

      Tag("SQL"),
      Tag("Database"),
      Tag("NoSQL"),
      Tag("RDBMS"),
      Tag("Oracle"),
      Tag("MySQL"),
      Tag("MongoDB"),
      Tag("Cassandra"),
      Tag("Redis"),
      Tag("Memcached"),
      Tag("Big Data"),
      Tag("HBase"),
      Tag("MS-SQL"),

      Tag("vim"),
      Tag("git"),
      Tag("Subversion"),
      Tag("svn" , Option("Subversion")),
      Tag("Mercurial"),
      Tag("hg", Option("Mercurial")),
      Tag("Maven"),
      Tag("mvn", Option("Maven")),
      Tag("Ant"),
      Tag("Gradle"),
      Tag("Tomcat"),
      Tag("Jetty"),
      Tag("Shell"),
      Tag("sbt"),

      Tag("Agile"),
      Tag("Design Pattern"),
      Tag("REST")
    )
  }
}

