package helpers

import slick.lifted.MappedTypeMapper
import java.sql.Timestamp
import org.joda.time.DateTime
import slick.lifted.TypeMapper.DateTypeMapper

/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 *
 * Author: Outsider
 * Date: 13. 5. 25.
 * Time: 오후 8:28
 */
object DateTimeMapper {

  implicit def date2dateTime = MappedTypeMapper.base[DateTime, Timestamp] (
    dateTime => new Timestamp(dateTime.getMillis),
    date => new DateTime(date)
  )

}
