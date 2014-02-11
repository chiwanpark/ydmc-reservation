'use strict';

Ext.define('YdmcReservation.controller.Preferences', {
  extend: 'Ext.app.Controller',

  views: ['Viewport', 'PreferencesPanel'],

  init: function (app) {
    this.app = app;
    this.control({
      'viewport buttongroup#adminMenu button#showPreferences': {
        click: this.showPreferences,
        scope: this
      },
      'preferencesPanel button#submit': {
        click: this.postPreferences,
        scope: this
      }
    });
  },

  showPreferences: function () {
    var viewportWindow = this.app.getViewportWindow();
    var contentsPanel = viewportWindow.down('panel#contentsPanel');

    contentsPanel.removeAll(true);
    contentsPanel.add({
      xtype: 'preferencesPanel'
    });

    Ext.Ajax.request({
      url: '/preferences',
      method: 'GET',
      success: function (connection) {
        var result = Ext.JSON.decode(connection.responseText);

        if (result.success) {
          var preferencesPanel = contentsPanel.down('preferencesPanel');
          var availableCheckbox = preferencesPanel.down('checkbox[name=available]');
          var noticeTextarea = preferencesPanel.down('textarea[name=notice]');

          availableCheckbox.setValue(result.preferences.available);
          noticeTextarea.setValue(result.preferences.notice);
        }
      },
      scope: this
    })
  },

  postPreferences: function () {
    var preferencesPanel = this.app.getViewportWindow().down('preferencesPanel');

    var available = preferencesPanel.down('checkbox[name=available]').getValue();
    var notice = preferencesPanel.down('textarea[name=notice]').getValue();

    Ext.Ajax.request({
      url: '/preferences',
      method: 'POST',
      params: {
        available: available,
        notice: notice
      },
      success: function(connection){
        var result = Ext.JSON.decode(connection.responseText);

        if (!result.success) {
          Ext.Msg.show({
            title: 'Error!',
            msg: result.message,
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
          })
        } else {
          Ext.Msg.show({
            title: 'Success',
            msg: result.message,
            icon: Ext.Msg.INFO,
            buttons: Ext.Msg.OK
          });
        }
      },
      failure: function(){
        Ext.Msg.show({
          title: 'Error!',
          msg: '환경설정 정보를 불러오는 중 오류가 발생하였습니다.',
          icon: Ext.Msg.ERROR,
          buttons: Ext.Msg.OK
        })
      },
      scope: this
    });
  }
});