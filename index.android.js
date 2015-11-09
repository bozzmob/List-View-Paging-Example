'use strict';

var React = require('react-native');
var {
  Image,
  LayoutAnimation,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppRegistry,
} = React;

var PAGE_SIZE = 4;
var THUMB_URLS = [
  'https://en.opensuse.org/images/1/1d/Skype-icon-128x128.png',
  'http://www.openwebanalytics.com/wp-content/plugins/owa/modules/base/i/browsers/128x128/ie4.png',
  'http://e38.ru/files/imagecache/192x192/files/pictures/picture-2293.jpg',
  'http://mib.pianetalinux.org/blog/images/stories/d/darktable-128x128.png',
  'http://kansascitysnowcones.com/wp-content/uploads/2012/06/128x128-youtube.png',
  'http://vectorlogo.biz/wp-content/uploads/2013/01/NEW-INTEL-VECTORLOGO-DOT-BIZ-128x128.png',
  'http://www.iconesbr.net/iconesbr/2008/08/4328/4328_128x128.png',
  'http://www.justinparks.com/wp-content/uploads/2009/10/google-badge-128x128.png',
  'http://citruspay.com/DevelopersGuide/citrusjs/images/logo@2x.png',
  'https://bitbucket-assetroot.s3.amazonaws.com/c/photos/2014/May/02/coronium-mongo-demo-logo-469707550-0_avatar.png',
  'http://www.mstoic.com/wp-content/uploads/2013/07/Speed-128x128.png',
  'http://icons.iconarchive.com/icons/giannis-zographos/german-football-club/128/Eintracht-Frankfurt-icon.png',
];
var NUM_SECTIONS = 100;
var NUM_ROWS_PER_SECTION = 10;

var Thumb = React.createClass({
  getInitialState: function() {
    return {thumbIndex: this._getThumbIdx(), dir: 'row'};
  },
  _getThumbIdx: function() {
    return Math.floor(Math.random() * THUMB_URLS.length);
  },
  _onPressThumb: function() {
    var config = layoutAnimationConfigs[this.state.thumbIndex % layoutAnimationConfigs.length];
    LayoutAnimation.configureNext(config);
    this.setState({
      thumbIndex: this._getThumbIdx(),
      dir: this.state.dir === 'row' ? 'column' : 'row',
    });
  },
  render: function() {
    return (
      <TouchableOpacity
        onPress={this._onPressThumb}
        style={[styles.buttonContents, {flexDirection: this.state.dir}]}>
        <Image style={styles.img} source={{uri: THUMB_URLS[this.state.thumbIndex]}} />
        <Image style={styles.img} source={{uri: THUMB_URLS[this.state.thumbIndex]}} />
        <Image style={styles.img} source={{uri: THUMB_URLS[this.state.thumbIndex]}} />
        {this.state.dir === 'column' ?
          <Text>
            Oooo, look at this new text!  So awesome it may just be crazy.
            Let me keep typing here so it wraps at least one line.
          </Text> :
          <Text />
        }
      </TouchableOpacity>
    );
  }
});

var ListViewPagingExample = React.createClass({
  statics: {
    title: '<ListView> - Paging',
    description: 'Floating headers & layout animations.'
  },

  getInitialState: function() {
    var getSectionData = (dataBlob, sectionID) => {
      return dataBlob[sectionID];
    };
    var getRowData = (dataBlob, sectionID, rowID) => {
      return dataBlob[rowID];
    };

    var dataSource = new ListView.DataSource({
      getRowData: getRowData,
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    var dataBlob = {};
    var sectionIDs = [];
    var rowIDs = [];
    for (var ii = 0; ii < NUM_SECTIONS; ii++) {
      var sectionName = 'Section ' + ii;
      sectionIDs.push(sectionName);
      dataBlob[sectionName] = sectionName;
      rowIDs[ii] = [];

      for (var jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
        var rowName = 'S' + ii + ', R' + jj;
        rowIDs[ii].push(rowName);
        dataBlob[rowName] = rowName;
      }
    }
    return {
      dataSource: dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
      headerPressCount: 0,
    };
  },

  renderRow: function(rowData: string, sectionID: string, rowID: string): ReactElement {
    return (<Thumb text={rowData}/>);
  },

  renderSectionHeader: function(sectionData: string, sectionID: string) {
    return (
      <View style={styles.section}>
        <Text style={styles.text}>
          {sectionData}
        </Text>
      </View>
    );
  },

  renderHeader: function() {
    var headerLikeText = this.state.headerPressCount % 2 ?
      <View><Text style={styles.text}>1 Like</Text></View> :
      null;
    return (
      <TouchableOpacity onPress={this._onPressHeader} style={styles.header}>
        {headerLikeText}
        <View>
          <Text style={styles.text}>
            Table Header (click me)
          </Text>
        </View>
      </TouchableOpacity>
    );
  },

  renderFooter: function() {
    return (
      <View style={styles.header}>
        <Text onPress={() => console.log('Footer!')} style={styles.text}>
          Table Footer
        </Text>
      </View>
    );
  },

  render: function() {
    return (
      <ListView
        style={styles.listview}
        dataSource={this.state.dataSource}
        onChangeVisibleRows={(visibleRows, changedRows) => console.log({visibleRows, changedRows})}
        renderHeader={this.renderHeader}
        renderFooter={this.renderFooter}
        renderSectionHeader={this.renderSectionHeader}
        renderRow={this.renderRow}
        initialListSize={10}
        pageSize={PAGE_SIZE}
        scrollRenderAheadDistance={2000}
      />
    );
  },

  _onPressHeader: function() {
    var config = layoutAnimationConfigs[Math.floor(this.state.headerPressCount / 2) % layoutAnimationConfigs.length];
    LayoutAnimation.configureNext(config);
    this.setState({headerPressCount: this.state.headerPressCount + 1});
  },

});

var styles = StyleSheet.create({
  listview: {
    backgroundColor: '#B0C4DE',
  },
  header: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3B5998',
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    paddingHorizontal: 8,
  },
  rowText: {
    color: '#888888',
  },
  thumbText: {
    fontSize: 20,
    color: '#888888',
  },
  buttonContents: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 3,
    padding: 5,
    backgroundColor: '#EAEAEA',
    borderRadius: 3,
    paddingVertical: 10,
  },
  img: {
    width: 48,
    height: 48,
    marginHorizontal: 10,
    backgroundColor: 'transparent',
  },
  section: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 6,
    backgroundColor: '#5890ff',
  },
});

var animations = {
  layout: {
    spring: {
      duration: 750,
      create: {
        duration: 300,
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.4,
      },
    },
    easeInEaseOut: {
      duration: 300,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        delay: 100,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    },
  },
};

var layoutAnimationConfigs = [
  animations.layout.spring,
  animations.layout.easeInEaseOut,
];


AppRegistry.registerComponent('ListViewPagingExample', () => ListViewPagingExample);
