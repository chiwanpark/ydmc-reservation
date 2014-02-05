'use strict';

Ext.define('YdmcReservation.view.RegisterUser', {
  extend: 'Ext.window.Window',
  alias: 'widget.registerUser',
  height: 200,
  width: 360,
  modal: true,
  resizable: false,
  draggable: false,
  layout: 'fit',
  title: 'Register User',
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
          text: '가입하기',
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