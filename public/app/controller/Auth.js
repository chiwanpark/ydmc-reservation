'use strict';

Ext.define('YdmcReservation.controller.Auth', {
  extend: 'Ext.app.Controller',

  views: ['Login', 'Viewport'],

  loginURL: '/user/login',
  logoutURL: '/user/logout',
  registerURL: '/user',

  init: function (app) {
    this.app = app;
    this.control({
      'login button#submit': {
        click: this.loginAction,
        scope: this
      },
      'login button#register': {
        click: this.showRegisterWindow,
        scope: this
      },
      'registerUser button#submit': {
        click: this.registerUserAction,
        scope: this
      },
      'registerUser button#cancel': {
        click: this.registerUserCancel,
        scope: this
      },
      'viewport button#logout': {
        click: this.logoutAction,
        scope: this
      },
      'viewport window#window': {
        afterrender: this.afterRenderWindow,
        scope: this
      }
    });
  },

  getLoginPanel: function () {
    return Ext.ComponentQuery.query('login')[0];
  },

  getRegisterUserPanel: function () {
    return Ext.ComponentQuery.query('registerUser')[0];
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

  showRegisterWindow: function () {
    var registerPanel = Ext.create('YdmcReservation.view.RegisterUser');
    registerPanel.center().show();
  },

  registerUserAction: function () {
    var registerPanel = this.getRegisterUserPanel();
    var formPanel = registerPanel.down('form');
    var email = formPanel.down('textfield[name=email]').getValue();
    var password = formPanel.down('textfield[name=password]').getValue();
    var teacherName = formPanel.down('textfield[name=teacherName]').getValue();
    var schoolName = formPanel.down('textfield[name=schoolName]').getValue();

    this.maskRegisterUserWindow();

    Ext.Ajax.request({
      method: 'POST',
      url: this.registerURL,
      params: {
        email: email,
        password: password,
        teacherName: teacherName,
        schoolName: schoolName
      },
      scope: this,
      success: this.registerUserSuccess,
      failure: this.registerUserFailure
    });
  },

  registerUserSuccess: function (connection) {
    this.unmaskRegisterUserWindow();

    var result = Ext.JSON.decode(connection.responseText);
    if (!result) {
      result = {};
      result.success = false;
      result.message = connection.responseText;
    }

    if (result.success) {
      Ext.Msg.show({
        title: 'Success!',
        msg: result.message,
        icon: Ext.Msg.INFO,
        buttons: Ext.Msg.OK
      });

      var registerPanel = this.getRegisterUserPanel();
      registerPanel.close();
      registerPanel.destroy();
    } else {
      Ext.Msg.show({
        title: 'Error!',
        msg: result.message,
        icon: Ext.Msg.ERROR,
        buttons: Ext.Msg.OK
      });
    }
  },

  registerUserFailure: function (connection) {
    this.unmaskRegisterUserWindow();

    Ext.Msg.show({
      title: 'Error!',
      msg: connection.responseText,
      icon: Ext.Msg.ERROR,
      buttons: Ext.Msg.OK
    });
  },

  registerUserCancel: function () {
    var registerPanel = this.getRegisterUserPanel();
    registerPanel.close();
    registerPanel.destroy();
  },

  logoutAction: function () {
    Ext.Ajax.request({
      method: 'GET',
      url: this.logoutURL,
      success: function () {
        location.href = '/';
      },
      failure: function () {
        location.href = '/';
      }
    });
  },

  afterRenderWindow: function(window) {
    var schoolName = this.app.loggedUser.schoolName;
    var teacherName = this.app.loggedUser.teacherName;
    var title = 'YDMC Reservation (' + schoolName + ', ' + teacherName + ')';

    window.setTitle(title);

    if (!this.app.loggedUser.admin) {
      window.down('buttongroup#adminMenu').setDisabled(true);
    }
  },

  maskLoginWindow: function () {
    var loginPanel = this.getLoginPanel();
    Ext.get(loginPanel.getEl()).mask('로그인 중 입니다... 잠시만 기다려주세요.', 'loading');
  },

  unmaskLoginWindow: function () {
    var loginPanel = this.getLoginPanel();
    Ext.get(loginPanel.getEl()).unmask();
  },

  maskRegisterUserWindow: function () {
    var registerPanel = this.getRegisterUserPanel();
    Ext.get(registerPanel.getEl()).mask('사용자 등록 중 입니다... 잠시만 기다려주세요.', 'loading');
  },

  unmaskRegisterUserWindow: function () {
    var registerPanel = this.getRegisterUserPanel();
    Ext.get(registerPanel.getEl()).unmask();
  }
});