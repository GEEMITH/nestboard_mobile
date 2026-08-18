import {
  View,
} from 'react-native';

import React from 'react';

import SearchInput from '../../../../components/ui/SearchInput';
import RoundButton from '../../../../components/ui/RoundButton';

import {
  SlidersHorizontal,
} from 'lucide-react-native';

import { Colors } from '../../../../constant/colors';

type Props = {
  search: string;
  onSearchChange: (
    value: string,
  ) => void;
  onSearchSubmit: () => void;
  openFilterPanel: () => void;
};

const SearchContainer = ({
  search,
  onSearchChange,
  onSearchSubmit,
  openFilterPanel,
}: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
      }}
    >
      <View
        style={{
          flex: 1,
        }}
      >
        <SearchInput
          value={search}
          onChangeText={onSearchChange}
          onSubmit={onSearchSubmit}
        />
      </View>

      <RoundButton
        onPress={openFilterPanel}
        Icon={
          <SlidersHorizontal
            color={Colors.SECONDARY_COLOR}
            size={20}
          />
        }
      />
    </View>
  );
};

export default SearchContainer;