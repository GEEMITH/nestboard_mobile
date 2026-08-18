import {
  View,
  StyleSheet,
} from 'react-native';

import React, {
  forwardRef,
  useCallback,
} from 'react';

import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import Typography
  from '../../../../components/ui/Typography';

import Slider
  from '@react-native-community/slider';

import CheckBoxComp
  from '../../../../components/ui/CheckboxComp';

import RegularButton
  from '../../../../components/ui/RegularButton';

import {
  Colors,
} from '../../../../constant/colors';

import {
  CITIES,
} from '../../../../constant/common';

import {
  formatNumberIntoCurrency,
} from '../../../../util/common';

interface Props {
  checkedCities: {
    city: string;
    checked: boolean;
  }[];

  range: {
    min: number;
    max: number;
  };

  setCheckedCities: (
    cities: {
      city: string;
      checked: boolean;
    }[],
  ) => void;

  setRange: (
    range: {
      min: number;
      max: number;
    },
  ) => void;

  trigger: () => void;
}

const FilterPanel =
  forwardRef<
    BottomSheetModal,
    Props
  >(
    (
      {
        checkedCities,
        range,
        setCheckedCities,
        setRange,
        trigger,
      },
      ref,
    ) => {
      const renderBackdrop =
        useCallback(
          (
            backdropProps: BottomSheetBackdropProps,
          ) => (
            <BottomSheetBackdrop
              {...backdropProps}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
              opacity={0.5}
            />
          ),
          [],
        );

      return (
        <BottomSheetModal
          ref={ref}
          backdropComponent={
            renderBackdrop
          }
          enableContentPanningGesture={
            false
          }
        >
          <BottomSheetView
            style={styles.contentContainer}
          >
            <Typography variant="h1">
              Filters
            </Typography>

            <View
              style={{
                marginTop: 24,
                gap: 10,
              }}
            >
              <Typography variant="h2">
                Cities
              </Typography>

              {CITIES.map(city => (
                <CheckBoxComp
                  key={city}
                  isSelected={
                    checkedCities.find(
                      item =>
                        item.city ===
                        city,
                    )?.checked
                  }
                  title={city}
                  checkedCities={
                    checkedCities
                  }
                  setCheckedCities={
                    setCheckedCities
                  }
                />
              ))}
            </View>

            <View
              style={{
                marginTop: 24,
                gap: 10,
              }}
            >
              <Typography variant="h2">
                Price
              </Typography>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent:
                    'space-between',
                }}
              >
                <Typography variant="h3">
                  {formatNumberIntoCurrency(
                    Math.round(
                      range.min,
                    ),
                  )}
                </Typography>

                <Typography variant="h3">
                  {formatNumberIntoCurrency(
                    Math.round(
                      range.max,
                    ),
                  )}
                </Typography>
              </View>

              <Slider
                style={{
                  width: '100%',
                  height: 40,
                }}
                minimumValue={0}
                maximumValue={
                  range.max
                }
                value={range.min}
                minimumTrackTintColor={
                  Colors.PRIMARY_COLOR
                }
                thumbTintColor={
                  Colors.PRIMARY_COLOR
                }
                onValueChange={
                  value => {
                    const nextMin =
                      Math.min(
                        Math.round(
                          value,
                        ),
                        range.max,
                      );

                    setRange({
                      ...range,
                      min: nextMin,
                    });
                  }
                }
              />

              <Slider
                style={{
                  width: '100%',
                  height: 40,
                }}
                minimumValue={
                  range.min
                }
                maximumValue={100000}
                value={range.max}
                minimumTrackTintColor={
                  Colors.PRIMARY_COLOR
                }
                thumbTintColor={
                  Colors.PRIMARY_COLOR
                }
                onValueChange={
                  value => {
                    const nextMax =
                      Math.max(
                        Math.round(
                          value,
                        ),
                        range.min,
                      );

                    setRange({
                      ...range,
                      max: nextMax,
                    });
                  }
                }
              />
            </View>

            <RegularButton
              marginTop={20}
              onPress={trigger}
              text="Apply Filters"
              Icon={null}
            />
          </BottomSheetView>
        </BottomSheetModal>
      );
    },
  );

export default FilterPanel;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingBottom: 100,
    padding: 24,
  },
});