'use strict';

Ext.define('YdmcReservation.controller.WorkingDay', {
  extend: 'Ext.app.Controller',

  workingDayURL: '/workingday',

  views: ['Viewport', 'WorkingDayPanel'],

  init: function (app) {
    this.app = app;
    this.control({
      'viewport buttongroup#adminMenu button#showManageWorkingDays': {
        click: this.showManageWorkingDays,
        scope: this
      },
      'viewport workingDayPanel': {
        dayclick: this.toggleWorkingDay,
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

  showManageWorkingDays: function () {
    var viewportWindow = this.app.getViewportWindow();
    var contentsPanel = viewportWindow.down('panel#contentsPanel');

    contentsPanel.removeAll(true);

    this.workingDayStore = Ext.create('YdmcReservation.store.WorkingDay');
    this.workingDayCalendarStore = Ext.create('YdmcReservation.store.WorkingDayCalendar');
    contentsPanel.add({
      xtype: 'workingDayPanel',
      calendarStore: this.workingDayCalendarStore,
      eventStore: this.workingDayStore
    });
  },

  toggleWorkingDay: function (calendarPanel, date) {
    var dateString = Ext.Date.format(date, 'Y-m-d');
    var filtered = this.workingDayStore.queryBy(function (raw) {
      var startDateString = Ext.Date.format(raw.data.StartDate, 'Y-m-d');
      return startDateString === dateString;
    });

    if (filtered.length > 0) {
      Ext.Ajax.request({
        method: 'DELETE',
        url: this.workingDayURL + '/' + dateString,
        success: function() {
          this.workingDayStore.remove(filtered.items);
        },
        scope: this
      });
    } else {
      Ext.Ajax.request({
        method: 'POST',
        url: this.workingDayURL + '/' + dateString,
        success: function() {
          setTimeout(function() {
            var view = Ext.ComponentQuery.query('workingDayPanel')[0].getActiveView();
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