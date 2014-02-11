'use strict';

Ext.define('YdmcReservation.store.WorkingDay', {
  extend: 'YdmcReservation.store.Event',

  proxy: {
    type: 'ajax',
    url: '/workingday',
    reader: {
      type: 'json',
      root: 'workingdays'
    }
  }
});