'use strict';

Ext.define('YdmcReservation.store.Holiday', {
  extend: 'YdmcReservation.store.Event',

  proxy: {
    type: 'ajax',
    url: '/holiday',
    reader: {
      type: 'json',
      root: 'holidays'
    }
  }
});