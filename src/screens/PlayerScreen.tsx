import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, Dimensions, Animated, PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { COLORS } from '../theme/colors';
import { usePlayer } from '../context/PlayerContext';

const { width, height } = Dimensions.get('window');

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayerScreen() {
  const navigation = useNavigation();
  const {
    currentSong, isPlaying, progress, duration,
    togglePlayPause, playNext, playPrev, seekTo,
    favoriteSongs, toggleFavorite,
  } = usePlayer();

  const [shuffled, setShuffled] = useState(false);
  const [repeated, setRepeated] = useState(false);
  const albumAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.spring(albumAnim, {
      toValue: isPlaying ? 1 : 0.85,
      useNativeDriver: true,
    }).start();
  }, [isPlaying]);

  if (!currentSong) return null;

  const isFav = favoriteSongs.includes(currentSong.id);
  const currentTime = progress * duration;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gradientStart, '#0A0A0A']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Ionicons name="chevron-down" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>En lecture</Text>
          <Text style={styles.headerSub}>{currentSong.albumTitle || currentSong.artistName}</Text>
        </View>
        <TouchableOpacity style={styles.headerBtn}>
          <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      {/* Pochette */}
      <View style={styles.coverContainer}>
        <Animated.View style={{ transform: [{ scale: albumAnim }] }}>
          <Image source={{ uri: currentSong.coverUrl }} style={styles.cover} />
        </Animated.View>
      </View>

      {/* Info chanson */}
      <View style={styles.songInfo}>
        <View style={styles.songInfoText}>
          <Text style={styles.songTitle} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.songArtist}>{currentSong.artistName}</Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{currentSong.country}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: COLORS.secondary + '33' }]}>
              <Text style={[styles.tagText, { color: COLORS.secondary }]}>{currentSong.language}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: COLORS.accent + '33' }]}>
              <Text style={[styles.tagText, { color: COLORS.accent }]}>{currentSong.year}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(currentSong.id)}>
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={28}
            color={isFav ? COLORS.accent : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Barre de progression */}
      <View style={styles.progressContainer}>
        <TouchableOpacity
          style={styles.progressBar}
          onPress={(e) => {
            const pos = e.nativeEvent.locationX / (width - 40);
            seekTo(Math.max(0, Math.min(1, pos)));
          }}
        >
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
            <View style={[styles.progressThumb, { left: `${progress * 100}%` }]} />
          </View>
        </TouchableOpacity>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Contrôles */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => setShuffled(!shuffled)}>
          <Ionicons name="shuffle" size={24} color={shuffled ? COLORS.primary : COLORS.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={playPrev} style={styles.controlBtn}>
          <Ionicons name="play-skip-back" size={32} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause} style={styles.playBtn}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.secondary]}
            style={styles.playBtnGradient}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={36}
              color={COLORS.background}
            />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={playNext} style={styles.controlBtn}>
          <Ionicons name="play-skip-forward" size={32} color={COLORS.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setRepeated(!repeated)}>
          <Ionicons name="repeat" size={24} color={repeated ? COLORS.primary : COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Info génération */}
      <View style={styles.generationBar}>
        <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
        <Text style={styles.generationText}>
          {currentSong.generation} • {currentSong.genre} • {(currentSong.plays / 1000).toFixed(0)}k écoutes
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerBtn: { padding: 8 },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerLabel: { fontSize: 12, color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  headerSub: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginTop: 2 },
  coverContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  cover: {
    width: width - 80,
    height: width - 80,
    borderRadius: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  songInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  songInfoText: { flex: 1 },
  songTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  songArtist: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 10 },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: {
    backgroundColor: COLORS.primary + '33',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { fontSize: 11, fontWeight: '600', color: COLORS.primary },
  progressContainer: { paddingHorizontal: 24, marginBottom: 20 },
  progressBar: { paddingVertical: 10 },
  progressTrack: {
    height: 4,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    marginLeft: -8,
  },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  timeText: { fontSize: 12, color: COLORS.textSecondary },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  controlBtn: { padding: 8 },
  playBtn: { shadowColor: COLORS.primary, shadowOpacity: 0.6, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  playBtnGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  generationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 30,
  },
  generationText: { fontSize: 13, color: COLORS.textSecondary },
});
