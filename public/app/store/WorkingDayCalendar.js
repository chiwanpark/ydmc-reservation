'use strict';

Ext.define('YdmcReservation.store.WorkingDayCalendar', {
  extend: 'Extensible.calendar.data.MemoryCalendarStore',
  alias: 'store.holidayCalendar',
  data: [
    {
      id: 1,
      title: '예약 가능일',
      color: 2
    }
  ]
});