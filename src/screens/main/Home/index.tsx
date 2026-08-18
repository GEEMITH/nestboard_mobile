import {
  View,
  Text,
} from 'react-native';

import React, {
  useCallback,
  useRef,
  useState,
} from 'react';

import {
  BottomSheetModal,
} from '@gorhom/bottom-sheet';

import { styles } from './styles';

import LocationContainer from './components/LocationContainer';
import SearchContainer from './components/SearchContainer';
import PropertyTypesList from './components/PropertyTypesList';
import PropertyList from './components/PropertyList';
import FilterPanel from './components/FilterPanel';

import { PropertyType } from '../../../types/common';
import { Colors } from '../../../constant/colors';

import { usePropertyList } from '../../../hooks/usePropertyList';

const Home = () => {
  const [
    currentPType,
    setCurrentPType,
  ] = useState<PropertyType>('All');

  const [
    checkedCities,
    setCheckedCities,
  ] = useState<
    {
      city: string;
      checked: boolean;
    }[]
  >([]);

  const [
    range,
    setRange,
  ] = useState({
    min: 0,
    max: 20000,
  });

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    appliedSearch,
    setAppliedSearch,
  ] = useState('');

  const [
    triggerFilter,
    setTriggerFilter,
  ] = useState(0);

  const bottomSheetModalRef =
    useRef<BottomSheetModal>(null);

  const trigger = useCallback(() => {
    setAppliedSearch(search.trim());
    setTriggerFilter(Date.now());

    bottomSheetModalRef.current?.dismiss();
  }, [search]);

  const {
    properties,
    fetchNextBatch,
    fetching,
    initialLoading,
    error,
    retry,
  } = usePropertyList({
    currentPType,
    range,
    checkedCities,
    search: appliedSearch,
    triggerFilter,
  });

  const openFilterPanel =
    useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);

  const handleTypeChange =
    useCallback(
      (type: PropertyType) => {
        setCurrentPType(type);
        setTriggerFilter(Date.now());
      },
      [],
    );

  const handleSearchChange =
    useCallback(
      (value: string) => {
        setSearch(value);
      },
      [],
    );

  const handleSearchSubmit =
    useCallback(() => {
      setAppliedSearch(search.trim());
      setTriggerFilter(Date.now());
    }, [search]);

  return (
    <View style={styles.homeContainer}>
      <LocationContainer />

      <SearchContainer
        search={search}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        openFilterPanel={openFilterPanel}
      />

      <PropertyTypesList
        currentPType={currentPType}
        setCurrentPType={handleTypeChange}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: Colors.TEXT_PRIMARY,
          }}
        >
          Popular
        </Text>

        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: Colors.TEXT_GRAY,
          }}
        >
          {properties.length > 0
            ? `${properties.length} loaded`
            : ''}
        </Text>
      </View>

      <PropertyList
        properties={properties}
        fetchNextBatch={fetchNextBatch}
        fetching={fetching}
        initialLoading={initialLoading}
        error={error}
        retry={retry}
      />

      <FilterPanel
        ref={bottomSheetModalRef}
        checkedCities={checkedCities}
        range={range}
        setCheckedCities={
          setCheckedCities
        }
        setRange={setRange}
        trigger={trigger}
      />
    </View>
  );
};

export default Home;