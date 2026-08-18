import React, {
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useNavigation,
  useRoute,
} from '@react-navigation/native';

import {
  ArrowLeft,
  Star,
} from 'lucide-react-native';

import { ReviewAPI } from '../../../api/reviews';

import {
  Review,
  ReviewEligibility,
} from '../../../types/reviews';

const PropertyReviews = () => {
  const route: any = useRoute();
  const navigation: any = useNavigation();

  const propertyId = route.params?.propertyId;
  const propertyTitle =
    route.params?.propertyTitle ??
    'Property Reviews';

  const [
    reviews,
    setReviews,
  ] = useState<Review[]>([]);

  const [
    eligibility,
    setEligibility,
  ] = useState<ReviewEligibility | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    rating,
    setRating,
  ] = useState(0);

  const [
    comment,
    setComment,
  ] = useState('');

  const loadData = async () => {
    if (!propertyId) {
      return;
    }

    try {
      setLoading(true);

      const [
        reviewData,
        eligibilityData,
      ] = await Promise.all([
        ReviewAPI.getPropertyReviews(
          propertyId,
        ),
        ReviewAPI.getEligibility(
          propertyId,
        ),
      ]);

      setReviews(reviewData);
      setEligibility(eligibilityData);
    } catch (error) {
      console.error(
        'Failed to load reviews:',
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [propertyId]);

  const handleSubmit = async () => {
    if (!eligibility?.eligible) {
      return;
    }

    if (rating < 1 || rating > 5) {
      Alert.alert(
        'Rating required',
        'Please select a rating between 1 and 5 stars.',
      );

      return;
    }

    if (!eligibility.booking?.id) {
      Alert.alert(
        'Unable to submit',
        'No eligible booking was found.',
      );

      return;
    }

    try {
      setSubmitting(true);

      await ReviewAPI.createReview(
        propertyId,
        {
          rating,
          comment:
            comment.trim().length > 0
              ? comment.trim()
              : undefined,
          bookingId:
            eligibility.booking.id,
        },
      );

      setRating(0);
      setComment('');

      Alert.alert(
        'Review submitted',
        'Thank you for sharing your experience.',
      );

      await loadData();
    } catch (error: any) {
      const message =
        error?.response?.data?.error?.message ??
        error?.response?.data?.message ??
        'Unable to submit your review.';

      Alert.alert(
        'Review failed',
        message,
      );

      await loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (
    value: number,
    size = 18,
  ) => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map(
          item => (
            <Star
              key={item}
              size={size}
              color="#F59E0B"
              fill={
                item <= value
                  ? '#F59E0B'
                  : 'transparent'
              }
            />
          ),
        )}
      </View>
    );
  };

  const average =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) =>
            total + review.rating,
          0,
        ) / reviews.length
      : 0;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const canReview =
    eligibility?.eligible === true;

  const eligibilityMessage =
    eligibility?.reason ===
    'ALREADY_REVIEWED'
      ? 'You have already reviewed this property.'
      : eligibility?.reason ===
        'NO_QUALIFYING_BOOKING'
      ? 'You can review this property after completing an eligible stay.'
      : null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
          style={styles.backButton}
        >
          <ArrowLeft
            size={24}
            color="#111827"
          />
        </TouchableOpacity>

        <Text
          style={styles.headerTitle}
          numberOfLines={1}
        >
          Reviews
        </Text>

        <View
          style={styles.headerSpacer}
        />
      </View>

      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        contentContainerStyle={
          styles.listContent
        }
        ListHeaderComponent={
          <>
            <View style={styles.summaryCard}>
              <Text
                style={styles.propertyTitle}
              >
                {propertyTitle}
              </Text>

              <Text
                style={styles.averageRating}
              >
                {average.toFixed(1)}
              </Text>

              {renderStars(
                Math.round(average),
                22,
              )}

              <Text style={styles.reviewCount}>
                {reviews.length}{' '}
                {reviews.length === 1
                  ? 'review'
                  : 'reviews'}
              </Text>
            </View>

            {canReview ? (
              <View style={styles.reviewForm}>
                <Text style={styles.sectionTitle}>
                  Write a review
                </Text>

                <Text style={styles.formLabel}>
                  Your rating
                </Text>

                <View
                  style={styles.ratingSelector}
                >
                  {[1, 2, 3, 4, 5].map(
                    item => (
                      <TouchableOpacity
                        key={item}
                        onPress={() =>
                          setRating(item)
                        }
                      >
                        <Star
                          size={34}
                          color="#F59E0B"
                          fill={
                            item <= rating
                              ? '#F59E0B'
                              : 'transparent'
                          }
                        />
                      </TouchableOpacity>
                    ),
                  )}
                </View>

                <Text style={styles.formLabel}>
                  Comment (optional)
                </Text>

                <TextInput
                  value={comment}
                  onChangeText={
                    setComment
                  }
                  placeholder="Tell others about your stay..."
                  multiline
                  maxLength={1000}
                  style={styles.commentInput}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  disabled={
                    submitting
                  }
                  onPress={
                    handleSubmit
                  }
                  style={[
                    styles.submitButton,
                    submitting &&
                      styles.disabledButton,
                  ]}
                >
                  {submitting ? (
                    <ActivityIndicator
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      style={
                        styles.submitButtonText
                      }
                    >
                      Submit review
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.infoCard}>
                <Text style={styles.infoText}>
                  {eligibilityMessage}
                </Text>
              </View>
            )}

            <Text style={styles.sectionTitle}>
              Guest reviews
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No reviews yet.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View
              style={styles.reviewTopRow}
            >
              <View>
                <Text
                  style={styles.userName}
                >
                  {item.user?.displayName ??
                    'Guest'}
                </Text>

                {renderStars(
                  item.rating,
                )}
              </View>

              <Text style={styles.date}>
                {new Date(
                  item.createdAt,
                ).toLocaleDateString()}
              </Text>
            </View>

            {item.comment ? (
              <Text style={styles.comment}>
                {item.comment}
              </Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  headerSpacer: {
    width: 40,
  },

  listContent: {
    padding: 16,
    paddingBottom: 40,
  },

  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },

  propertyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  averageRating: {
    fontSize: 40,
    fontWeight: '800',
    color: '#111827',
  },

  starRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },

  reviewCount: {
    marginTop: 8,
    color: '#6B7280',
  },

  reviewForm: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },

  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  ratingSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  commentInput: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#111827',
    marginBottom: 14,
  },

  submitButton: {
    height: 48,
    backgroundColor: '#FF6A39',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  infoCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },

  infoText: {
    color: '#9A3412',
    lineHeight: 20,
  },

  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  comment: {
    marginTop: 14,
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },

  emptyText: {
    color: '#9CA3AF',
    fontSize: 15,
  },
});

export default PropertyReviews;