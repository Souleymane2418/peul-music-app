import React from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  TouchableOpacity, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { usePlayer } from '../context/PlayerContext';
import { SONGS } from '../data/mockData';

export default function ProfileScreen() {
  const { favoriteSongs } = usePlayer();

  const stats = [
    { label: 'Favoris', value: favoriteSongs.length, icon: 'heart' },
    { label: 'Écoutes', value: '47', icon: 'musical-notes' },
    { label: 'Pays', value: '6', icon: 'globe' },
  ];

  const menuItems = [
    { icon: 'heart-outline', label: 'Mes Favoris', sub: `${favoriteSongs.length} chansons` },
    { icon: 'time-outline', label: 'Historique d\'écoute', sub: 'Vos 50 dernières écoutes' },
    { icon: 'download-outline', label: 'Téléchargements', sub: 'Écouter hors connexion' },
    { icon: 'share-social-outline', label: 'Partager', sub: 'Partager avec vos proches' },
    { icon: 'language-outline', label: 'Langue', sub: 'Français' },
    { icon: 'information-circle-outline', label: 'À propos de Peul Music', sub: 'Version 1.0.0' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header profil */}
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.background]}
        style={styles.header}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🎵</Text>
          </View>
        </View>
        <Text style={styles.name}>Peul Music Fan</Text>
        <Text style={styles.tagline}>Gardien de la culture peule 🌍</Text>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsRow}>
        {stats.map(stat => (
          <View key={stat.label} style={styles.statCard}>
            <Ionicons name={stat.icon as any} size={22} color={COLORS.primary} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Info culturelle */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🌍 Peul Music — Notre Mission</Text>
        <Text style={styles.infoText}>
          Préserver et partager le patrimoine musical des peuples Peuls (Fula, Fulani, Haalpulaar,
          Toucouleur) à travers toutes les générations et nationalités. De la Guinée au Sénégal,
          du Mali au Cameroun, notre musique unit notre peuple.
        </Text>
        <View style={styles.languageTags}>
          {['Pulaar', 'Pular', 'Fulfulde', 'Fula'].map(lang => (
            <View key={lang} style={styles.langBadge}>
              <Text style={styles.langText}>{lang}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon as any} size={22} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Contribuer */}
      <TouchableOpacity style={styles.contributeBtn}>
        <Ionicons name="cloud-upload-outline" size={22} color={COLORS.background} />
        <Text style={styles.contributeBtnText}>Contribuer — Ajouter de la musique</Text>
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingTop: 56,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatarContainer: { marginBottom: 16 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  avatarText: { fontSize: 40 },
  name: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  tagline: { fontSize: 13, color: COLORS.textSecondary, marginTop: 6 },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textSecondary },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  infoTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  infoText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  languageTags: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  langBadge: {
    backgroundColor: COLORS.primary + '33',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  langText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  menu: { paddingHorizontal: 20, marginTop: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    gap: 14,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  menuSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  contributeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    padding: 16,
  },
  contributeBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.background },
});
