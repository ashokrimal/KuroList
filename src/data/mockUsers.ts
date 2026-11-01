/**
 * Mock Users & Profiles for KuroList
 */

import { UserProfile, LibraryEntry, Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_blood',
    title: 'First Step',
    description: 'Add your first anime or manga to your library',
    icon: 'Sword',
    tier: 'bronze',
    xp: 50,
    unlocked: true,
    unlockedAt: '2024-01-10',
    progress: 1,
    maxProgress: 1
  },
  {
    id: 'marathon_runner',
    title: 'Marathon Runner',
    description: 'Complete 5 different anime series',
    icon: 'Flame',
    tier: 'silver',
    xp: 200,
    unlocked: true,
    unlockedAt: '2024-03-15',
    progress: 5,
    maxProgress: 5
  },
  {
    id: 'critic_eye',
    title: "Critic's Eye",
    description: 'Write 3 in-depth reviews with ratings and pros/cons',
    icon: 'Feather',
    tier: 'gold',
    xp: 350,
    unlocked: true,
    unlockedAt: '2024-06-20',
    progress: 3,
    maxProgress: 3
  },
  {
    id: 'manga_worm',
    title: 'Scroll Scholar',
    description: 'Read over 500 manga or manhwa chapters',
    icon: 'BookOpen',
    tier: 'gold',
    xp: 400,
    unlocked: false,
    progress: 410,
    maxProgress: 500
  },
  {
    id: 'social_butterfly',
    title: 'Otaku Network',
    description: 'Follow 5 other creators in the community',
    icon: 'Users',
    tier: 'silver',
    xp: 150,
    unlocked: false,
    progress: 3,
    maxProgress: 5
  },
  {
    id: 'masterpiece_collector',
    title: 'Tier of Legends',
    description: 'Give a perfect 10/10 score to at least 3 titles',
    icon: 'Crown',
    tier: 'diamond',
    xp: 500,
    unlocked: true,
    unlockedAt: '2024-08-01',
    progress: 3,
    maxProgress: 3
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'user_ashokrimal',
  username: 'ashokrimal',
  displayName: 'Ashok Rimal',
  email: 'info.ashokrimal@gmail.com',
  avatar: '/src/assets/images/user_avatar_ashok_1793517808935.jpg',
  banner: '/src/assets/images/hero_cinematic_anime_1793517807898.jpg',
  bio: 'Anime archivist, manga collector & visual storyteller. Deep admirer of Madhouse, Studio Wit, and narratives exploring mortality, courage, and existential philosophy.',
  country: 'Tokyo & Kathmandu',
  joinDate: 'March 2022',
  isOnline: true,
  role: 'admin',
  level: 18,
  xp: 4850,
  nextLevelXp: 6000,
  followersCount: 1420,
  followingCount: 384,
  badges: [
    { id: 'b1', name: 'Otaku Sage', description: 'Over 1,200 episodes logged with high critical score rigor', icon: 'Award', tier: 'diamond' },
    { id: 'b2', name: 'Top Reviewer', description: 'Authored multiple community-voted helpful reviews', icon: 'Sparkles', tier: 'gold' },
    { id: 'b3', name: 'Manga Devotee', description: 'Over 400 chapters logged across classic seinen & manhwa', icon: 'BookOpen', tier: 'silver' },
    { id: 'b4', name: 'Founding Member', description: 'Early access member of KuroList community', icon: 'Star', tier: 'bronze' }
  ],
  achievements: INITIAL_ACHIEVEMENTS,
  personality: {
    title: 'Philosophical Shonen Strategist',
    tagline: 'You appreciate patient character-driven poignancy as intensely as tactical sakuga climaxes.',
    dominantGenre: 'Adventure & Dark Fantasy',
    watchingPace: 'Selective Critic',
    vibeDescription: 'Your library prioritizes high narrative impact and thematic depth over seasonal hype. You rewatch key emotional scenes and write nuanced review threads.',
    compatibleArchetypes: ['Melancholic Wanderer', 'Tactical Mastermind', 'Fantasy Cartographer']
  },
  favoriteMediaIds: ['frieren-beyond-journey', 'attack-on-titan-final', 'steins-gate', 'berserk-manga'],
  favoriteCharacterNames: ['Frieren', 'Levi Ackerman', 'Rintarou Okabe', 'Guts'],
  favoriteStudios: ['Madhouse', 'MAPPA', 'ufotable', 'Science SARU'],
  privacy: {
    publicLibrary: true,
    publicFavorites: true,
    publicActivity: true
  }
};

export const INITIAL_USER_LIBRARY: LibraryEntry[] = [
  {
    id: 'lib_1',
    userId: 'user_ashokrimal',
    mediaId: 'frieren-beyond-journey',
    mediaType: 'anime',
    status: 'watching',
    progress: 24,
    totalProgress: 28,
    score: 10,
    notes: 'The pacing, melancholic passage of time, and soundtrack by Evan Call make this an absolute modern benchmark.',
    isFavorite: true,
    startDate: '2023-10-01',
    createdAt: '2023-10-01T12:00:00Z',
    updatedAt: '2026-10-25T14:30:00Z'
  },
  {
    id: 'lib_2',
    userId: 'user_ashokrimal',
    mediaId: 'solo-leveling-s2',
    mediaType: 'anime',
    status: 'watching',
    progress: 9,
    totalProgress: 13,
    score: 8.5,
    notes: 'Incredible shadow summon sound design and fluid action animation.',
    isFavorite: false,
    startDate: '2025-01-12',
    createdAt: '2025-01-12T10:00:00Z',
    updatedAt: '2026-10-28T09:00:00Z'
  },
  {
    id: 'lib_3',
    userId: 'user_ashokrimal',
    mediaId: 'jujutsu-kaisen-s2',
    mediaType: 'anime',
    status: 'completed',
    progress: 23,
    totalProgress: 23,
    score: 9.5,
    notes: 'Shibuya incident is an unmatched visual tour-de-force from MAPPA animators.',
    isFavorite: true,
    startDate: '2023-07-06',
    finishDate: '2023-12-28',
    createdAt: '2023-07-06T10:00:00Z',
    updatedAt: '2023-12-28T18:00:00Z'
  },
  {
    id: 'lib_4',
    userId: 'user_ashokrimal',
    mediaId: 'attack-on-titan-final',
    mediaType: 'anime',
    status: 'completed',
    progress: 28,
    totalProgress: 28,
    score: 10,
    notes: 'Generational storytelling. The political, philosophical, and moral ambiguity remains unmatched.',
    isFavorite: true,
    startDate: '2021-01-10',
    finishDate: '2023-11-05',
    createdAt: '2021-01-10T10:00:00Z',
    updatedAt: '2023-11-05T20:00:00Z'
  },
  {
    id: 'lib_5',
    userId: 'user_ashokrimal',
    mediaId: 'steins-gate',
    mediaType: 'anime',
    status: 'completed',
    progress: 24,
    totalProgress: 24,
    score: 10,
    notes: 'The golden standard for sci-fi time travel narrative tightness.',
    isFavorite: true,
    createdAt: '2022-04-12T10:00:00Z',
    updatedAt: '2022-04-20T10:00:00Z'
  },
  {
    id: 'lib_6',
    userId: 'user_ashokrimal',
    mediaId: 'dandadan',
    mediaType: 'anime',
    status: 'completed',
    progress: 12,
    totalProgress: 12,
    score: 8.8,
    notes: 'Science SARU delivering psychedelic madness and heartwarming chemistry.',
    isFavorite: false,
    createdAt: '2024-10-10T10:00:00Z',
    updatedAt: '2024-12-20T10:00:00Z'
  },
  {
    id: 'lib_7',
    userId: 'user_ashokrimal',
    mediaId: 'berserk-manga',
    mediaType: 'manga',
    status: 'reading',
    progress: 260,
    totalProgress: 376,
    volumesRead: 28,
    score: 10,
    notes: 'Miura’s pen work is divine. The Conviction Arc stands as a monument to comic illustration.',
    isFavorite: true,
    createdAt: '2022-08-15T10:00:00Z',
    updatedAt: '2026-10-20T11:00:00Z'
  },
  {
    id: 'lib_8',
    userId: 'user_ashokrimal',
    mediaId: 'chainsaw-man-manga',
    mediaType: 'manga',
    status: 'reading',
    progress: 150,
    totalProgress: 185,
    volumesRead: 15,
    score: 9.0,
    notes: 'Part 2 explores Asa Mitaka and the War Devil with brilliant dry absurdity.',
    isFavorite: false,
    createdAt: '2023-01-05T10:00:00Z',
    updatedAt: '2026-10-15T11:00:00Z'
  },
  {
    id: 'lib_9',
    userId: 'user_ashokrimal',
    mediaId: 'witch-hat-atelier',
    mediaType: 'anime',
    status: 'plan_to_watch',
    progress: 0,
    totalProgress: 24,
    score: 0,
    notes: 'Anticipated anime premiere by BUG FILMS.',
    isFavorite: false,
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z'
  }
];

export const OTHER_USERS: UserProfile[] = [
  {
    id: 'user_kenji',
    username: 'senpai_kenji',
    displayName: 'Kenji Sato',
    email: 'kenji@example.com',
    avatar: 'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
    banner: '/src/assets/images/anime_card_nebula_1793517807647.jpg',
    bio: 'Keyframe animation nerd. Tracking Sakuga cuts since 2012. Shingo Yamashita disciple.',
    country: 'Tokyo, Japan',
    joinDate: 'January 2021',
    isOnline: true,
    role: 'user',
    level: 24,
    xp: 7800,
    nextLevelXp: 9000,
    followersCount: 3200,
    followingCount: 412,
    badges: [
      { id: 'b_k1', name: 'Sakuga Hunter', description: 'Identified 50+ key animation directors', icon: 'Film', tier: 'diamond' }
    ],
    achievements: [],
    personality: {
      title: 'Sakuga Vanguard',
      tagline: 'You watch anime frame-by-frame to analyze timing and choreography.',
      dominantGenre: 'Action & Supernatural',
      watchingPace: 'Binge Master',
      vibeDescription: 'Loves raw animator passion, experimental smears, and fluid combat cuts.',
      compatibleArchetypes: ['Philosophical Shonen Strategist', 'Cinematic Purist']
    },
    favoriteMediaIds: ['jujutsu-kaisen-s2', 'chainsaw-man', 'dandadan'],
    favoriteCharacterNames: ['Satoru Gojo', 'Denji'],
    favoriteStudios: ['MAPPA', 'Science SARU'],
    privacy: { publicLibrary: true, publicFavorites: true, publicActivity: true }
  },
  {
    id: 'user_sakura',
    username: 'sakura_reads',
    displayName: 'Sakura Tanaka',
    email: 'sakura@example.com',
    avatar: 'https://cdn.myanimelist.net/images/characters/11/524314.jpg',
    banner: '/src/assets/images/frieren_fantasy_banner_1793517808620.jpg',
    bio: 'Finding light in quiet melancholy. Passionate about slice-of-life, classical music adaptations, and healing manga.',
    country: 'Kyoto, Japan',
    joinDate: 'May 2022',
    isOnline: false,
    role: 'user',
    level: 15,
    xp: 3900,
    nextLevelXp: 4500,
    followersCount: 890,
    followingCount: 220,
    badges: [
      { id: 'b_s1', name: 'Iyashikei Spirit', description: 'Master of relaxing and introspective anime', icon: 'Heart', tier: 'gold' }
    ],
    achievements: [],
    personality: {
      title: 'Poetic Melancholy Healer',
      tagline: 'You believe stories are best when they give human warmth to lonely souls.',
      dominantGenre: 'Slice of Life & Drama',
      watchingPace: 'Seasonal Follower',
      vibeDescription: 'Treasures watercolor aesthetics, orchestral scores, and tea-drinking moments.',
      compatibleArchetypes: ['Melancholic Wanderer', 'Philosophical Shonen Strategist']
    },
    favoriteMediaIds: ['frieren-beyond-journey', 'bocchi-the-rock'],
    favoriteCharacterNames: ['Frieren', 'Fern', 'Hitori Gotou'],
    favoriteStudios: ['Kyoto Animation', 'Madhouse'],
    privacy: { publicLibrary: true, publicFavorites: true, publicActivity: true }
  }
];
