'use strict';

Ext.define('YdmcReservation.store.HolidayCalendar', {
  extend: 'Extensible.calendar.data.MemoryCalendarStore',
  alias: 'store.holidayCalendar',
  data: [
    {
      id: 1,
      title: '휴일',
      color: 2
    }
  ]
});