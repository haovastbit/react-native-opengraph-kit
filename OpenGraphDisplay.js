// @flow
/**
 *
 * @namespace Oseadea.Components.OpenGraph
 *
 * @class
 * @classdesc open graph component
 * @memberof Oseadea.Components
 * @extends React.Component
 *
 * @author Mohamed Mellouki <mellouki.mhd@gmail.com>
 * @version 0.1.0
 *
 */

import React, { Component } from 'react';
import {
    View,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
} from 'react-native';

const colors = {
    defaultBackgroundColor: '#EEEEEE',
    defaultIconColor: 'black',
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: colors.defaultBackgroundColor,
        // height: 80,
        padding: 5,
        overflow: 'hidden',
        marginBottom: 10,
        marginTop: 10,
    },
    smallContainer: {
        flexGrow: 1,
        borderWidth: 1,
        borderColor: colors.defaultBackgroundColor,
        justifyContent: 'flex-start',
        padding: 5,
        marginBottom: 10,
        marginTop: 10,
    },
    image: {
        // flex: 1,
        resizeMode: 'cover',
        alignSelf: 'center',
        height: 70,
        width: 70
    },
    title: {
        fontWeight: 'bold',
    },
    textContent: {
        flex: 4,
        paddingLeft: 5,
        paddingBottom: 5,
        overflow: 'hidden',
    },
    iconStyle: {
        tintColor: colors.defaultIconColor,
        width: 10,
        height: 10,
        margin: 10,
    },
    opengraphWithIcon: {
        backgroundColor: colors.defaultBackgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

type Props = {
    containerStyle: StyleSheet,
    descriptionStyle: StyleSheet,
    data: {
        url: String,
        image: String,
        title: String,
        description: String,
    },
    iconSource?: Number | String,
    iconStyle: StyleSheet,
    imageStyle: StyleSheet,
    onIconPress: Function,
    textContainerStyle: StyleSheet,
    touchContainerStyle: StyleSheet,
    titleStyle: StyleSheet,
    urlStyle: StyleSheet,
    urlOnlyContainerStyle: StyleSheet,
    urlOnlyTouchContainerStyle: StyleSheet,
    onPress?: Function,
};

export default class OpenGraphDisplay extends Component<Props> {
    static defaultProps = {
        iconSource: require('./close.png'),
    };

    handleLinkPress = () => {
        if(this.props.onPress){
            this.props.onPress(this.props.data.url)
            return
        }
        Linking.canOpenURL(this.props.data.url)
            .then((supported) => {
                if (!supported) {
                    console.log(`Can't handle url: ${this.props.data.url}`);

                    return null;
                } else {
                    return Linking.openURL(this.props.data.url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    render() {
        let opengraph = null;

        if (!this.props.data || !this.props.data.url) {
            return opengraph;
        }

        if (
            this.props.data.title
            || this.props.data.description
            || this.props.data.image
        ) {
            opengraph = (
                <TouchableWithoutFeedback onPress={this.handleLinkPress}>
                    <View
                        style={[
                            styles.container,
                            this.props.touchContainerStyle,
                        ]}
                    >
                        {this.props.data.image ? (
                            <Image
                                style={[styles.image, this.props.imageStyle]}
                                source={{ uri: this.props.data.image }}
                            />
                        ) : null}
                        <View
                            style={[
                                styles.textContent,
                                this.props.textContainerStyle,
                            ]}
                        >
                            <Text numberOfLines={2} style={[styles.title, this.props.titleStyle]}>
                                {this.props.data.title || ''}
                            </Text>
                            {this.props.data.description ? (
                                <Text
                                numberOfLines={2}
                                style={[
                                    styles.description,
                                    this.props.descriptionStyle,
                                ]}
                                >
                                    {this.props.data.description || ''}
                                </Text>
                            ) : (
                                <Text numberOfLines={2} style={[styles.url, this.props.urlStyle]}>
                                    {this.props.data.url
                                        ? this.props.data.url.toLowerCase()
                                        : ''}
                                </Text>
                            )}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        } else {
            opengraph = (
                <TouchableWithoutFeedback onPress={this.handleLinkPress}>
                    <View
                        style={[
                            styles.smallContainer,
                            this.props.urlOnlyTouchContainerStyle,
                        ]}
                    >
                        <Text style={[styles.url, this.props.urlStyle]}>
                            {this.props.data.url
                                ? this.props.data.url.toLowerCase()
                                : ''}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        }

        return (
            <View style={[styles.opengraphWithIcon, this.props.containerStyle]}>
                {opengraph}
                {this.props.onIconPress ? (
                    <TouchableWithoutFeedback onPress={this.props.onIconPress}>
                        <Image
                            source={this.props.iconSource}
                            style={[styles.iconStyle, this.props.iconStyle]}
                        />
                    </TouchableWithoutFeedback>
                ) : null}
            </View>
        );
    }
}
