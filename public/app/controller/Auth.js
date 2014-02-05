'use strict';

Ext.define('YdmcReservation.controller.Auth', {
  extend: 'Ext.app.Controller',

  views: ['Login'],

  loginURL: '/user/login',

  init: function (app) {
    this.app = app;
    this.control({
      'login button#submit': {
        click: this.loginAction,
        scope: this
      }
    });
  },

  getLoginPanel: function () {
    return Ext.ComponentQuery.query('login')[0];
  },

  loginAction: function () {
    var loginPanel = this.getLoginPanel();
    var formPanel = loginPanel.down('form');
    var email = formPanel.down('textfield[name=email]').getValue();
    var password = formPanel.down('textfield[name=password]').getValue();

    this.maskLoginWindow();

    Ext.Ajax.request({
      method: 'POST',
      url: this.loginURL,
      params: {
        email: email,
        password: password
      },
      scope: this,
      success: this.loginSuccess,
      failure: this.loginFailure
    });
  },

  loginSuccess: function (connection) {
    this.unmaskLoginWindow();

    var result = Ext.JSON.decode(connection.responseText);
    if (!result) {
      result = {};
      result.success = false;
      result.message = connection.responseText;
    }

    if (result.success) {
      var loginPanel = this.getLoginPanel();
      loginPanel.close();

      this.app.loggedUser = result.instance;

      Ext.create('YdmcReservation.view.Viewport');
    } else {
      Ext.Msg.show({
        title: 'Error!',
        msg: result.message,
        icon: Ext.Msg.ERROR,
        buttons: Ext.Msg.OK
      });
    }
  },

  loginFailure: function (connection) {
    this.unmaskLoginWindow();

    Ext.Msg.show({
      title: 'Error!',
      msg: connection.responseText,
      icon: Ext.Msg.ERROR,
      buttons: Ext.Msg.OK
    });
  },

  maskLoginWindow: function () {
    var loginPanel = this.getLoginPanel();
    Ext.get(loginPanel.getEl()).mask('로그인 중 입니다... 잠시만 기다려주세요.', 'loading');
  },

  unmaskLoginWindow: function () {
    var loginPanel = this.getLoginPanel();
    Ext.get(loginPanel.getEl()).unmask();
  }
});