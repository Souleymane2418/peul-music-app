import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { COLORS } from '../theme/colors';
import { SONGS, ARTISTS, ALBUMS, PLAYLISTS } from '../data/mockData';
import { RootStackParamList } from '../types';
import { usePlayer } from '../context/PlayerContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type Tab = 'playlists' | 'albums' | 'artists' | 'favorites';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('playlists');
  const { favoriteSongs, playSong } = usePlayer();
  const navigation = useNavigation<NavProp>();

  const favSongs = SONGS.filter(s => favoriteSongs.includes(s.id));

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'playlists', label: 'Playlists', icon: 'musical-notes' },
    { id: 'albums', label: 'Albums', icon: 'disc' },
    { id: 'artists', label: 'Artistes', icon: 'people' },
    { id: 'favorites', label: 'Favoris', icon: 'heart' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ma Bibliothèque</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Ionicons name="add" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabRow}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons
              name={tab.icon as any}
              size={16}
              color={activeTab === tab.id ? COLORS.background : COLORS.textSecondary}
            />
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Playlists */}
        {activeTab === 'playlists' && PLAYLISTS.map(playlist => (
          <TouchableOpacity key={playlist.id} style={styles.row}>
            <Image source={{ uri: playlist.coverUrl }} style={styles.rowImage} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.rowTitle}>{playlist.name}</Text>
              <Text style={styles.rowSub}>{playlist.songIds.length} chansons</Text>
              <Text style={styles.rowSub2}>{playlist.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Albums */}
        {activeTab === 'albums' && ALBUMS.map(album => (
          <TouchableOpacity
            key={album.id}
            style={styles.row}
            onPress={() => navigation.navigate('AlbumDetail', { albumId: album.id })}
          >
            <Image source={{ uri: album.coverUrl }} style={styles.rowImage} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.rowTitle}>{album.title}</Text>
              <Text style={styles.rowSub}>{album.artistName} • {album.year}</Text>
              <Text style={styles.rowSub2}>{album.genre}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Artistes */}
        {activeTab === 'artists' && ARTISTS.map(artist => (
          <TouchableOpacity
            key={artist.id}
            style={styles.row}
            onPress={() => navigation.navigate('ArtistDetail', { artistId: artist.id })}
          >
            <Image source={{ uri: artist.imageUrl }} style={[styles.rowImage, { borderRadius: 30 }]} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.rowTitle}>{artist.name}</Text>
                {artist.verified && <Ionicons name="checkmark-circle" size={14} color={COLORS.primary} />}
              </View>
              <Text style={styles.rowSub}>{artist.country} • {artist.generation}</Text>
              <Text style={styles.rowSub2}>{artist.followers.toLocaleString()} abonnés</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}

        {/* Favoris */}
        {activeTab === 'favorites' && (
          favSongs.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="heart-outline" size={64} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>Aucun favori</Text>
              <Text style={styles.emptyText}>
                Appuyez sur ♥ sur une chanson pour l'ajouter à vos favoris
              </Text>
            </View>
          ) : (
            favSongs.map(song => (
              <TouchableOpacity
                key={song.id}
                style={styles.row}
                onPress={() => {
                  playSong(song, favSongs);
                  navigation.navigate('Player', { songId: song.id });
                }}
              >
                <Image source={{ uri: song.coverUrl }} style={styles.rowImage} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.rowTitle}>{song.title}</Text>
                  <Text style={styles.rowSub}>{song.artistName}</Text>
                  <Text style={styles.rowSub2}>{song.country} • {song.year}</Text>
                </View>
                <Ionicons name="heart" size={20} color={COLORS.accent} />
              </TouchableOpacity>
            ))
          )
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.text },
  addBtn: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 6,
  },
  tabRow: { paddingHorizontal: 20, marginBottom: 16 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    marginRight: 10,
  },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  tabTextActive: { color: COLORS.background },
  content: { flex: 1, paddingHorizontal: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  rowImage: { width: 60, height: 60, borderRadius: 10 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  rowSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  rowSub2: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 16 },
  emptyText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
});
