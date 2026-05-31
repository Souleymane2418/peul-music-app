import React, { useState, useMemo } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput,
  TouchableOpacity, Image, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS } from '../theme/colors';
import { SONGS, ARTISTS, GENRES, GENERATIONS, COUNTRIES } from '../data/mockData';
import { RootStackParamList, Song } from '../types';
import { usePlayer } from '../context/PlayerContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

type FilterType = 'all' | 'genre' | 'generation' | 'country';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedValue, setSelectedValue] = useState<string>('');
  const { playSong } = usePlayer();
  const navigation = useNavigation<NavProp>();

  const filteredSongs = useMemo(() => {
    let results = SONGS;

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artistName.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.genre.toLowerCase().includes(q) ||
        s.language.toLowerCase().includes(q)
      );
    }

    if (selectedValue) {
      if (activeFilter === 'genre') results = results.filter(s => s.genre === selectedValue);
      else if (activeFilter === 'generation') results = results.filter(s => s.generation === selectedValue);
      else if (activeFilter === 'country') results = results.filter(s => s.country === selectedValue);
    }

    return results;
  }, [query, activeFilter, selectedValue]);

  const filteredArtists = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return ARTISTS.filter(a =>
      a.name.toLowerCase().includes(q) || a.country.toLowerCase().includes(q)
    );
  }, [query]);

  function FilterChip({ label, value }: { label: string; value: string }) {
    const isActive = selectedValue === value;
    return (
      <TouchableOpacity
        style={[styles.chip, isActive && styles.chipActive]}
        onPress={() => setSelectedValue(isActive ? '' : value)}
      >
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explorer</Text>
        <Text style={styles.subtitle}>Découvrez la richesse musicale peule</Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Chercher un artiste, une chanson..."
          placeholderTextColor={COLORS.textMuted}
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtres */}
      <View style={styles.filterRow}>
        {(['all', 'genre', 'generation', 'country'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, activeFilter === f && styles.filterBtnActive]}
            onPress={() => { setActiveFilter(f); setSelectedValue(''); }}
          >
            <Text style={[styles.filterBtnText, activeFilter === f && styles.filterBtnTextActive]}>
              {{ all: 'Tout', genre: 'Genre', generation: 'Génération', country: 'Pays' }[f]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chips de sous-filtres */}
      {activeFilter !== 'all' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {(activeFilter === 'genre' ? GENRES :
            activeFilter === 'generation' ? GENERATIONS :
            COUNTRIES).map(val => (
            <FilterChip key={val} label={val} value={val} />
          ))}
        </ScrollView>
      )}

      {/* Résultats */}
      <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
        {/* Artistes trouvés */}
        {filteredArtists.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Artistes</Text>
            {filteredArtists.map(artist => (
              <TouchableOpacity
                key={artist.id}
                style={styles.artistRow}
                onPress={() => navigation.navigate('ArtistDetail', { artistId: artist.id })}
              >
                <Image source={{ uri: artist.imageUrl }} style={styles.artistImg} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.artistName}>{artist.name}</Text>
                  <Text style={styles.artistSub}>{artist.country} • {artist.generation}</Text>
                </View>
                {artist.verified && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Chansons */}
        <View style={styles.section}>
          {query && <Text style={styles.sectionTitle}>Chansons ({filteredSongs.length})</Text>}
          {filteredSongs.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🎵</Text>
              <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
            </View>
          ) : (
            filteredSongs.map(song => (
              <TouchableOpacity
                key={song.id}
                style={styles.songRow}
                onPress={() => {
                  playSong(song, filteredSongs);
                  navigation.navigate('Player', { songId: song.id });
                }}
              >
                <Image source={{ uri: song.coverUrl }} style={styles.songCover} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                  <Text style={styles.songSub} numberOfLines={1}>
                    {song.artistName} • {song.country} • {song.language}
                  </Text>
                  <Text style={styles.songYear}>{song.year} • {song.genre}</Text>
                </View>
                <Ionicons name="play-circle-outline" size={28} color={COLORS.primary} />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Catégories si pas de recherche */}
        {!query && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌍 Explorer par Pays</Text>
            <View style={styles.countryGrid}>
              {COUNTRIES.slice(0, 8).map((country, i) => {
                const flags: Record<string, string> = {
                  'Sénégal': '🇸🇳', 'Guinée': '🇬🇳', 'Mali': '🇲🇱',
                  'Nigeria': '🇳🇬', 'Cameroun': '🇨🇲', 'Niger': '🇳🇪',
                  'Burkina Faso': '🇧🇫', 'Mauritanie': '🇲🇷',
                };
                return (
                  <TouchableOpacity
                    key={country}
                    style={styles.countryCard}
                    onPress={() => { setActiveFilter('country'); setSelectedValue(country); }}
                  >
                    <Text style={styles.countryFlag}>{flags[country] || '🌍'}</Text>
                    <Text style={styles.countryName}>{country}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
  },
  searchInput: { flex: 1, color: COLORS.text, fontSize: 15 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 8,
  },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: COLORS.card,
  },
  filterBtnActive: { backgroundColor: COLORS.primary },
  filterBtnText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  filterBtnTextActive: { color: COLORS.background },
  chipRow: { paddingHorizontal: 20, marginBottom: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: COLORS.surfaceElevated,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: { backgroundColor: COLORS.primary + '33', borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.textSecondary },
  chipTextActive: { color: COLORS.primary, fontWeight: '600' },
  results: { flex: 1 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  artistImg: { width: 48, height: 48, borderRadius: 24 },
  artistName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  artistSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  songCover: { width: 52, height: 52, borderRadius: 8 },
  songTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  songSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  songYear: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary },
  countryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  countryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '22%',
    minWidth: 70,
  },
  countryFlag: { fontSize: 28, marginBottom: 6 },
  countryName: { fontSize: 11, color: COLORS.text, textAlign: 'center', fontWeight: '600' },
});
