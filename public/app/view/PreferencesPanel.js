'use strict';

Ext.define('YdmcReservation.view.PreferencesPanel', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.preferencesPanel',
  itemId: 'preferencesPanel',

  title: '환경설정',
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
          name: 'available',
          fieldLabel: '접속 허용',
          xtype: 'checkbox'
        },
        {
          name: 'notice',
          fieldLabel: '공지사항',
          xtype: 'textarea'
        }
      ]
    },
    {
      xtype: 'toolbar',
      items: [
        {
          xtype: 'tbfill'
        },
        {
          itemId: 'initialize',
          text: '초기화 하기',
          xtype: 'button'
        },
        {
          xtype: 'button',
          itemId: 'submit',
          text: '저장',
          formBind: true
        }
      ]
    }
  ]
});