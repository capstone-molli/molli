import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { FormLabel } from "react-native-elements"
import { styles } from "../index"
import SlidingUpPanel from 'rn-sliding-up-panel'

export default class SlideUpPanelComponent extends Component {
    render() {
        return (
            <SlidingUpPanel
                visible={this.props.visible}
                allowDragging={this.props.allowDragging}
                showBackdrop={true}
                draggableRange={{ top: 810, bottom: 0 }}
                onRequestClose={this.props.contract}>
                <View style={styles.searchPanel}>
                    <View style={styles.searchPanelSuper}>
                    </View>
                </View>
            </SlidingUpPanel>
        )
    }
}



