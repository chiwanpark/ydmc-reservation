'use strict';

Ext.define('YdmcReservation.controller.AdditionalInfo', {
  extend: 'Ext.app.Controller',

  getLastFileURL: '/file/last',
  getLastCommentURL: '/comment/last',
  postFileURL: '/file',

  views: ['Viewport'],

  init: function (app) {
    this.app = app;
    this.control({
      'viewport buttongroup#userMenu button#addInformation': {
        click: this.showAdditionalInfo,
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

    contentsPanel.removeAll(true);
    contentsPanel.add({
      xtype: 'panel',
      itemId: 'additionalInfoPanel',
      items: [
        {
          xtype: 'form',
          itemId: 'fileForm',
          title: '파일 첨부하기',
          defaults: {
            labelWidth: 60,
            anchor: '100%'
          },
          items: [
            {
              xtype: 'displayfield',
              value: this.fileInfo
                ? '기존 파일: ' + this.fileInfo.originName + ' (' + this.fileInfo.registered + ')'
                : '파일을 올려주세요.'
            },
            {
              xtype: 'filefield',
              name: 'attachment',
              fieldLabel: '첨부파일',
              buttonText: '찾기',
              allowBlank: false
            }
          ],
          bbar: {
            items: [
              {
                xtype: 'tbfill'
              },
              {
                xtype: 'button',
                formBind: true,
                text: '파일 올리기',
                itemId: 'submit'
              }
            ]
          }
        },
        {
          xtype: 'form',
          defaults: {
            labelWidth: 60,
            anchor: '100%'
          },
          items: [
            {
              xtype: 'textarea',
              fieldLabel: '추가 코멘트',
              name: 'comment',
              value: this.comment
                ? this.comment
                : ''
            }
          ],
          bbar: {
            items: [
              {
                xtype: 'tbfill'
              },
              {
                xtype: 'button',
                formBind: true,
                text: '코멘트 올리기'
              }
            ]
          }
        }
      ]
    });
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
      this.fileInfo = result.comment;
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
  }
});