// Comment to get more information during initialization
logLevel := Level.Warn

// The Typesafe repository
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

// for coveralls.io
resolvers += Classpaths.typesafeResolver

resolvers ++= Seq(
  "sonatype-oss-repo" at "https://oss.sonatype.org/content/groups/public/"
)

// Use the Play sbt plugin for Play projects
addSbtPlugin("play" % "sbt-plugin" % "2.1.1")

// for coveralls.io
addSbtPlugin("com.github.scct" % "sbt-scct" % "0.2")

addSbtPlugin("com.github.theon" %% "xsbt-coveralls-plugin" % "0.0.3-SNAPSHOT")
