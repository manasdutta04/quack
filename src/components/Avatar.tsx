import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors, fonts} from '../theme';

export function Avatar({label, color, size = 52, online = false}: {label: string; color: string; size?: number; online?: boolean}) { return <View style={[styles.wrap, {width: size, height: size, borderRadius: size / 2, backgroundColor: color}]}><Text style={[styles.label, {fontSize: size * 0.28}]}>{label}</Text>{online && <View style={[styles.online, {width: size * 0.22, height: size * 0.22, borderRadius: size * 0.11}]} />}</View>; }
const styles = StyleSheet.create({wrap: {alignItems: 'center', justifyContent: 'center'}, label: {fontFamily: fonts.display, color: colors.ink, letterSpacing: -0.5}, online: {position: 'absolute', right: -1, bottom: 1, backgroundColor: colors.mint, borderWidth: 2, borderColor: colors.ink}});
