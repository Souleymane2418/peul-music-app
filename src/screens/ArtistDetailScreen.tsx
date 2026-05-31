import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS } from '../theme/colors';
import { ARTISTS, SONGS } from '../data/mockData';
import { RootStackParamList } from '../types';
import { usePlayer } from '../context/PlayerContext';

const { width } = Dimensions.get('window');
type Route = RouteProp<RootStackParamList, 'ArtistDetail'>;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

export default function ArtistDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<Route>();
  const { artistId } = route.params;
  const { playSong } = usePlayer();

  const artist = ARTISTS.find(a => a.id === artistId);
  const artistSongs = SONGS.filter(s => s.artistId === artistId);

  if (!artist) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: artist.imageUrl }} style={styles.artistImage} />
        <LinearGradient
          colors={['transparent', COLORS.background]}
          style={styles.imageGradient}
        />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Info artiste */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{artist.name}</Text>
          {artist.verified && (
            <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />
          )}
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaBadgeText}>🌍 {artist.country}</Text>
          </View>
          <View style={[styles.metaBadge, { backgroundColor: COLORS.secondary + '33' }]}>
            <Text style={[styles.metaBadgeText, { color: COLORS.secondary }]}>
              📅 {artist.generation}
            </Text>
          </View>
          <View style={[styles.metaBadge, { backgroundColor: COLORS.surfaceElevated }]}>
            <Text style={[styles.metaBadgeText, { color: COLORS.textSecondary }]}>
              👥 {artist.followers.toLocaleString()}
            </Text>
          </View>
        </View>
        <Text style={styles.bio}>{artist.bio}</Text>
      </View>

      {/* Bouton lire tout */}
      {artistSongs.length > 0 && (
        <TouchableOpacity
          style={styles.playAllBtn}
          onPress={() => {
            playSong(artistSongs[0], artistSongs);
            navigation.navigate('Player', { songId: artistSongs[0].id });
          }}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.playAllGradient}
          >
            <Ionicons name="play" size={20} color={COLORS.background} />
            <Text style={styles.playAllText}>Tout écouter</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* Discographie */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chansons ({artistSongs.length})</Text>
        {artistSongs.length === 0 ? (
          <Text style={styles.empty}>Aucune chanson disponible</Text>
        ) : (
          artistSongs.map((song, i) => (
            <TouchableOpacity
              key={song.id}
              style={styles.songRow}
              onPress={() => {
                playSong(song, artistSongs);
                navigation.navigate('Player', { songId: song.id });
              }}
            >
              <Text style={styles.songIndex}>{i + 1}</Text>
              <Image source={{ uri: song.coverUrl }} style={styles.songCover} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                <Text style={styles.songSub}>{song.year} • {song.genre}</Text>
              </View>
              <Text style={styles.songDuration}>{formatTime(song.duration)}</Text>
              <Ionicons name="play-circle-outline" size={26} color={COLORS.primary} />
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  imageContainer: { position: 'relative' },
  artistImage: { width, height: 280 },
  imageGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  info: { paddingHorizontal: 20, paddingTop: 12 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  name: { fontSize: 26, fontWeight: '800', color: COLORS.text, flex: 1 },
  metaRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  metaBadge: {
    backgroundColor: COLORS.primary + '33',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaBadgeText: { fontSize: 12, fontWeight: '600', color: COLORS.primary },
  bio: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  playAllBtn: { marginHorizontal: 20, marginTop: 20 },
  playAllGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 14,
    padding: 14,
  },
  playAllText: { fontSize: 16, fontWeight: '700', color: COLORS.background },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 16 },
  empty: { color: COLORS.textSecondary, fontStyle: 'italic' },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    gap: 10,
  },
  songIndex: { width: 20, fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  songCover: { width: 48, height: 48, borderRadius: 8 },
  songTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  songSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  songDuration: { fontSize: 12, color: COLORS.textMuted, marginRight: 6 },
});
