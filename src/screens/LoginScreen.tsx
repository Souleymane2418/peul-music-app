import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { useAuth } from '../context/AuthContext';

type Mode = 'login' | 'register';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) { Alert.alert('Erreur', 'Remplis tous les champs'); return; }
    if (mode === 'register' && !fullName) { Alert.alert('Erreur', 'Entre ton nom complet'); return; }
    if (password.length < 6) { Alert.alert('Erreur', 'Mot de passe min. 6 caractères'); return; }

    setLoading(true);
    const { error } = mode === 'login'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password, fullName.trim());

    setLoading(false);

    if (error) {
      Alert.alert('Erreur', error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.background]}
        style={styles.gradient}
      />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logo}>🎵</Text>
        <Text style={styles.appName}>Peul Music</Text>
        <Text style={styles.tagline}>Le patrimoine musical peule</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => setMode('login')}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Connexion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'register' && styles.tabActive]}
            onPress={() => setMode('register')}
          >
            <Text style={[styles.tabText, mode === 'register' && styles.tabTextActive]}>Inscription</Text>
          </TouchableOpacity>
        </View>

        {mode === 'register' && (
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              placeholder="Nom complet"
              placeholderTextColor={COLORS.textMuted}
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Adresse email"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor={COLORS.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPass}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.submitGradient}>
            {loading
              ? <ActivityIndicator color={COLORS.background} />
              : <Text style={styles.submitText}>
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                </Text>
            }
          </LinearGradient>
        </TouchableOpacity>

        {/* Abonnement info */}
        <View style={styles.freeInfo}>
          <Ionicons name="information-circle-outline" size={16} color={COLORS.textMuted} />
          <Text style={styles.freeInfoText}>
            Compte gratuit : 5 écoutes/jour. Passe à Premium pour un accès illimité.
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  gradient: { ...StyleSheet.absoluteFillObject },
  logoContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  logo: { fontSize: 64, marginBottom: 12 },
  appName: { fontSize: 32, fontWeight: '800', color: COLORS.primary, letterSpacing: 1 },
  tagline: { fontSize: 14, color: COLORS.textSecondary, marginTop: 6, fontStyle: 'italic' },
  form: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  tabs: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.background },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 10,
  },
  input: { flex: 1, color: COLORS.text, fontSize: 15 },
  submitBtn: { marginTop: 8, marginBottom: 16 },
  submitGradient: {
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: { fontSize: 16, fontWeight: '700', color: COLORS.background },
  freeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
  },
  freeInfoText: { flex: 1, fontSize: 12, color: COLORS.textMuted, lineHeight: 18 },
});
