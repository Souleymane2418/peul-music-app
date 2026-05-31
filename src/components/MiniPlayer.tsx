import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { COLORS } from '../theme/colors';
import { usePlayer } from '../context/PlayerContext';
import { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');
type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function MiniPlayer() {
  const { currentSong, isPlaying, togglePlayPause, playNext, progress } = usePlayer();
  const navigation = useNavigation<NavProp>();

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Player', { songId: currentSong.id })}
      activeOpacity={0.9}
    >
      {/* Barre de progression */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <LinearGradient
        colors={[COLORS.surfaceElevated, COLORS.card]}
        style={styles.content}
      >
        <Image source={{ uri: currentSong.coverUrl }} style={styles.cover} />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{currentSong.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artistName} • {currentSong.country}
          </Text>
        </View>
        <TouchableOpacity onPress={togglePlayPause} style={styles.playBtn}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={28}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={playNext} style={styles.nextBtn}>
          <Ionicons name="play-skip-forward" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  progressBar: {
    height: 2,
    backgroundColor: COLORS.border,
  },
  progressFill: {
    height: 2,
    backgroundColor: COLORS.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 12,
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  artist: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  playBtn: { padding: 6 },
  nextBtn: { padding: 6 },
});
