'use strict';

Ext.Loader.setConfig({
  enable: true,
  disableCaching: true,
  paths: {
    "Extensible": "/lib/extensible/src"
  }
});

Ext.application({
  name: 'YdmcReservation',
  appFolder: '/app',
  autoCreateViewport: true,
  requires: [
    'YdmcReservation.view.Login'
  ],
  views: [
    'Login'
  ],
  controllers: [
  ],
  launch: function () {
    var loginView = Ext.create('YdmcReservation.view.Login');

    loginView.center().show();
  }
});
