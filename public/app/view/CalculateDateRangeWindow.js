'use strict';

Ext.define('YdmcReservation.view.CalculateDateRangeWindow', {
  extend: 'Ext.window.Window',
  alias: 'widget.calculateDateRangeWindow',
  layout: 'fit',
  title: '계산 구간 결정하기',
  closeAction: 'destroy',
  modal: true,
  itemId: 'calculateDateRangeWindow',
  items: [
    {
      xtype: 'form',
      frame: false,
      bodyPadding: 15,
      defaults: {
        anchor: '100%',
        format: 'Y-m-d',
        labelWidth: 60
      },
      items: [
        {
          name: 'rangeStart',
          xtype: 'datefield',
          fieldLabel: '시작'
        },
        {
          name: 'rangeEnd',
          xtype: 'datefield',
          fieldLabel: '끝'
        }
      ]
    }
  ],
  dockedItems: [
    {
      xtype: 'toolbar',
      dock: 'bottom',
      items: [
        {
          xtype: 'tbfill'
        },
        {
          xtype: 'button',
          itemId: 'submit',
          text: '계산',
          formBind: true
        },
        {
          xtype: 'button',
          itemId: 'cancel',
          text: '취소'
        }
      ]
    }
  ]
});