'use strict';

Ext.define('YdmcReservation.store.Event', {
  extend: 'Extensible.calendar.data.MemoryEventStore',

  autoLoad: true,
  autoMsg: false,

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