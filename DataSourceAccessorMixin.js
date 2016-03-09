'use strict';

var React = require('react-native');
var update = React.addons.update;

/**
 * mixin插件，用于对listview的dataSource进行数据操作，如设置多行，添加多行，添加一行，删除一行
 * 我们约定使用 this.state.dataSource 来作为 listview的dataSource
 */
module.exports = {
  // 获得id的字段
  idField: function(){
    if(this._idField){
      if(typeof this._idField == 'function'){ // 函数
        return this._idField();
      }
      return this._idField;
    }
    return 'id';
  },
  /**
   * 将数组转化为row，并合并参数rows与rowIds，但不改变参数
   * @param arr 要合并的数据
   * @param rows 旧的行的哈希
   * @param rowIds 旧的行id
   * @param append 是否在后面追加, 否则在前面插入
   */
  arr2rows: function(arr, rows, rowIds, append = true){
    // 1 将数组转化为row
    var tempRows = {},
        tempRowIds = [];
    arr.map((item, i) => {
      var id = item ? item[this.idField()] : -1; // 特殊的id： -1，表示没有数据
      tempRows[id] = item;
      if(append){ // 在后面追加
        tempRowIds.push(id);
      }else{ // 在前面插入
        tempRowIds.unshift(id);
      }
    });
    // 2 合并参数rows与rowIds
    var newRows = update(rows, {$merge: tempRows});
    var newRowIds = update(rowIds, {$push: tempRowIds});
    return [newRows, newRowIds];
  },
  // 是否为空
  isEmpty: function(){
    return this.rowCount() == 0;
  },
  // 获得行数
  rowCount: function(){
    return this.rowIds().length;
  },
  // 获得所有行
  rows: function() {
      var result = this.state.dataSource && this.state.dataSource._dataBlob && this.state.dataSource._dataBlob.s1;
      return result ? result : {};
  },
  // 获得所有行id
  rowIds: function(){
    var result = this.state.dataSource && this.state.dataSource.rowIdentities && this.state.dataSource.rowIdentities[0];
    return result ? result : [];
  },
  // 设置行
  setRows: function(arr, otherState = {}, callback = null){
    var [rows, rowIds] = this.arr2rows(arr, {}, []);
    var state = update({dataSource: this.state.dataSource.cloneWithRows(rows, rowIds)}, {$merge: otherState})
    this.setState(state, callback);
    // console.log('setRows: ' + rowIds.length)
    // console.log(arr)
    // console.log(rowIds)
  },
  // 在后面追加多行
  appendRows: function(arr, otherState = {}, callback = null){
    var [newRows, newRowIds] = this.arr2rows(arr, this.rows(), this.rowIds());
    var state = update({dataSource: this.state.dataSource.cloneWithRows(newRows, newRowIds)}, {$merge: otherState});
    this.setState(state, callback);
    // console.log('appendRows: ' + newRowIds.length)
    // console.log(arr)
    // console.log(newRowIds)
  },
  // 在前面插入多行
  prependRows: function(arr, otherState = {}, callback = null){
    var [newRows, newRowIds] = this.arr2rows(arr, this.rows(), this.rowIds(), false); // 最后一个参数控制是否在后面追加, 否则在前面插入
    var state = update({dataSource: this.state.dataSource.cloneWithRows(newRows, newRowIds)}, {$merge: otherState});
    this.setState(state, callback);
    // console.log('appendRows: ' + newRowIds.length)
    // console.log(arr)
    // console.log(newRowIds)
  },
  // 在后面追加一行
  appendRow: function(item, otherState = {}, callback = null){
    this.addRow(item, otherState, callback, true);
  },
  // 在前面插入一行
  prependRow: function(item, otherState = {}, callback = null){
    this.addRow(item, otherState, callback, false);
  },
  // 添加一行
  addRow: function(item, otherState = {}, callback = null, append = true){
    var id = item[this.idField()];
    //更新rows
    var spec = {};
    spec[id] = {$set: item};
    var newRows = update(this.rows(), spec); // 等同于 update(this.rows(), {id: {$set: item}})
    //更新rowIds
    spec = append ? {$push: [id]} : {$unshift: [id]}; // 在后面追加 or 在前面插入
    var newRowIds = update(this.rowIds(), spec);
    var state = update({dataSource: this.state.dataSource.cloneWithRows(newRows, newRowIds)}, {$merge: otherState});
    this.setState(state, callback);
  },
  // 删除一行
  deleteRow: function(item, otherState = {}, callback = null){
    var id = item[this.idField()];
    //更新rows
    var newRows = update(this.rows(), {$apply: (rows) => {
      delete rows[id];
      return rows;
    }});
    //更新rowIds
    var i = this.rowIds().indexOf(id);
    var newRowIds = update(this.rowIds(), {$splice: [[i, 1]]})
    var state = update({dataSource: this.state.dataSource.cloneWithRows(newRows, newRowIds)}, {$merge: otherState});
    this.setState(state, callback);
  },
};
