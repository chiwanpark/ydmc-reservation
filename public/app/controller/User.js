'use strict';

Ext.define('YdmcReservation.controller.User', {
  extend: 'Ext.app.Controller',

  views: ['Viewport', 'UserManageGridPanel', 'UserInfoPanel'],

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
      },
      'viewport button#showUserInfo': {
        click: this.showUserInfo,
        scope: this
      },
      'viewport userInfoPanel button#submit': {
        click: this.updateUserInfo,
        scope: this
      }
    });
  },

  showUserInfo: function () {
    var viewportWindow = this.app.getViewportWindow();
    var contentsPanel = viewportWindow.down('panel#contentsPanel');

    contentsPanel.removeAll(true);
    contentsPanel.add({xtype: 'userInfoPanel'});

    contentsPanel.down('textfield[name=email]').setValue(this.app.loggedUser.email);
    contentsPanel.down('textfield[name=schoolName]').setValue(this.app.loggedUser.schoolName);
    contentsPanel.down('textfield[name=teacherName]').setValue(this.app.loggedUser.teacherName);
    contentsPanel.down('hidden[name=admin]').setValue(this.app.loggedUser.admin);
    contentsPanel.down('hidden[name=verified]').setValue(this.app.loggedUser.verified);
  },

  updateUserInfo: function () {
    var userInfoPanel = this.getUserInfoPanel();
    var formPanel = userInfoPanel.down('form');
    var email = formPanel.down('textfield[name=email]').getValue();
    var password = formPanel.down('textfield[name=password]').getValue();
    var teacherName = formPanel.down('textfield[name=teacherName]').getValue();
    var schoolName = formPanel.down('textfield[name=schoolName]').getValue();
    var admin = formPanel.down('hidden[name=admin]').getValue();
    var verified = formPanel.down('hidden[name=verified]').getValue();

    this.maskUserInfoPanel();

    Ext.Ajax.request({
      method: 'PUT',
      url: this.userURL + '/' + this.app.loggedUser._id,
      params: {
        email: email,
        password: password,
        teacherName: teacherName,
        schoolName: schoolName,
        verified: verified,
        admin: admin
      },
      scope: this,
      success: this.updateUserSuccess,
      failure: this.updateUserFailure
    });
  },

  getUserInfoPanel: function () {
    return Ext.ComponentQuery.query('userInfoPanel')[0];
  },

  maskUserInfoPanel: function () {
    var userInfoPanel = this.getUserInfoPanel();
    Ext.get(userInfoPanel.getEl()).mask('사용자 등록 중 입니다... 잠시만 기다려주세요.', 'loading');
  },

  unmaskUserInfoPanel: function () {
    var userInfoPanel = this.getUserInfoPanel();
    Ext.get(userInfoPanel.getEl()).unmask();
  },

  updateUserSuccess: function (connection) {
    this.unmaskUserInfoPanel();

    var result = Ext.JSON.decode(connection.responseText);
    if (!result) {
      result = {};
      result.success = false;
      result.message = connection.responseText;
    }

    if (result.success) {
      var userInfoPanel = this.getUserInfoPanel();
      userInfoPanel.close();
      userInfoPanel.destroy();

      Ext.Msg.show({
        title: 'Success!',
        msg: result.message,
        icon: Ext.Msg.INFO,
        buttons: Ext.Msg.OK,
        fn: function () {
          location.href = '/';
        },
        scope: this
      });
    } else {
      Ext.Msg.show({
        title: 'Error!',
        msg: result.message,
        icon: Ext.Msg.ERROR,
        buttons: Ext.Msg.OK
      });
    }
  },

  updateUserFailure: function (connection) {
    this.unmaskUserInfoPanel();

    Ext.Msg.show({
      title: 'Error!',
      msg: connection.responseText,
      icon: Ext.Msg.ERROR,
      buttons: Ext.Msg.OK
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