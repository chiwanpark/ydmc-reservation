'use strict';

Ext.define('YdmcReservation.store.BookCalendar', {
  extend: 'Extensible.calendar.data.MemoryCalendarStore',
  alias: 'store.bookCalendar',
  data: [
    {
      id: 1,
      title: '1순위',
      color: 22
    },
    {
      id: 2,
      title: '2순위',
      color: 7
    },
    {
      id: 3,
      title: '3순위',
      color: 26
    },
    {
      id: 4,
      title: '예약 금지일',
      color: 2
    }
  ]
});