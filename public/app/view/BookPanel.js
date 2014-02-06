'use strict';

Ext.define('YdmcReservation.view.BookPanel', {
  extend: 'Extensible.calendar.CalendarPanel',
  alias: 'widget.bookPanel',
  title: '예약 달력',
  showDayView: false,
  showWeekView: false,
  showMultiWeekView: false,
  showTime: false,
  editModal: false,
  calendarStore: Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
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
  })
});