'use strict';

Ext.define('YdmcReservation.view.HolidayPanel', {
  extend: 'Extensible.calendar.CalendarPanel',
  requires: ['YdmcReservation.store.HolidayCalendar'],

  alias: 'widget.holidayPanel',
  title: '예약 금지일 달력',
  showDayView: false,
  showWeekView: false,
  showMultiWeekView: false,
  showTime: false,
  editModal: false
});