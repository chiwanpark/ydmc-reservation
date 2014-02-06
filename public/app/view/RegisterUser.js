'use strict';

Ext.define('YdmcReservation.view.RegisterUser', {
  extend: 'Ext.window.Window',
  alias: 'widget.registerUser',
  title: '가입하기',
  height: 260,
  width: 360,
  resizable: false,
  draggable: false,
  layout: 'fit',
  items: {
    xtype: 'userInfoPanel',
    header: false
  }
});