import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Image, FlatList, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS } from '../theme/colors';
import { SONGS, ARTISTS, PLAYLISTS } from '../data/mockData';
import { RootStackParamList, Song, Artist } from '../types';
import { usePlayer } from '../context/PlayerContext';

const { width } = Dimensions.get('window');

type NavProp = NativeStackNavigationProp<RootStackParamList>;

function SongCard({ song }: { song: Song }) {
  const { playSong } = usePlayer();
  const navigation = useNavigation<NavProp>();

  return (
    <TouchableOpacity
      style={styles.songCard}
      onPress={() => {
        playSong(song, SONGS);
        navigation.navigate('Player', { songId: song.id });
      }}
    >
      <Image source={{ uri: song.coverUrl }} style={styles.songCover} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
        <Text style={styles.songArtist} numberOfLines={1}>{song.artistName}</Text>
        <View style={styles.songMeta}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{song.country}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: COLORS.secondary + '33' }]}>
            <Text style={[styles.badgeText, { color: COLORS.secondary }]}>{song.generation}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="play-circle" size={32} color={COLORS.primary} />
    </TouchableOpacity>
  );
}

function ArtistCard({ artist }: { artist: Artist }) {
  const navigation = useNavigation<NavProp>();
  return (
    <TouchableOpacity
      style={styles.artistCard}
      onPress={() => navigation.navigate('ArtistDetail', { artistId: artist.id })}
    >
      <Image source={{ uri: artist.imageUrl }} style={styles.artistImage} />
      {artist.verified && (
        <View style={styles.verifiedBadge}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
        </View>
      )}
      <Text style={styles.artistName} numberOfLines={1}>{artist.name}</Text>
      <Text style={styles.artistCountry}>{artist.country}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const topSongs = [...SONGS].sort((a, b) => b.plays - a.plays).slice(0, 6);
  const featuredArtists = ARTISTS.filter(a => a.verified).slice(0, 5);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header avec gradient */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.background]}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Jam tan 👋</Text>
            <Text style={styles.appName}>Peul Music</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.subtitle}>
          La musique peule de toutes les générations
        </Text>
      </LinearGradient>

      {/* Section: Playlists phares */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎵 Playlists Phares</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {PLAYLISTS.map(playlist => (
            <TouchableOpacity key={playlist.id} style={styles.playlistCard}>
              <Image source={{ uri: playlist.coverUrl }} style={styles.playlistCover} />
              <Text style={styles.playlistName} numberOfLines={2}>{playlist.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Section: Top chansons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Top Musiques Peules</Text>
        {topSongs.map(song => (
          <SongCard key={song.id} song={song} />
        ))}
      </View>

      {/* Section: Artistes vedettes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⭐ Artistes Phares</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredArtists.map(artist => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </ScrollView>
      </View>

      {/* Section: Par génération */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Par Génération</Text>
        <View style={styles.generationGrid}>
          {['Traditionnelle', 'Années 60-70', 'Années 80-90', 'Moderne 2000+', 'Contemporaine'].map((gen, i) => (
            <TouchableOpacity key={gen} style={[styles.genCard, { backgroundColor: COLORS.card }]}>
              <Text style={styles.genEmoji}>
                {['🥁', '🎸', '🎤', '🎧', '🎼'][i]}
              </Text>
              <Text style={styles.genName}>{gen}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  appName: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  notifBtn: {
    padding: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  // Song card
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  songCover: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 3,
  },
  songArtist: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  songMeta: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: COLORS.primary + '33',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
  },
  // Artist card
  artistCard: {
    width: 100,
    marginRight: 14,
    alignItems: 'center',
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 58,
    right: 8,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  artistName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
    textAlign: 'center',
  },
  artistCountry: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  // Playlist card
  playlistCard: {
    width: 140,
    marginRight: 14,
  },
  playlistCover: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginBottom: 8,
  },
  playlistName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  // Generation grid
  generationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  genCard: {
    width: (width - 60) / 2,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
  },
  genEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  genName: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});
