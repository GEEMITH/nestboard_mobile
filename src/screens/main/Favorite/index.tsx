import React,
{
  useCallback,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Heart,
  RefreshCcw,
  Trash2,
} from 'lucide-react-native';

import {
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';

import Typography
  from '../../../components/ui/Typography';

import {
  Colors,
} from '../../../constant/colors';

import {
  useFavourites,
} from '../../../hooks/useFavourites';

import {
  Property,
} from '../../../types/properties';

const FavouriteCard = ({
  property,
  onRemove,
  removing,
  onOpen,
}: {
  property: Property;
  onRemove: (
    id: string,
  ) => void;
  removing: boolean;
  onOpen: (
    property: Property,
  ) => void;
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() =>
        onOpen(property)
      }
      style={styles.card}
    >
      {property.imageUrl ? (
        <Image
          source={{
            uri: property.imageUrl,
          }}
          style={styles.image}
        />
      ) : (
        <View
          style={[
            styles.image,
            styles.placeholder,
          ]}
        >
          <Heart
            size={42}
            color={Colors.ICON_GRAY}
          />
        </View>
      )}

      <View style={styles.cardContent}>
        <View
          style={styles.titleRow}
        >
          <View
            style={{
              flex: 1,
            }}
          >
            <Typography variant="h2">
              {property.title}
            </Typography>

            {property.city && (
              <Typography
                color={
                  Colors.TEXT_GRAY
                }
                style={{
                  marginTop: 5,
                }}
              >
                {property.city}
              </Typography>
            )}
          </View>

          <TouchableOpacity
            disabled={removing}
            onPress={event => {
              event.stopPropagation();
              onRemove(property.id);
            }}
            style={
              styles.removeButton
            }
          >
            {removing ? (
              <ActivityIndicator
                size="small"
                color="#EF4444"
              />
            ) : (
              <Trash2
                size={20}
                color="#EF4444"
              />
            )}
          </TouchableOpacity>
        </View>

        <View
          style={styles.savedRow}
        >
          <Heart
            size={17}
            color="#EF4444"
            fill="#EF4444"
          />

          <Typography
            variant="caption"
            color="#EF4444"
          >
            Saved
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Favourites = () => {
  const navigation: any =
    useNavigation();

  const {
    favourites,
    loading,
    error,
    updatingId,
    refetch,
    removeFavourite,
  } = useFavourites();

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  const openProperty =
    useCallback(
      (
        property: Property,
      ) => {
        navigation.navigate(
          'PropertyDetails',
          {
            pid: property.id,
          },
        );
      },
      [navigation],
    );

  const handleRemove =
    useCallback(
      async (
        propertyId: string,
      ) => {
        await removeFavourite(
          propertyId,
        );
      },
      [removeFavourite],
    );

  if (
    loading &&
    favourites.length === 0
  ) {
    return (
      <View
        style={styles.center}
      >
        <ActivityIndicator
          size="large"
          color={
            Colors.PRIMARY_COLOR
          }
        />
      </View>
    );
  }

  if (
    error &&
    favourites.length === 0
  ) {
    return (
      <View
        style={styles.center}
      >
        <RefreshCcw
          size={60}
          color={Colors.ICON_GRAY}
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
          onPress={refetch}
          style={styles.retryButton}
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
      style={styles.container}
    >
      <View
        style={styles.header}
      >
        <View>
          <Typography variant="h1">
            Favourites
          </Typography>

          <Typography
            color={Colors.TEXT_GRAY}
            style={{
              marginTop: 4,
            }}
          >
            {favourites.length}{' '}
            saved properties
          </Typography>
        </View>

        <Heart
          size={28}
          color="#EF4444"
          fill="#EF4444"
        />
      </View>

      <FlatList
        data={favourites}
        keyExtractor={item =>
          item.id
        }
        renderItem={({
          item,
        }) => (
          <FavouriteCard
            property={item}
            onRemove={
              handleRemove
            }
            removing={
              updatingId ===
              item.id
            }
            onOpen={
              openProperty
            }
          />
        )}
        refreshing={loading}
        onRefresh={refetch}
        contentContainerStyle={[
          styles.list,
          favourites.length ===
            0 &&
            styles.emptyList,
        ]}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 16,
            }}
          />
        )}
        ListEmptyComponent={
          <View
            style={styles.center}
          >
            <View
              style={
                styles.emptyIcon
              }
            >
              <Heart
                size={54}
                color={
                  Colors.ICON_GRAY
                }
              />
            </View>

            <Typography variant="h2">
              No favourites yet
            </Typography>

            <Typography
              color={
                Colors.TEXT_GRAY
              }
              style={
                styles.emptyText
              }
            >
              Properties you save will
              appear here.
            </Typography>
          </View>
        }
      />
    </View>
  );
};

export default Favourites;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      Colors.WHITE,
    paddingHorizontal: 16,
  },

  header: {
    paddingTop: 24,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
  },

  list: {
    paddingBottom: 140,
  },

  emptyList: {
    flexGrow: 1,
  },

  card: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor:
      Colors.WHITE,
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 180,
  },

  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      '#F3F4F6',
  },

  cardContent: {
    padding: 16,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  removeButton: {
    width: 42,
    height: 42,
    borderRadius: 100,
    backgroundColor:
      '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor:
      '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 20,
    backgroundColor:
      Colors.PRIMARY_COLOR,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 100,
  },
});