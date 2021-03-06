'use strict';

Ext.define('YdmcReservation.view.Viewport', {
  extend: 'Ext.container.Viewport',
  layout: {
    type: 'fit',
    padding: 5
  },
  defaults: {
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
      layout: {
        type: 'border',
        padding: 5
      },
      defaults: {
        margin: 5
      },
      items: [
        {
          xtype: 'panel',
          region: 'west',
          title: '메뉴',
          width: 200,
          minWidth: 175,
          maxWidth: 400,
          collapsible: true,
          animCollapse: true,
          margins: '0 0 0 5',
          layout: {
            type: 'vbox',
            align: 'stretch',
            padding: 5
          },
          items: [
            {
              xtype: 'buttongroup',
              title: '관리자 메뉴',
              itemId: 'adminMenu',
              margin: 5,
              defaults: {
                margin: 3
              },
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
                  itemId: 'showManageWorkingDays',
                  text: '예약 가능일 관리'
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
              margin: 5,
              defaults: {
                margin: 3
              },
              columns: 1,
              items: [
                {
                  xtype: 'button',
                  itemId: 'doBook',
                  text: '예약하기 (새로고침)'
                },
                {
                  xtype: 'button',
                  itemId: 'addInformation',
                  text: '신청서 제출'
                }
              ]
            },
            {
              xtype: 'tbfill'
            },
            {
              xtype: 'button',
              itemId: 'showUserInfo',
              margin: 3,
              text: '선생님 정보 수정하기'
            },
            {
              xtype: 'button',
              itemId: 'logout',
              margin: 3,
              text: '로그아웃'
            }
          ]
        },
        {
          xtype: 'panel',
          collapsible: false,
          animCollapse: false,
          region: 'center',
          itemId: 'contentsPanel',
          layout: {type: 'fit'},
          items: {
            xtype: 'panel'
          }
        }
      ]
    }
  ]
});