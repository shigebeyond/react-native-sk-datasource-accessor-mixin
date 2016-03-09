# react-native-sk-datasource-accessor-mixin

##What is it

react-native-sk-datasource-accessor-mixin is a component wraps ListView, supports: 1 pull down to refresh 2 pull up to load more 3 scroll to top 4 scroll to bottom

##How to use it

1. `npm install react-native-sk-datasource-accessor-mixin@latest --save`

2. Write this in index.ios.js / index.android.js

```javascript

'use strict';
import React, {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight
} from 'react-native';

var DataSourceAccessorMixin = require('react-native-sk-datasource-accessor-mixin');

var test = React.createClass({

  mixins: [DataSourceAccessorMixin],

  getInitialState(){
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged:(row1, row2) => {
          return row1 !== row2;
        }
      }),
    };
  },

  componentDidMount(){
   //  var rows = [
   //   {id: 1, text: 'row 1'},
   //   {id: 2, text: 'row 2'},
   //   {id: 3, text: 'row 3'},
   //   {id: 4, text: 'row 4'},
   //   {id: 5, text: 'row 5'},
   //   {id: 6, text: 'row 6'},
   //   {id: 7, text: 'row 7'},
   //   {id: 8, text: 'row 8'},
   //   {id: 9, text: 'row 9'},
   //  ];
    var rows = [];
    for(var i = 0; i < 10; i++){
      rows.push({id: i, text: 'row ' + i},)
    }
    this.setRows(rows);
  },

  onPressRow(row) {
    console.log(row+' pressed');
    this.currRow = row;
  },

  renderRow(row) {
    return (
      <TouchableHighlight
        style={styles.row}
        underlayColor='#c8c7cc'
        onPress={() => this.onPressRow(row)}
      >
        <Text>{row.text}</Text>
      </TouchableHighlight>
    );
  },

 onAppendRow(){
   var n = this.rowCount();
   this.appendRow({id: n, text: 'row ' + n})
 },

 onDeleteRow(){
   if(!this.currRow){
     console.log('no selected row');
     return;
   }
   this.deleteRow(this.currRow)
 },

  render() {
    return (
      <View style={styles.container}>
        <ListView
         dataSource={this.state.dataSource}
         renderRow={this.renderRow}
       />
       <View style={styles.btnBox}>
         <TouchableHighlight
           style={styles.btn}
           underlayColor='#c8c7cc'
           onPress={this.onAppendRow}
         >
           <Text>append row</Text>
         </TouchableHighlight>
         <TouchableHighlight
           style={styles.btn}
           underlayColor='#c8c7cc'
           onPress={this.onDeleteRow}
         >
           <Text>delete row</Text>
         </TouchableHighlight>
       </View>
      </View>
    );
  }
});

var styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  row: {
    padding: 10,
    height: 44,
    backgroundColor: 'yellow',
    borderBottomColor: 'grey',
    borderBottomWidth: 2,
  },
  btnBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: 44,
  },
  btn: {
    width: 90,
    height: 40,
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  }
};

AppRegistry.registerComponent('test', () => test);

```
![](https://raw.githubusercontent.com/shigebeyond/react-native-sk-datasource-accessor-mixin/master/demo.gif)

##Methods

| Method | Description | Params |
|---|---|---|
|**`idField()`**|Get field name which represents row's ID.  |*None*|
|**`isEmpty()`**|Whether there is no rows. |*None*|
|**`rowCount()`**|Count of rows. |*None*|
|**`rows()`**|Get rows. |*None*|
|**`rowIds()`**|Get row's IDs. |*None*|
|**`setRows(newRows)`**|Set rows. |*None*|
|**`appendRows(newRows)`**|Insert multiple rows at the end. |*None*|
|**`prependRows(newRows)`**|Insert multiple rows in the head. |*None*|
|**`appendRow(newRow)`**|Insert one row at the end. |*None*|
|**`prependRow(newRow)`**|Insert one row in the head. |*None*|
|**`deleteRow(row)`**|Delete row by ID. |*None*|
