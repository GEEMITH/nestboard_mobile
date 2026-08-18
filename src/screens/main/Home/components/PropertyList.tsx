import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import React, {
  useMemo,
} from 'react';

import {
  FileQuestionMark,
  RefreshCcw,
} from 'lucide-react-native';

import {
  PropertyItem as PItem,
} from '../../../../types/properties';

import PropertyItemSkeleton
  from './PropertyItemSkeleton';

import PropertyItem
  from './PropertyItem';

import Typography
  from '../../../../components/ui/Typography';

import { Colors } from '../../../../constant/colors';

type Props = {
  properties: PItem[];
  fetchNextBatch: () => void;
  fetching: boolean;
  initialLoading: boolean;
  error: string | null;
  retry: () => void;
};

const PropertyList = ({
  fetchNextBatch,
  fetching,
  properties,
  initialLoading,
  error,
  retry,
}: Props) => {
  const height = 320;

  const styles_ =
    useMemo(
      () => styles(height),
      [height],
    );

  if (
    initialLoading &&
    properties.length === 0
  ) {
    return (
      <View style={styles_.flexContainer}>
        <PropertyItemSkeleton />

        <View
          style={{
            height: 16,
          }}
        />

        <PropertyItemSkeleton />
      </View>
    );
  }

  if (
    error &&
    properties.length === 0
  ) {
    return (
      <View style={styles_.stateContainer}>
        <RefreshCcw
          color={Colors.ICON_GRAY}
          size={64}
        />

        <Typography
          style={{
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          {error}
        </Typography>

        <TouchableOpacity
          onPress={retry}
          style={styles_.retryButton}
        >
          <Typography
            variant="button"
            color={Colors.WHITE}
          >
            Retry
          </Typography>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={styles_.flexContainer}
    >
      <FlatList
        showsVerticalScrollIndicator={
          false
        }
        style={styles_.flexContainer}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 16,
            }}
          />
        )}
        data={properties}
        keyExtractor={item => item.id}
        renderItem={item => (
          <PropertyItem dt={item} />
        )}
        ListEmptyComponent={() => (
          <View
            style={
              styles_.stateContainer
            }
          >
            <FileQuestionMark
              color={Colors.ICON_GRAY}
              size={80}
            />

            <Typography
              style={{
                marginTop: 16,
                textAlign: 'center',
              }}
            >
              No properties found
            </Typography>

            <Typography
              color={Colors.TEXT_GRAY}
              style={{
                marginTop: 8,
                textAlign: 'center',
              }}
            >
              Try changing your search or filters.
            </Typography>
          </View>
        )}
        ListFooterComponent={
          fetching
            ? () => (
                <View
                  style={
                    styles_.footer
                  }
                >
                  <ActivityIndicator
                    color={
                      Colors.PRIMARY_COLOR
                    }
                  />
                </View>
              )
            : null
        }
        contentContainerStyle={{
          paddingBottom: 140,
        }}
        onEndReached={
          fetchNextBatch
        }
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

export default PropertyList;

export const styles = (
  height: number,
) =>
  StyleSheet.create({
    propertContainer: {
      borderRadius: 16,
      width: '100%',
      height,
      overflow: 'hidden',
    },

    ratingContainer: {
      backgroundColor: 'white',
      height: 36,
      position: 'absolute',
      flexDirection: 'row',
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      right: 16,
      top: 16,
      gap: 6,
    },

    ratingText: {
      fontSize: 16,
      fontWeight: '600',
    },

    gradientBackground: {
      flexDirection: 'row',
      backgroundColor: '#00000090',
      padding: 24,
      justifyContent: 'space-between',
    },

    imageBackground: {
      height: '100%',
      width: '100%',
      justifyContent: 'flex-end',
    },

    flexContainer: {
      flex: 1,
    },

    stateContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
      paddingBottom: 100,
    },

    retryButton: {
      marginTop: 20,
      backgroundColor: Colors.PRIMARY_COLOR,
      paddingHorizontal: 28,
      paddingVertical: 12,
      borderRadius: 100,
    },

    footer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });