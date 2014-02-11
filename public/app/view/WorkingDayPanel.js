'use strict';

Ext.define('YdmcReservation.view.WorkingDayPanel', {
  extend: 'Extensible.calendar.CalendarPanel',
  requires: ['YdmcReservation.store.WorkingDayCalendar'],

  alias: 'widget.workingDayPanel',
  title: '예약 가능일 달력',
  showDayView: false,
  showWeekView: false,
  showMultiWeekView: false,
  showTime: false,
  editModal: false
});