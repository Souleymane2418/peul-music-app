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
import { ALBUMS, SONGS } from '../data/mockData';
import { RootStackParamList } from '../types';
import { usePlayer } from '../context/PlayerContext';

const { width } = Dimensions.get('window');
type Route = RouteProp<RootStackParamList, 'AlbumDetail'>;
type NavProp = NativeStackNavigationProp<RootStackParamList>;

function formatTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

export default function AlbumDetailScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<Route>();
  const { albumId } = route.params;
  const { playSong } = usePlayer();

  const album = ALBUMS.find(a => a.id === albumId);
  const albumSongs = SONGS.filter(s => s.albumId === albumId);
  const totalDuration = albumSongs.reduce((acc, s) => acc + s.duration, 0);

  if (!album) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient colors={[COLORS.gradientStart, COLORS.background]} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Image source={{ uri: album.coverUrl }} style={styles.cover} />
        <Text style={styles.title}>{album.title}</Text>
        <Text style={styles.artist}>{album.artistName}</Text>
        <Text style={styles.meta}>
          {album.year} • {album.genre} • {albumSongs.length} titres • {formatTime(totalDuration)}
        </Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.playBtn}
        onPress={() => {
          if (albumSongs.length > 0) {
            playSong(albumSongs[0], albumSongs);
            navigation.navigate('Player', { songId: albumSongs[0].id });
          }
        }}
      >
        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.playBtnGrad}>
          <Ionicons name="play" size={22} color={COLORS.background} />
          <Text style={styles.playBtnText}>Écouter l'album</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.songList}>
        {albumSongs.map((song, i) => (
          <TouchableOpacity
            key={song.id}
            style={styles.songRow}
            onPress={() => {
              playSong(song, albumSongs);
              navigation.navigate('Player', { songId: song.id });
            }}
          >
            <Text style={styles.idx}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
              <Text style={styles.songSub}>{song.language}</Text>
            </View>
            <Text style={styles.duration}>{formatTime(song.duration)}</Text>
            <Ionicons name="play-circle-outline" size={26} color={COLORS.primary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { alignItems: 'center', paddingTop: 56, paddingBottom: 24, paddingHorizontal: 20 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 16, padding: 8 },
  cover: { width: 200, height: 200, borderRadius: 14, marginBottom: 16 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  artist: { fontSize: 16, color: COLORS.primary, marginTop: 6 },
  meta: { fontSize: 13, color: COLORS.textSecondary, marginTop: 8 },
  playBtn: { marginHorizontal: 20, marginTop: 16, marginBottom: 24 },
  playBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, borderRadius: 14, padding: 14,
  },
  playBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.background },
  songList: { paddingHorizontal: 20 },
  songRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: 12,
    padding: 14, marginBottom: 8, gap: 10,
  },
  idx: { width: 20, fontSize: 14, color: COLORS.textMuted, textAlign: 'center' },
  songTitle: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  songSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  duration: { fontSize: 12, color: COLORS.textMuted, marginRight: 6 },
});
