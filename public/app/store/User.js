'use strict';

Ext.define('YdmcReservation.store.User', {
  extend: 'Ext.data.Store',
  autoLoad: true,
  proxy: {
    type: 'ajax',
    url: '/user',
    reader: {
      type: 'json',
      root: 'users',
      idProperty: '_id'
    }
  },
  fields: [
    '_id', 'teacherName', 'schoolName', 'password', 'email', 'phone',
    {
      name: 'admin',
      type: 'boolean'
    },
    {
      name: 'verified',
      type: 'boolean'
    }
  ]
});