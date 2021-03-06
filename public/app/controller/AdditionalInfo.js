'use strict';

Ext.define('YdmcReservation.controller.AdditionalInfo', {
  extend: 'Ext.app.Controller',

  getLastFileURL: '/file/last',
  getLastCommentURL: '/comment/last',
  postFileURL: '/file',
  postCommentURL: '/comment',

  views: ['Viewport', 'ApplicationPanel'],

  init: function (app) {
    this.app = app;
    this.control({
      'viewport buttongroup#userMenu button#addInformation': {
        click: this.showAdditionalInfo,
        scope: this
      },
      'panel#contentsPanel form#commentForm button#submit': {
        click: this.uploadComment,
        scope: this
      },
      'panel#contentsPanel form#fileForm button#submit': {
        click: this.uploadFile,
        scope: this
      }
    });
  },

  showAdditionalInfo: function () {
    this.getLastFileInfo();
  },

  showPanel: function () {
    var viewportWindow = this.app.getViewportWindow();
    var contentsPanel = viewportWindow.down('panel#contentsPanel');

    var applicationPanel = Ext.create('YdmcReservation.view.ApplicationPanel');

    if (this.comment) {
      applicationPanel.down('#comment').setValue(this.comment.comment);
    }

    var fileInfo = '파일을 올려주세요!';
    if (this.fileInfo) {
      fileInfo = '기존 파일: ' + this.fileInfo.originName + ' (' + this.fileInfo.registered + ')';
    }
    applicationPanel.down('#fileInfo').setValue(fileInfo);

    contentsPanel.removeAll(true);
    contentsPanel.add(applicationPanel);
  },

  lastFileInfoArrived: function (connection) {
    var result = Ext.JSON.decode(connection.responseText);
    if (!result) {
      result = {};
      result.success = false;
      result.message = connection.responseText;
    }

    if (result.success) {
      this.fileInfo = result.file;
    }

    this.getLastComment();
  },

  lastFileInfoFailed: function () {
    this.fileInfo = undefined;
    this.getLastComment();
  },

  getLastFileInfo: function () {
    Ext.Ajax.request({
      method: 'GET',
      url: this.getLastFileURL,
      success: this.lastFileInfoArrived,
      failure: this.lastFileInfoFailed,
      scope: this
    });
  },

  getLastComment: function () {
    Ext.Ajax.request({
      method: 'GET',
      url: this.getLastCommentURL,
      success: this.lastCommentInfoArrived,
      failure: this.lastCommentInfoFailed,
      scope: this
    });
  },

  lastCommentInfoArrived: function (connection) {
    var result = Ext.JSON.decode(connection.responseText);
    if (!result) {
      result = {};
      result.success = false;
      result.message = connection.responseText;
    }

    if (result.success) {
      this.comment = result.comment;
    }
    this.showPanel();
  },

  lastCommentInfoFailed: function () {
    this.comment = '';
    this.showPanel();
  },

  uploadFile: function () {
    var form = Ext.ComponentQuery.query('form#fileForm')[0];
    if (form.isValid()) {
      form.submit({
        url: this.postFileURL,
        waitMsg: '파일을 업로드 중입니다. 기다려 주세요.',
        success: function (form, action) {
          if (action.result.success) {
            Ext.Msg.show({
              title: '파일 업로드',
              msg: '파일 업로드에 성공했습니다.<br/>' + action.result.fileInfo.originName,
              icon: Ext.Msg.INFO,
              buttons: Ext.Msg.OK
            });
          } else {
            Ext.Msg.show({
              title: 'Error!',
              msg: action.result.message,
              icon: Ext.Msg.ERROR,
              buttons: Ext.Msg.OK
            });
          }
        },
        failure: function () {
          Ext.Msg.show({
            title: 'Error!',
            msg: '파일 업로드에 실패했습니다.',
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
          });
        }
      })
    }
  },

  uploadComment: function () {
    var form = Ext.ComponentQuery.query('form#commentForm')[0];
    var comment = form.down('textarea').getValue();

    Ext.Ajax.request({
      url: this.postCommentURL,
      method: 'POST',
      params: {
        comment: comment
      },
      scope: this,
      success: function (connection) {
        var result = Ext.JSON.decode(connection.responseText);
        if (!result) {
          result = {};
          result.success = false;
          result.message = connection.responseText;
        }

        if (result.success) {
          Ext.Msg.show({
            title: '코멘트',
            msg: '코멘트를 잘 등록하였습니다.',
            icon: Ext.Msg.INFO,
            buttons: Ext.Msg.OK
          })
        } else {
          Ext.Msg.show({
            title: 'Error!',
            msg: result.message,
            icon: Ext.Msg.ERROR,
            buttons: Ext.Msg.OK
          });
        }
      },
      failure: function (connection) {
        Ext.Msg.show({
          title: 'Error!',
          msg: '코멘트 등록에 실패했습니다. ' + connection.responseText,
          icon: Ext.Msg.ERROR,
          buttons: Ext.Msg.OK
        });
      }
    })
  }
});