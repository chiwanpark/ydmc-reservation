'use strict';

Ext.define('YdmcReservation.controller.Book', {
  extend: 'Ext.app.Controller',

  bookURL: '/book',

  views: ['Viewport', 'BookPanel'],

  init: function (app) {
    this.app = app;
    this.control({
      'viewport buttongroup#userMenu button#doBook': {
        click: this.showBookPanel,
        scope: this
      },
      'viewport bookPanel': {
        dayclick: this.showBookWindow,
        editdetails: this.blockEvent,
        eventadd: this.blockEvent,
        eventcancel: this.blockEvent,
        eventclick: this.editBookWindow,
        eventdelete: this.blockEvent,
        eventmove: this.blockEvent,
        eventresize: this.blockEvent,
        eventupdate: this.blockEvent,
        initdrag: this.blockEvent,
        rangeselect: this.blockEvent,
        scope: this
      },
      '#newBookWindow bookInfoPanel button#submit': {
        click: this.addBookAction,
        scope: this
      },
      '#editBookWindow bookInfoPanel button#deleteBook': {
        click: this.deleteBookAction,
        scope: this
      },
      'bookInfoPanel button#cancel': {
        click: this.closeBookWindow,
        scope: this
      }
    });
  },

  isHoliday: function (date) {
    if (!this.holidayStore) {
      this.holidayStore = Ext.create('YdmcReservation.store.Holiday');
      this.holidayStore.load();
    }

    var dateString = Ext.Date.format(date, 'Y-m-d');

    var filtered = this.holidayStore.queryBy(function (raw) {
      var startDateString = Ext.Date.format(raw.data.StartDate, 'Y-m-d');
      return startDateString === dateString;
    });

    return filtered.length > 0;
  },

  addBookAction: function () {
    var bookWindow = this.getBookWindow();
    var date = bookWindow.down('textfield[name=date]').getValue();
    var preference = bookWindow.down('combo[name=preference]').getValue();

    this.maskBookInfoPanel();

    Ext.Ajax.request({
      method: 'POST',
      url: this.bookURL,
      params: {
        date: date,
        preference: preference
      },
      scope: this,
      success: this.bookActionSuccess,
      failure: this.bookActionFailure
    });
  },

  deleteBookAction: function () {
    var bookWindow = this.getBookWindow();
    var id = bookWindow.down('hidden[name=id]').getValue();

    this.maskBookInfoPanel();

    Ext.Ajax.request({
      method: 'DELETE',
      url: this.bookURL + '/' + id,
      success: this.bookActionSuccess,
      failure: this.bookActionFailure,
      scope: this
    });
  },

  bookActionSuccess: function (connection) {
    this.unmaskBookInfoPanel();

    var result = Ext.JSON.decode(connection.responseText);
    if (!result) {
      result = {};
      result.success = false;
      result.message = connection.responseText;
    }

    if (result.success) {
      var bookWindow = this.getBookWindow();
      bookWindow.close();
      bookWindow.destroy();

      Ext.ComponentQuery.query('bookPanel')[0].getActiveView().refresh(true);

      Ext.Msg.show({
        title: 'Success!',
        msg: result.message,
        icon: Ext.Msg.INFO,
        buttons: Ext.Msg.OK,
        scope: this
      });
    } else {
      Ext.Msg.show({
        title: 'Error!',
        msg: result.message,
        icon: Ext.Msg.ERROR,
        buttons: Ext.Msg.OK
      });
    }
  },

  bookActionFailure: function (connection) {
    this.unmaskBookInfoPanel();

    Ext.Msg.show({
      title: 'Error!',
      msg: connection.responseText,
      icon: Ext.Msg.ERROR,
      buttons: Ext.Msg.OK
    });
  },

  maskBookInfoPanel: function () {
    var bookInfoPanel = this.getBookWindow().down('bookInfoPanel');
    Ext.get(bookInfoPanel.getEl()).mask('예약 등록 중 입니다... 잠시만 기다려주세요.', 'loading');
  },

  unmaskBookInfoPanel: function () {
    var bookInfoPanel = this.getBookWindow().down('bookInfoPanel');
    Ext.get(bookInfoPanel.getEl()).unmask();
  },

  showBookWindow: function (calendarPanel, date) {
    if (this.isHoliday(date)) {
      Ext.Msg.show({
        title: 'Error!',
        msg: '해당 날짜는 예약 금지일 입니다.',
        icon: Ext.Msg.ERROR,
        buttons: Ext.Msg.OK
      });

      return false;
    }

    var bookWindow = Ext.create('YdmcReservation.view.BookWindow', {
      itemId: 'newBookWindow',
      title: '예약하기'
    });

    bookWindow.down('textfield[name=schoolName]').setValue(this.app.loggedUser.schoolName);
    bookWindow.down('textfield[name=date]').setValue(Ext.Date.format(date, 'Y-m-d'));
    bookWindow.center().show();
    return false;
  },

  editBookWindow: function (calendarPanel, record) {
    if (record.data.CalendarId == 4) {
      return false;
    }

    if (record.raw.register !== this.app.loggedUser._id) {
      return false;
    }

    var bookWindow = Ext.create('YdmcReservation.view.BookWindow', {
      itemId: 'editBookWindow',
      title: '예약 삭제하기'
    });

    var toolbar = bookWindow.down('toolbar');
    toolbar.removeAll(true);
    toolbar.add([
      {
        xtype: 'tbfill'
      },
      {
        xtype: 'button',
        itemId: 'deleteBook',
        text: '이 예약 삭제하기',
        formBind: true
      },
      {
        xtype: 'button',
        itemId: 'cancel',
        text: '취소'
      }
    ]);

    var preferenceComponent = bookWindow.down('combo[name=preference]');
    var schoolNameComponent = bookWindow.down('textfield[name=schoolName]');
    var dateComponent = bookWindow.down('textfield[name=date]');

    bookWindow.down('hidden[name=id]').setValue(record.raw._id);
    preferenceComponent.setValue(record.data.CalendarId);
    schoolNameComponent.setValue(this.app.loggedUser.schoolName);
    dateComponent.setValue(Ext.Date.format(record.data.StartDate, 'Y-m-d'));

    preferenceComponent.setReadOnly(true);
    schoolNameComponent.setReadOnly(true);
    dateComponent.setReadOnly(true);
    bookWindow.center().show();

    return false;
  },

  closeBookWindow: function () {
    var bookWindow = this.getBookWindow();

    bookWindow.close();
    bookWindow.destroy();
  },

  getBookWindow: function () {
    return Ext.ComponentQuery.query('bookWindow')[0];
  },

  showBookPanel: function () {
    var viewportWindow = this.app.getViewportWindow();
    var contentsPanel = viewportWindow.down('panel#contentsPanel');

    contentsPanel.removeAll(true);

    this.bookStore = Ext.create('YdmcReservation.store.Book');
    this.bookCalendarStore = Ext.create('YdmcReservation.store.BookCalendar');
    contentsPanel.add({
      xtype: 'bookPanel',
      calendarStore: this.bookCalendarStore,
      eventStore: this.bookStore
    });
  },

  blockEvent: function () {
    return false;
  }
});