'use strict';

Ext.Loader.setConfig({
  enable: true,
  disableCaching: true,
  paths: {
    'YdmcReseravtion': '/app',
    "Extensible": "/lib/extensible/src"
  }
});

Ext.application({
  name: 'YdmcReservation',
  appFolder: '/app',
  requires: [
    'YdmcReservation.view.Login'
  ],
  views: [
    'Login'
  ],
  controllers: [
    'YdmcReservation.controller.Auth'
  ],
  launch: function () {
    var loginView = Ext.create('YdmcReservation.view.Login');

    loginView.center().show();
  }
});
