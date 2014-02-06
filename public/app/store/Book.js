'use strict';

Ext.define('YdmcReservation.store.Book', {
  extend: 'YdmcReservation.store.Event',

  proxy: {
    type: 'ajax',
    url: '/book/summary',
    reader: {
      type: 'json',
      root: 'books'
    }
  }
});