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

  viewConfig: {
    enableContextMenus: false
  }
});