'use strict';

Ext.define('YdmcReservation.view.Viewport', {
  extend: 'Ext.container.Viewport',
  layout: {
    type: 'fit',
    padding: 5
  },
  default: {
    split: false,
    collapsible: false
  },
  items: [
    {
      xtype: 'window',
      itemId: 'window',
      maximized: true,
      resizable: false,
      draggable: false,
      autoShow: true,
      closable: false,
      layout: 'fit',
      items: [
        {
          xtype: 'panel',
          itemId: 'contentsPanel',
          layout: {type: 'fit'},
          items: {
            xtype: 'panel'
          }
        }
      ],
      lbar: {
        xtype: 'toolbar',
        items: [
          {
            xtype: 'buttongroup',
            title: '관리자 메뉴',
            itemId: 'adminMenu',
            layout: {
              type: 'vbox',
              align: 'stretch'
            },
            columns: 1,
            items: [
              {
                xtype: 'button',
                itemId: 'showManageUsers',
                text: '사용자 관리'
              },
              {
                xtype: 'button',
                itemId: 'showPreferences',
                text: '환경설정'
              },
              {
                xtype: 'button',
                itemId: 'showManageHolidays',
                text: '예약 금지일 관리'
              },
              {
                xtype: 'button',
                itemId: 'showResults',
                text: '배정 결과 확인'
              }
            ]
          },
          {
            xtype: 'buttongroup',
            title: '사용자 메뉴',
            itemId: 'userMenu',
            layout: {
              type: 'vbox',
              align: 'stretch'
            },
            columns: 1,
            items: [
              {
                xtype: 'button',
                itemId: 'doBook',
                text: '예약하기'
              },
              {
                xtype: 'button',
                itemId: 'addInformation',
                text: '추가 정보 입력'
              }
            ]
          },
          {
            xtype: 'tbfill'
          },
          {
            xtype: 'button',
            itemId: 'showUserInfo',
            text: '선생님 정보 수정하기'
          },
          {
            xtype: 'button',
            itemId: 'logout',
            text: '로그아웃'
          }
        ]
      }
    }
  ]
});