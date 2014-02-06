'use strict';

Ext.define('YdmcReservation.view.BookWindow', {
  extend: 'Ext.window.Window',
  alias: 'widget.bookWindow',
  requires: ['YdmcReservation.view.BookInfoPanel'],
  layout: 'fit',
  closable: false,
  modal: true,
  items: {
    xtype: 'bookInfoPanel'
  }
});