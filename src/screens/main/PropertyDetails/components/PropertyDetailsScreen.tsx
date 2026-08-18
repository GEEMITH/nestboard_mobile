import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import Typography from '../../../../components/ui/Typography';
import AvailableRoomTypes from './AvailableRoomTypes';
import { MapPin } from 'lucide-react-native';
import { Colors } from '../../../../constant/colors';
import { RoomType } from '../../../../types/properties';
import {
  TouchableOpacity,
} from 'react-native';

import {
  Star,
} from 'lucide-react-native';

const ACCENT = '#FF6A39';
const BORDER = '#E5E7EB';

interface PropertyStats {
  seatsAvailable: number;
  minStayMonths: string;
  priceFrom: string; // e.g. "LKR 15K"
}

interface PropertyDetailsScreenProps {
  title: string;
  address: string;
  badges: string[];
  stats: PropertyStats;
  rooms: RoomType[];
  onViewRooms: (
    roomId: string,
    roomTypeName: string,
  ) => void;
  rating?: number;
  onViewReviews?: () => void;
}

const Chip = ({ label, active }: { label: string; active?: boolean }) => (
  <View style={[styles.chip, active && styles.chipActive]}>
    <Typography variant="badge" color={active ? ACCENT : '#1A1A1A'}>
      {label}
    </Typography>
  </View>
);

const StatBox = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.statBox}>
    <Typography variant="stat">{value}</Typography>
    <Typography variant="caption" style={styles.statLabel}>
      {label}
    </Typography>
  </View>
);

const PropertyDetailsScreen = ({
  title,
  address,
  badges,
  stats,
  rooms,
  onViewRooms,
  rating = 0,
  onViewReviews,
}: PropertyDetailsScreenProps) => {
  return (
    <View style={styles.card}>
      <Typography variant="h1">{title}</Typography>

      <View style={styles.addressRow}>
        <MapPin size={18} color={Colors.PRIMARY_COLOR} />
        <Typography variant="subtitle">{address}</Typography>
      </View>

      <TouchableOpacity
  activeOpacity={0.8}
  onPress={onViewReviews}
  disabled={!onViewReviews}
  style={styles.reviewButton}
>
  <View style={styles.reviewRating}>
    <Star
      size={18}
      color="#F59E0B"
      fill="#F59E0B"
    />

    <Typography
      variant="subtitle"
      style={styles.ratingText}
    >
      {Number(rating).toFixed(1)}
    </Typography>
  </View>

  <Typography
    variant="caption"
    style={styles.reviewLink}
  >
    View reviews
  </Typography>
</TouchableOpacity>

      <View style={styles.chipRow}>
        {badges.map((badge, index) => (
          <Chip key={badge} label={badge} active={index === 0} />
        ))}
      </View>

      <View style={styles.statsRow}>
        <StatBox value={String(stats.seatsAvailable)} label="Seats Available" />
        <StatBox value={String(stats.minStayMonths)} label="Month Min. Stay" />
        <StatBox value={stats.priceFrom} label="From" />
      </View>

      <AvailableRoomTypes rooms={rooms} onViewRooms={onViewRooms} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0E0E0E',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginTop: '90%'
  },
  addressRow: {
    marginTop: 6,
    flexDirection: 'row'
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 14,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  chipActive: {
    backgroundColor: '#FFE9E0',
    borderColor: '#FFE9E0',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    marginBottom: 22,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  statLabel: {
    textAlign: 'center',
    marginTop: 2,
  },

  reviewButton: {
  marginTop: 14,
  padding: 14,
  borderWidth: 1,
  borderColor: '#E5E7EB',
  borderRadius: 14,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

reviewRating: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
},

ratingText: {
  fontWeight: '700',
},

reviewLink: {
  color: '#FF6A39',
  fontWeight: '700',
},

});

export default PropertyDetailsScreen;