'use strict';

Ext.define('YdmcReservation.store.Book', {
  extend: 'Extensible.calendar.data.MemoryEventStore',

  autoLoad: true,
  autoMsg: false,

  proxy: {
    type: 'ajax',
    url: '/book/summary',
    reader: {
      type: 'json',
      root: 'books'
    }
  },

  onProxyLoad: function (operation) {
    var me = this;
    var resultSet = operation.getResultSet();
    var successful = operation.wasSuccessful();

    var records = operation.getRecords();

    if (resultSet) {
      me.totalCount = resultSet.total;
    }
    if (successful) {
      me.loadRecords(records, operation);
    }
    me.loading = false;
    me.fireEvent('load', me, records, successful);
  }
});