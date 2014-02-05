'use strict';

Ext.define('YdmcReservation.view.HolidayPanel', {
  extend: 'Extensible.calendar.CalendarPanel',
  alias: 'widget.holidayPanel',
  title: '예약 금지일 달력',
  showDayView: false,
  showWeekView: false,
  showMultiWeekView: false,
  showTime: false,
  editModal: false,
  calendarStore: Ext.create('Extensible.calendar.data.MemoryCalendarStore', {
    data: [
      {
        id: 1,
        title: '휴일',
        color: 2
      }
    ]
  })
});