import {
  View,
  TextInput,
  StyleSheet,
} from 'react-native';

import React from 'react';
import { Search } from 'lucide-react-native';

import { Colors } from '../../constant/colors';

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit?: () => void;
};

const SearchInput = ({
  value,
  onChangeText,
  onSubmit,
}: Props) => {
  return (
    <View style={styles.container}>
      <Search
        color={Colors.ICON_GRAY}
        size={20}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
        placeholder="Search your place"
        placeholderTextColor={Colors.TEXT_GRAY}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    height: 48,
    width: '100%',
    borderRadius: 100,
    elevation: 2,
    backgroundColor: Colors.WHITE,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  input: {
    flex: 1,
    color: Colors.TEXT_PRIMARY,
    paddingVertical: 0,
  },
});