# Peul Music App — Guide d'installation

## Prérequis
- Node.js 18+ installé
- npm ou yarn
- Expo Go app sur votre téléphone (iOS ou Android)

## Installation

```bash
# 1. Aller dans le dossier du projet
cd PeulMusicApp

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm start
```

## Tester sur votre téléphone

1. Installez **Expo Go** sur l'App Store ou Google Play
2. Scannez le QR code affiché dans le terminal
3. L'app s'ouvre sur votre téléphone 🎵

## Structure du projet

```
PeulMusicApp/
├── App.tsx                      # Point d'entrée
├── src/
│   ├── types/index.ts           # Types TypeScript
│   ├── data/mockData.ts         # Données (artistes, chansons...)
│   ├── theme/colors.ts          # Palette de couleurs
│   ├── context/PlayerContext.tsx # Lecteur audio global
│   ├── navigation/AppNavigator.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx       # Accueil
│   │   ├── ExploreScreen.tsx    # Recherche & Filtres
│   │   ├── LibraryScreen.tsx    # Bibliothèque
│   │   ├── ProfileScreen.tsx    # Profil
│   │   ├── PlayerScreen.tsx     # Lecteur plein écran
│   │   ├── ArtistDetailScreen.tsx
│   │   └── AlbumDetailScreen.tsx
│   └── components/
│       └── MiniPlayer.tsx       # Mini lecteur persistant
```

## Prochaines étapes

- [ ] Intégrer un vrai backend (Supabase / Firebase)
- [ ] Upload de musiques par les contributeurs
- [ ] Streaming audio réel (S3 / Cloudinary)
- [ ] Authentification utilisateur
- [ ] Système de commentaires et partage
- [ ] Recherche avancée par dialecte peul
