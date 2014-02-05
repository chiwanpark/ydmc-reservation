'use strict';

Ext.define('YdmcReservation.controller.Holiday', {
  extend: 'Ext.app.Controller',

  holidayURL: '/holiday',

  views: ['Viewport', 'HolidayPanel'],

  init: function (app) {
    this.app = app;
    this.control({
      'viewport buttongroup#adminMenu button#showManageHolidays': {
        click: this.showManageHolidays,
        scope: this
      },
      'viewport holidayPanel': {
        dayclick: this.toggleHoliday,
        editdetails: this.blockEvent,
        eventadd: this.blockEvent,
        eventcancel: this.blockEvent,
        eventclick: this.blockEvent,
        eventdelete: this.blockEvent,
        eventmove: this.blockEvent,
        eventresize: this.blockEvent,
        eventupdate: this.blockEvent,
        initdrag: this.blockEvent,
        rangeselect: this.blockEvent,
        scope: this
      }
    });
  },

  showManageHolidays: function () {
    var viewportWindow = this.app.getViewportWindow();
    var contentsPanel = viewportWindow.down('panel#contentsPanel');

    contentsPanel.removeAll(true);

    this.holidayStore = Ext.create('YdmcReservation.store.Holiday');
    contentsPanel.add({
      xtype: 'holidayPanel',
      eventStore: this.holidayStore
    });
  },

  toggleHoliday: function (calendarPanel, date) {
    var dateString = Ext.Date.format(date, 'Y-m-d');
    var filtered = this.holidayStore.queryBy(function (raw) {
      var startDateString = Ext.Date.format(raw.data.StartDate, 'Y-m-d');
      return startDateString === dateString;
    });

    if (filtered.length > 0) {
      Ext.Ajax.request({
        method: 'DELETE',
        url: this.holidayURL + '/' + dateString,
        success: function() {
          this.holidayStore.remove(filtered.items);
        },
        scope: this
      });
    } else {
      Ext.Ajax.request({
        method: 'POST',
        url: this.holidayURL + '/' + dateString,
        success: function() {
          setTimeout(function() {
            var view = Ext.ComponentQuery.query('holidayPanel')[0].getActiveView();
            view.refresh(true);
          }, 10);
        },
        scope: this
      });
    }

    return false;
  },

  blockEvent: function() {
    return false;
  }
});