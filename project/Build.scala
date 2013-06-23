import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "curlybrace"
  val appVersion      = "1.0-SNAPSHOT"

  val appDependencies = Seq(
    // Select Play modules
    jdbc,      // The JDBC connection pool and the play.api.db API
    //anorm,     // Scala RDBMS Library
    //javaJdbc,  // Java database API
    //javaEbean, // Java Ebean plugin
    //javaJpa,   // Java JPA plugin
    //filters,   // A set of built-in filters
    //javaCore  // The core Java API

    // Add your own project dependencies in the form:
    // "group" % "artifact" % "version"
    "com.typesafe.slick" %% "slick" % "1.0.0",
    "postgresql" % "postgresql" % "9.1-901-1.jdbc4",
    "org.scalatest" % "scalatest_2.10" % "1.9.1" % "test",
    "securesocial" %% "securesocial" % "master-SNAPSHOT"
  )

  val main = play.Project(appName, appVersion, appDependencies).settings(
    scalaVersion := "2.10.1",
    // Add your own project settings here
    resolvers += Resolver.url("sbt-plugin-snapshots", new URL("http://repo.scala-sbt.org/scalasbt/sbt-plugin-snapshots/"))(Resolver.ivyStylePatterns)
  ).settings(
    ScctPlugin.instrumentSettings : _*
  ).settings(
    parallelExecution in ScctPlugin.ScctTest := false
  )

}
