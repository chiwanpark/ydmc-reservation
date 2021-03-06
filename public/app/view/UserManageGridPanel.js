'use strict';

Ext.define('YdmcReservation.view.UserManageGridPanel', {
  extend: 'Ext.grid.Panel',
  alias: 'widget.userManageGridPanel',

  requires: ['Ext.grid.plugin.CellEditing'],

  title: '사용자 관리',
  border: false,


  plugins: [Ext.create('Ext.grid.plugin.CellEditing', {clicksToEdit: 1})],

  tbar: {
    xtype: 'toolbar',
    items: [
      {
        xtype: 'button',
        itemId: 'saveUsers',
        text: '변경 사항 저장하기'
      },
      {
        xtype: 'button',
        itemId: 'rejectChangeUsers',
        text: '변경 사항 무시하기'
      }
    ]
  },

  columns: [
    {
      text: '고유 번호',
      dataIndex: '_id',
      flex: 2,
      readonly: true
    },
    {
      text: '선생님 이름',
      dataIndex: 'teacherName',
      flex: 1,
      editor: {
        xtype: 'textfield'
      }
    },
    {
      text: '학교 이름',
      dataIndex: 'schoolName',
      flex: 2,
      editor: {
        xtype: 'textfield'
      }
    },
    {
      text: 'E-Mail 주소',
      dataIndex: 'email',
      flex: 3,
      editor: {
        xtype: 'textfield'
      }
    },
    {
      text: '휴대전화 번호',
      dataIndex: 'phone',
      flex: 1,
      editor: {
        xtype: 'textfield'
      }
    },
    {
      text: '관리자',
      dataIndex: 'admin',
      flex: 0.5,
      xtype: 'checkcolumn'
    },
    {
      text: '승인됨',
      dataIndex: 'verified',
      flex: 0.5,
      xtype: 'checkcolumn'
    },
    {
      text: '삭제',
      xtype: 'actioncolumn',
      align: 'center',
      width: 50,
      items: [{
        itemId: 'deleteBtn',
        icon: 'http://try.sencha.com/extjs/4.0.7/docs/Ext.grid.column.Action.1/app/resources/images/delete.png',
        tooltip: '삭제하기'
      }]
    }
  ]
});