'use strict';

Ext.define('YdmcReservation.view.BookInfoPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.bookInfoPanel',
  items: [
    {
      xtype: 'form',
      frame: false,
      bodyPadding: 15,
      defaults: {
        anchor: '100%',
        xtype: 'textfield',
        labelWidth: 60
      },
      items: [
        {
          xtype: 'hidden',
          name: 'id'
        },
        {
          name: 'preference',
          xtype: 'combo',
          fieldLabel: '선호',
          displayField: 'label',
          valueField: 'value',
          store: Ext.create('Ext.data.Store', {
            fields: ['label', 'value'],
            data: [
              {
                label: '1순위',
                value: 1
              },
              {
                label: '2순위',
                value: 2
              },
              {
                label: '3순위',
                value: 3
              }
            ]
          })
        },
        {
          name: 'schoolName',
          fieldLabel: '학교 이름'
        },
        {
          name: 'date',
          fieldLabel: '날짜'
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
          text: '저장',
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