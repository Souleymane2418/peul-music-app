import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { Song } from '../types';

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  progress: number; // 0-1
  duration: number;
  playSong: (song: Song, queue?: Song[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrev: () => void;
  seekTo: (position: number) => void;
  addToQueue: (song: Song) => void;
  favoriteSongs: string[];
  toggleFavorite: (songId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [favoriteSongs, setFavoriteSongs] = useState<string[]>([]);
  const soundRef = useRef<Audio.Sound | null>(null);

  const playSong = useCallback(async (song: Song, newQueue?: Song[]) => {
    // Arrêter le son actuel
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }

    setCurrentSong(song);
    setIsPlaying(true);
    setProgress(0);
    setDuration(song.duration);

    if (newQueue) {
      setQueue(newQueue);
      setCurrentIndex(newQueue.findIndex(s => s.id === song.id));
    }

    // Si l'audioUrl est disponible, charger le son
    if (song.audioUrl) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: song.audioUrl },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              setProgress(status.positionMillis / (status.durationMillis || 1));
              if (status.didJustFinish) {
                // Passer à la chanson suivante
                playNext();
              }
            }
          }
        );
        soundRef.current = sound;
      } catch (error) {
        console.log('Audio non disponible pour cette chanson (démonstration)');
        // Mode démo: simuler la lecture
        setIsPlaying(true);
      }
    }
  }, []);

  const togglePlayPause = useCallback(async () => {
    if (soundRef.current) {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        await soundRef.current.playAsync();
      }
    }
    setIsPlaying(prev => !prev);
  }, [isPlaying]);

  const playNext = useCallback(() => {
    if (queue.length > 0 && currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      playSong(queue[nextIndex], queue);
    }
  }, [queue, currentIndex, playSong]);

  const playPrev = useCallback(() => {
    if (queue.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      playSong(queue[prevIndex], queue);
    }
  }, [queue, currentIndex, playSong]);

  const seekTo = useCallback(async (position: number) => {
    if (soundRef.current && duration > 0) {
      await soundRef.current.setPositionAsync(position * duration * 1000);
      setProgress(position);
    }
  }, [duration]);

  const addToQueue = useCallback((song: Song) => {
    setQueue(prev => [...prev, song]);
  }, []);

  const toggleFavorite = useCallback((songId: string) => {
    setFavoriteSongs(prev =>
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  }, []);

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, queue, currentIndex,
      progress, duration, playSong, togglePlayPause,
      playNext, playPrev, seekTo, addToQueue,
      favoriteSongs, toggleFavorite,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};
