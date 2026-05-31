import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const PLANS = [
  {
    id: 'monthly',
    label: 'Mensuel',
    price: '2.99€',
    period: '/mois',
    pricePerMonth: 2.99,
    popular: false,
    description: 'Résiliable à tout moment',
  },
  {
    id: 'yearly',
    label: 'Annuel',
    price: '19.99€',
    period: '/an',
    pricePerMonth: 1.67,
    popular: true,
    description: 'Économise 44% vs mensuel',
  },
];

const FEATURES = [
  { icon: 'musical-notes', text: 'Écoutes illimitées — toute la bibliothèque peule' },
  { icon: 'download', text: 'Téléchargement hors-ligne' },
  { icon: 'radio-button-off', text: 'Sans publicités' },
  { icon: 'headset', text: 'Qualité audio HD' },
  { icon: 'list', text: 'Playlists personnalisées illimitées' },
  { icon: 'globe', text: 'Accès aux nouvelles musiques en avant-première' },
  { icon: 'heart', text: 'Favoris synchronisés sur tous tes appareils' },
];

export default function PremiumScreen() {
  const navigation = useNavigation();
  const { isPremium, profile } = useAuth();
  const [selectedPlan, setSelectedPlan] = React.useState('yearly');

  if (isPremium) {
    return (
      <View style={styles.alreadyPremium}>
        <Text style={styles.checkEmoji}>⭐</Text>
        <Text style={styles.alreadyTitle}>Tu es déjà Premium !</Text>
        <Text style={styles.alreadySub}>Profite de toute la musique peule sans limite.</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#1a3a2a', '#0A0A0A']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerEmoji}>⭐</Text>
        <Text style={styles.headerTitle}>Peul Music Premium</Text>
        <Text style={styles.headerSub}>
          Accède à tout le patrimoine musical peule sans limite
        </Text>
      </LinearGradient>

      {/* Fonctionnalités */}
      <View style={styles.features}>
        {FEATURES.map((feat, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name={feat.icon as any} size={18} color={COLORS.primary} />
            </View>
            <Text style={styles.featureText}>{feat.text}</Text>
          </View>
        ))}
      </View>

      {/* Plans */}
      <View style={styles.plans}>
        <Text style={styles.plansTitle}>Choisis ton abonnement</Text>
        {PLANS.map(plan => (
          <TouchableOpacity
            key={plan.id}
            style={[styles.planCard, selectedPlan === plan.id && styles.planCardActive]}
            onPress={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>⭐ Le plus populaire</Text>
              </View>
            )}
            <View style={styles.planRow}>
              <View style={[styles.radio, selectedPlan === plan.id && styles.radioActive]}>
                {selectedPlan === plan.id && <View style={styles.radioDot} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.planLabel}>{plan.label}</Text>
                <Text style={styles.planDescription}>{plan.description}</Text>
                {plan.id === 'yearly' && (
                  <Text style={styles.planPerMonth}>soit {plan.pricePerMonth.toFixed(2)}€/mois</Text>
                )}
              </View>
              <View style={styles.planPriceContainer}>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planPeriod}>{plan.period}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <TouchableOpacity
          style={styles.subscribeBtn}
          onPress={() => {
            // TODO: Intégrer Stripe
            // https://stripe.com/docs/mobile/react-native
          }}
        >
          <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.subscribeBtnGrad}>
            <Ionicons name="card" size={20} color={COLORS.background} />
            <Text style={styles.subscribeBtnText}>
              S'abonner — {PLANS.find(p => p.id === selectedPlan)?.price}{PLANS.find(p => p.id === selectedPlan)?.period}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Paiement sécurisé par Stripe. Résiliable à tout moment.{'\n'}
          Essai gratuit de 7 jours pour les nouveaux abonnés.
        </Text>
      </View>

      {/* Compteur pour gratuit */}
      {profile && (
        <View style={styles.freeCounter}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.textMuted} />
          <Text style={styles.freeCounterText}>
            Compte gratuit : {profile.listen_count_today}/5 écoutes utilisées aujourd'hui
          </Text>
        </View>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 24, paddingTop: 56, alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 50, right: 20, backgroundColor: COLORS.card, borderRadius: 20, padding: 8 },
  headerEmoji: { fontSize: 52, marginBottom: 12 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  headerSub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  features: { paddingHorizontal: 20, paddingVertical: 20 },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  featureIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.primary + '22',
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1, fontSize: 14, color: COLORS.text, lineHeight: 20 },
  plans: { paddingHorizontal: 20, marginBottom: 20 },
  plansTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  planCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  planCardActive: { borderColor: COLORS.primary, borderWidth: 2 },
  popularBadge: {
    backgroundColor: COLORS.primary + '33',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  popularText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.textMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  planLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  planDescription: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  planPerMonth: { fontSize: 12, color: COLORS.primary, marginTop: 2, fontWeight: '600' },
  planPriceContainer: { alignItems: 'flex-end' },
  planPrice: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  planPeriod: { fontSize: 12, color: COLORS.textSecondary },
  cta: { paddingHorizontal: 20 },
  subscribeBtn: { marginBottom: 14 },
  subscribeBtnGrad: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, borderRadius: 14, padding: 16,
  },
  subscribeBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.background },
  disclaimer: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18, marginBottom: 16 },
  freeCounter: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 20, backgroundColor: COLORS.card,
    borderRadius: 10, padding: 12,
  },
  freeCounterText: { fontSize: 13, color: COLORS.textMuted, flex: 1 },
  alreadyPremium: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', padding: 40 },
  checkEmoji: { fontSize: 64, marginBottom: 16 },
  alreadyTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  alreadySub: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: 8 },
  backBtn: { marginTop: 24, backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 12 },
  backBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.background },
});
