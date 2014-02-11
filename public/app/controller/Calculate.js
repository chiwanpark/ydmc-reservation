'use strict';

Ext.define('YdmcReservation.controller.Calculate', {
  extend: 'Ext.app.Controller',

  calculateURL: '/calculate',
  getDetailURL: '/book',

  views: ['Viewport', 'CalculateResultsCalendarPanel', 'BookDetailWindow'],

  init: function (app) {
    this.app = app;
    this.control({
      'viewport buttongroup#adminMenu button#showResults': {
        click: this.showResults,
        scope: this
      },
      'calculateResultsCalendarPanel': {
        eventclick: this.bookClick,
        scope: this
      },
      'calculateDateRangeWindow datepicker#rangeStart': {
        select: this.rangeStartSelected,
        scope: this
      },
      'calculateDateRangeWindow datepicker#rangeEnd': {
        select: this.rangeEndSelected,
        scope: this
      },
      'calculateDateRangeWindow button#submit': {
        click: this.doCalculate,
        scope: this
      },
      'calculateDateRangeWindow button#cancel': {
        click: this.closeRangeWindow,
        scope: this
      }
    });
  },

  bookClick: function(calendarPanel, record) {
    Ext.Ajax.request({
      method: 'GET',
      url: this.getDetailURL + '/' + record.raw._id,
      success: this.bookDetailArrived,
      failure: this.calculateFailed,
      scope: this
    });
  },

  bookDetailArrived: function(connection){
    var result = Ext.JSON.decode(connection.responseText);

    if (!result) {
      result = {};
      result.success = false;
      result.message = connection.responseText;
    }

    if (result.success) {
      var window = Ext.create('YdmcReservation.view.BookDetailWindow');

      window.center().show();

      window.down('combo[name=preference]').setValue(result.book.preference);
      window.down('textfield[name=schoolName]').setValue(result.book.schoolName);
      window.down('textfield[name=date]').setValue(Ext.Date.format(new Date(result.book.date), 'Y-m-d'));
      window.down('textfield[name=registered]').setValue(Ext.Date.format(new Date(result.book.registered), 'Y-m-d H:i:s'));
      window.down('textfield[name=file]').setValue(result.book.file ? result.book.file : '');
      window.down('textarea[name=comment]').setValue(result.book.comment ? result.book.comment : '');
    } else {
      Ext.Msg.show({
        title: 'Error!',
        msg: result.message,
        icon: Ext.Msg.ERROR,
        buttons: Ext.Msg.OK
      });
    }
  },

  rangeStartSelected: function(datepicker, date) {
    var rangeEnd = this.getCalculateDateRangeWindow().down('datepicker[name=rangeEnd]');
    rangeEnd.setMinDate(date);
  },

  rangeEndSelected: function(datepicker, date) {
    var rangeStart = this.getCalculateDateRangeWindow().down('datepicker[name=rangeStart]');
    rangeStart.setMaxDate(date);
  },

  showResults: function () {
    Ext.create('YdmcReservation.view.CalculateDateRangeWindow').center().show();
  },

  doCalculate: function() {
    var rangeStart = this.getCalculateDateRangeWindow().down('datefield[name=rangeStart]');
    var rangeEnd = this.getCalculateDateRangeWindow().down('datefield[name=rangeEnd]');
    var start = Ext.Date.format(rangeStart.getValue(), "'Y-m-d'");
    var end = Ext.Date.format(rangeEnd.getValue(), "'Y-m-d'");

    Ext.Ajax.request({
      method: 'GET',
      url: this.calculateURL + '?rangeStart=' + start + '&rangeEnd=' + end,
      success: this.resultsArrived,
      failure: this.calculateFailed,
      scope: this
    });
  },

  resultsArrived: function (connection) {
    var viewportWindow = this.app.getViewportWindow();
    var contentsPanel = viewportWindow.down('panel#contentsPanel');
    var result = Ext.JSON.decode(connection.responseText);
    if (!result) {
      result = {};
      result.success = false;
      result.message = connection.responseText;
    }

    if (result.success) {
      var resultCalendarStore = Ext.create('YdmcReservation.store.BookCalendar');
      var resultsStore = Ext.create('Extensible.calendar.data.MemoryEventStore', {
        data: result.results
      });

      if (result.unassigned.length > 0) {
        Ext.Msg.show({
          title: 'Warning!',
          msg: '날짜를 할당 받지 못한 학교가 존재합니다!',
          icon: Ext.Msg.WARNING,
          buttons: Ext.Msg.OK
        });
      }

      contentsPanel.removeAll(true);
      contentsPanel.add({
        xtype: 'calculateResultsCalendarPanel',
        eventStore: resultsStore,
        calendarStore: resultCalendarStore
      });

      this.closeRangeWindow();
    } else {
      Ext.Msg.show({
        title: 'Error!',
        msg: result.message,
        icon: Ext.Msg.ERROR,
        buttons: Ext.Msg.OK
      });
    }
  },

  calculateFailed: function (connection) {
    Ext.Msg.show({
      title: 'Error!',
      msg: connection.responseText,
      icon: Ext.Msg.ERROR,
      buttons: Ext.Msg.OK
    });
  },

  closeRangeWindow: function() {
    var rangeWindow = this.getCalculateDateRangeWindow();
    rangeWindow.close();
    rangeWindow.destroy();
  },

  getCalculateDateRangeWindow: function() {
    return Ext.ComponentQuery.query('calculateDateRangeWindow')[0];
  }
});