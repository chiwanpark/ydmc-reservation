'use strict';

Ext.define('YdmcReservation.view.ApplicationPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.applicationPanel',
  items: [
    {
      xtype: 'form',
      itemId: 'fileForm',
      title: '파일 첨부하기',
      bodyPadding: 15,
      defaults: {
        labelWidth: 70,
        margin: 5,
        anchor: '100%'
      },
      items: [
        {
          xtype: 'displayfield',
          itemId: 'fileInfo'
        },
        {
          xtype: 'filefield',
          name: 'attachment',
          fieldLabel: '첨부파일',
          buttonText: '찾기',
          allowBlank: false
        }
      ],
      bbar: {
        items: [
          {
            xtype: 'tbfill'
          },
          {
            xtype: 'button',
            formBind: true,
            text: '파일 올리기',
            itemId: 'submit'
          }
        ]
      }
    },
    {
      xtype: 'form',
      itemId: 'commentForm',
      bodyPadding: 15,
      defaults: {
        labelWidth: 70,
        margin: 5,
        anchor: '100%'
      },
      items: [
        {
          xtype: 'textarea',
          itemId: 'comment',
          fieldLabel: '추가 코멘트',
          name: 'comment'
        }
      ],
      bbar: {
        items: [
          {
            xtype: 'tbfill'
          },
          {
            xtype: 'button',
            itemId: 'submit',
            formBind: true,
            text: '코멘트 올리기'
          }
        ]
      }
    }
  ]
});