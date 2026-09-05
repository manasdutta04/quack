import React, {PropsWithChildren} from 'react';
import {Platform, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {colors, radius, shadow} from '../theme';

export function Glass({children, style, intensity = 32}: PropsWithChildren<{style?: StyleProp<ViewStyle>; intensity?: number}>) {
  if (Platform.OS === 'ios') return <BlurView blurType="dark" blurAmount={intensity} reducedTransparencyFallbackColor={colors.inkRaised} style={[styles.glass, style]}>{children}</BlurView>;
  return <View style={[styles.androidGlass, style]}>{children}</View>;
}
const styles = StyleSheet.create({glass: {overflow: 'hidden', borderRadius: radius.lg, backgroundColor: 'rgba(28,31,38,0.72)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)', ...shadow.floating}, androidGlass: {borderRadius: radius.lg, backgroundColor: 'rgba(40,44,53,0.96)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.10)', ...shadow.floating}});
