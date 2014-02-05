'use strict';

Ext.define('YdmcReservation.controller.User', {
  extend: 'Ext.app.Controller',

  views: ['Viewport', 'UserManageGridPanel'],

  userURL: '/user',

  init: function (app) {
    this.app = app;
    this.control({
      'viewport buttongroup#adminMenu button#showManageUsers': {
        click: this.showManageUsers,
        scope: this
      },
      'viewport userManageGridPanel button#saveUsers': {
        click: this.saveUsers,
        scope: this
      },
      'viewport userManageGridPanel button#rejectChangeUsers': {
        click: this.rejectChanges,
        scope: this
      }
    });
  },

  saveUsers: function () {
    var gridPanel = this.app.getViewportWindow().down('userManageGridPanel');
    var store = gridPanel.getStore();
    var modifiedRecords = store.getModifiedRecords();

    Ext.each(modifiedRecords, function (value) {
      var data = value.data;

      Ext.Ajax.request({
        method: 'PUT',
        url: this.userURL + '/' + data._id,
        async: false,
        params: {
          admin: data.admin,
          email: data.email,
          schoolName: data.schoolName,
          teacherName: data.teacherName,
          verified: data.verified
        }
      });
    }, this);

    store.load();
  },

  rejectChanges: function () {
    var gridPanel = this.app.getViewportWindow().down('userManageGridPanel');
    var store = gridPanel.getStore();

    store.rejectChanges();
  },

  showManageUsers: function () {
    var viewportWindow = this.app.getViewportWindow();
    var contentsPanel = viewportWindow.down('panel#contentsPanel');

    contentsPanel.removeAll(true);
    contentsPanel.add({
      xtype: 'userManageGridPanel',
      store: Ext.create('YdmcReservation.store.User')
    });
  }
});