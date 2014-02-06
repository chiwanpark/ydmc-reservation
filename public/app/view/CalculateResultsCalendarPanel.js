'use strict';

Ext.define('YdmcReservation.view.CalculateResultsCalendarPanel', {
  extend: 'Extensible.calendar.CalendarPanel',
  alias: 'widget.calculateResultsCalendarPanel',
  title: '배정 결과 확인 달력',
  region: 'north',
  readOnly: true,
  showDayView: false,
  showWeekView: false,
  showMultiWeekView: false,
  showTime: false,
  editModal: false
});