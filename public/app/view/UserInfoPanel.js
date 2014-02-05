'use strict';

Ext.define('YdmcReservation.view.UserInfoPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.userInfoPanel',
  layout: 'fit',
  title: '선생님 정보 수정하기',
  closeAction: 'destroy',
  itemId: 'registerUser',
  items: [
    {
      xtype: 'form',
      frame: false,
      bodyPadding: 15,
      defaults: {
        anchor: '100%',
        xtype: 'textfield',
        labelWidth: 60
      },
      items: [
        {
          name: 'email',
          fieldLabel: 'E-Mail'
        },
        {
          name: 'password',
          inputType: 'password',
          fieldLabel: 'Password'
        },
        {
          name: 'schoolName',
          fieldLabel: '학교 이름'
        },
        {
          name: 'teacherName',
          fieldLabel: '선생님 이름'
        },
        {
          name: 'verified',
          xtype: 'hidden'
        },
        {
          name: 'admin',
          xtype: 'hidden'
        }
      ]
    }
  ],
  dockedItems: [
    {
      xtype: 'toolbar',
      dock: 'bottom',
      items: [
        {
          xtype: 'tbfill'
        },
        {
          xtype: 'button',
          itemId: 'submit',
          text: '저장',
          formBind: true
        },
        {
          xtype: 'button',
          itemId: 'cancel',
          text: '취소'
        }
      ]
    }
  ]
});