import React from "react";
import { View, TextInput, StyleSheet, Text, Pressable, Platform, StyleProp, ViewStyle, TextStyle } from "react-native";
import { colors } from "../theme/colors";
import SearchIcon from '../../assets/search/search.svg';
import { fonts } from '../theme/typography';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
  onClear,
  containerStyle,
  inputStyle,
  backgroundColor,
}: Props) {
  return (
    <View style={[styles.container, backgroundColor && { backgroundColor }, containerStyle]}>
      <SearchIcon width={24} height={24} />
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor={colors.subtext}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => {
            onChangeText("");
            onClear?.();
          }}
          hitSlop={10}
        >
          <Text style={styles.clear}></Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.SearchinputBg,
    borderRadius: 180,
    borderWidth: 0,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 20,
  },
  icon: { color: colors.subtext, fontSize: 16 },
  input: { flex: 1, color: colors.text, paddingVertical: 0, fontSize: 15 , fontFamily: fonts.regular, paddingTop: 4},
  clear: { color: colors.subtext, fontSize: 18, paddingHorizontal: 4 },
});
