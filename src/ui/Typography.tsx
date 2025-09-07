
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { fonts } from '../theme/typography';
import { colors } from '../theme/colors';

export function H1({ style, children, ...props }: TextProps) {
  return (
    <Text
      {...props}
      allowFontScaling={false}
      style={[s.h1, style]}
    >
      {children}
    </Text>
  );
}

const s = StyleSheet.create({
  h1: {
    color: colors.text,
    fontFamily: fonts.semiBold,
    fontSize: 28,
    lineHeight: 34,
    includeFontPadding: false,
    letterSpacing: 0.2,
  },
});
