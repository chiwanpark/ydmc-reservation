'use strict';

Ext.define('YdmcReservation.view.Login', {
  extend: 'Ext.window.Window',
  alias: 'widget.login',
  autoShow: true,
  height: 170,
  width: 360,
  layout: 'fit',
  title: 'Login',
  closeAction: 'hide',
  closable: false,
  itemId: 'login',
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
          xtype: 'button',
          itemId: 'register',
          text: '가입하기'
        },
        {
          xtype: 'tbfill'
        },
        {
          xtype: 'button',
          itemId: 'submit',
          formBind: true,
          text: '로그인'
        }
      ]
    }
  ]
});