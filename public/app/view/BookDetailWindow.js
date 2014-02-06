'use strict';

Ext.define('YdmcReservation.view.BookDetailWindow', {
  extend: 'Ext.window.Window',
  width: 450,
  height: 280,
  closable: true,
  closeAction: 'destroy',
  modal: true,
  layout: 'fit',

  items: [
    {
      xtype: 'form',
      readOnly: true,
      bodyPadding: 15,
      defaults: {
        anchor: '100%',
        xtype: 'textfield',
        labelWidth: 60
      },
      items: [
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
        },
        {
          name: 'registered',
          fieldLabel: '등록 날짜'
        },
        {
          name: 'file',
          fieldLabel: '첨부파일'
        },
        {
          name: 'comment',
          xtype: 'textarea',
          fieldLabel: '코멘트'
        }
      ]
    }
  ]
});