/**
 * Initial Social Activity, Reviews, Discussions, and Collections
 */

import { SocialActivity, MediaReview, CustomCollection, CommunityTopic, AppNotification } from '../types';

export const INITIAL_ACTIVITIES: SocialActivity[] = [
  {
    id: 'act_1',
    userId: 'user_kenji',
    username: 'senpai_kenji',
    displayName: 'Kenji Sato',
    avatar: 'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
    type: 'progress_update',
    mediaId: 'solo-leveling-s2',
    mediaTitle: 'Solo Leveling: Arise from the Shadow',
    mediaCover: 'https://cdn.myanimelist.net/images/anime/1585/140023l.jpg',
    mediaType: 'anime',
    progress: 10,
    totalProgress: 13,
    timestamp: '15 minutes ago',
    likes: ['user_ashokrimal'],
    comments: [
      {
        id: 'c1',
        userId: 'user_ashokrimal',
        username: 'ashokrimal',
        displayName: 'Ashok Rimal',
        avatar: '/src/assets/images/user_avatar_ashok_1793517808935.jpg',
        text: 'The sound design on the Shadow Army roar in this episode was insane!',
        timestamp: '10 minutes ago'
      }
    ]
  },
  {
    id: 'act_2',
    userId: 'user_sakura',
    username: 'sakura_reads',
    displayName: 'Sakura Tanaka',
    avatar: 'https://cdn.myanimelist.net/images/characters/11/524314.jpg',
    type: 'reviewed',
    mediaId: 'frieren-beyond-journey',
    mediaTitle: "Frieren: Beyond Journey's End",
    mediaCover: 'https://cdn.myanimelist.net/images/anime/1015/138062l.jpg',
    mediaType: 'anime',
    score: 10,
    reviewSnippet: 'A generational meditation on memory and quiet love. Not a single second is wasted.',
    timestamp: '2 hours ago',
    likes: ['user_ashokrimal', 'user_kenji'],
    comments: []
  },
  {
    id: 'act_3',
    userId: 'user_ashokrimal',
    username: 'ashokrimal',
    displayName: 'Ashok Rimal',
    avatar: '/src/assets/images/user_avatar_ashok_1793517808935.jpg',
    type: 'completed',
    mediaId: 'dandadan',
    mediaTitle: 'Dandadan',
    mediaCover: 'https://cdn.myanimelist.net/images/anime/1117/143527l.jpg',
    mediaType: 'anime',
    score: 8.8,
    timestamp: 'Yesterday',
    likes: ['user_kenji'],
    comments: [
      {
        id: 'c2',
        userId: 'user_kenji',
        username: 'senpai_kenji',
        displayName: 'Kenji Sato',
        avatar: 'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
        text: 'Turbo Granny chase sequence was pure sakuga perfection.',
        timestamp: 'Yesterday'
      }
    ]
  }
];

export const INITIAL_REVIEWS: MediaReview[] = [
  {
    id: 'rev_1',
    mediaId: 'frieren-beyond-journey',
    mediaTitle: "Frieren: Beyond Journey's End",
    mediaCover: 'https://cdn.myanimelist.net/images/anime/1015/138062l.jpg',
    mediaType: 'anime',
    userId: 'user_ashokrimal',
    username: 'ashokrimal',
    displayName: 'Ashok Rimal',
    avatar: '/src/assets/images/user_avatar_ashok_1793517808935.jpg',
    rating: 10,
    title: 'The Poetry of Passing Time — A Flawless Masterpiece',
    content: 'What does it mean to live for millennia when the people who touch your heart only burn bright for a fraction of that? Frieren transcends traditional fantasy tropes by starting where other stories end. Keiichiro Saito’s direction and Evan Call’s Celtic orchestral arrangements create an ethereal, grounded emotional resonance. When the action does arrive—such as the First-Class Mage Exam battles—it is animated with astonishing weight, visual clarity, and kinetic punch. Easily one of the finest anime productions ever crafted.',
    pros: ['Transcendent emotional storytelling', 'Unbelievable Madhouse animation', 'Breathtaking Evan Call soundtrack', 'Subtle character growth'],
    cons: ['Deliberate contemplative pacing may test pure adrenaline-seekers'],
    hasSpoilers: false,
    helpfulCount: 142,
    likedBy: ['user_kenji', 'user_sakura'],
    comments: [
      {
        id: 'rc_1',
        userId: 'user_kenji',
        username: 'senpai_kenji',
        displayName: 'Kenji Sato',
        avatar: 'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
        content: 'Agreed 100%. The episode 26 Zoltraak duel with the clone was an all-time highlight.',
        createdAt: '3 days ago'
      }
    ],
    createdAt: '2024-03-24'
  },
  {
    id: 'rev_2',
    mediaId: 'attack-on-titan-final',
    mediaTitle: 'Attack on Titan: The Final Season',
    mediaCover: 'https://cdn.myanimelist.net/images/anime/1000/110531l.jpg',
    mediaType: 'anime',
    userId: 'user_ashokrimal',
    username: 'ashokrimal',
    displayName: 'Ashok Rimal',
    avatar: '/src/assets/images/user_avatar_ashok_1793517808935.jpg',
    rating: 10,
    title: 'A Devastating Tragedy on the Cycles of Human Violence',
    content: 'Isayama and MAPPA delivered a monumental finale that refuses easy moral answers. Eren Jaeger’s tragic descent from an enslaved boy seeking freedom to an omnicidal harbinger of ruin is one of fiction’s most compelling character arcs. The musical score by Hiroyuki Sawano and Kohta Yamamoto elevates every confrontation to mythological proportions.',
    pros: ['Peerless narrative complexity', 'Deep philosophical weight', 'Incredible orchestral peaks'],
    cons: ['Heavily emotionally taxing'],
    hasSpoilers: true,
    helpfulCount: 98,
    likedBy: ['user_kenji'],
    comments: [],
    createdAt: '2023-11-10'
  },
  {
    id: 'rev_3',
    mediaId: 'solo-leveling-s2',
    mediaTitle: 'Solo Leveling: Arise from the Shadow',
    mediaCover: 'https://cdn.myanimelist.net/images/anime/1585/140023l.jpg',
    mediaType: 'anime',
    userId: 'user_kenji',
    username: 'senpai_kenji',
    displayName: 'Kenji Sato',
    avatar: 'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
    rating: 9,
    title: 'Pure Hype and Peak Power Fantasy Executed to Perfection',
    content: 'A-1 Pictures stepped up their compositing and impact frames this season. Sung Jinwoo stepping into the red gate battles has that rare visceral rush that made 90s action iconic. Taito Ban gives an intimidating vocal performance.',
    pros: ['Exhilarating combat choreography', 'Outstanding sound engineering', 'Great fidelity to the manhwa art'],
    cons: ['Supporting characters remain secondary to Jinwoo'],
    hasSpoilers: false,
    helpfulCount: 64,
    likedBy: ['user_ashokrimal'],
    comments: [],
    createdAt: '2025-02-05'
  }
];

export const INITIAL_COLLECTIONS: CustomCollection[] = [
  {
    id: 'col_1',
    userId: 'user_ashokrimal',
    username: 'ashokrimal',
    title: 'Top 10 Masterpieces of All Time',
    description: 'The defining anime and manga achievements that changed the medium forever. Uncompromising vision, emotional resonance, and world-class craft.',
    isPublic: true,
    itemIds: ['frieren-beyond-journey', 'attack-on-titan-final', 'steins-gate', 'berserk-manga', 'vagabond-manga'],
    coverImage: '/src/assets/images/hero_cinematic_anime_1793517807898.jpg',
    createdAt: '2024-04-10'
  },
  {
    id: 'col_2',
    userId: 'user_ashokrimal',
    username: 'ashokrimal',
    title: 'Dark Fantasy & Psychological Depths',
    description: 'Grim narratives where moral ambiguity reigns supreme. Gritty combat, psychological dread, and unforgettable protagonists.',
    isPublic: true,
    itemIds: ['berserk-manga', 'chainsaw-man-manga', 'attack-on-titan-final', 'jujutsu-kaisen-s2'],
    coverImage: '/src/assets/images/anime_card_nebula_1793517807647.jpg',
    createdAt: '2024-08-15'
  },
  {
    id: 'col_3',
    userId: 'user_sakura',
    username: 'sakura_reads',
    title: 'Melancholic Healing & Heartwarmers',
    description: 'Gentle, contemplative masterpieces to warm your heart during quiet rainy evenings.',
    isPublic: true,
    itemIds: ['frieren-beyond-journey', 'bocchi-the-rock', 'witch-hat-atelier'],
    coverImage: '/src/assets/images/frieren_fantasy_banner_1793517808620.jpg',
    createdAt: '2024-09-02'
  }
];

export const INITIAL_TOPICS: CommunityTopic[] = [
  {
    id: 'top_1',
    title: 'Frieren Season 2: What Arc Are You Most Eager to See Animated?',
    category: 'Theories',
    authorId: 'user_ashokrimal',
    username: 'ashokrimal',
    displayName: 'Ashok Rimal',
    avatar: '/src/assets/images/user_avatar_ashok_1793517808935.jpg',
    content: 'With the immense success of Season 1, the upcoming Northern Plateau journey and the encounters with the Great Demons will be a technical spectacle. The emotional beats between Macht of El Dorado and Gluck represent one of the deepest dialogues on morality in manga history. What scenes are you anticipating most?',
    mediaTag: { id: 'frieren-beyond-journey', title: "Frieren: Beyond Journey's End" },
    viewsCount: 3420,
    isPinned: true,
    createdAt: '2 days ago',
    poll: {
      question: 'Which anticipated moment from the upcoming arc holds your highest hype?',
      options: [
        { id: 'opt_1', text: 'El Dorado & Golden Magic Arc', votes: 148 },
        { id: 'opt_2', text: 'Mage Exam aftermath & Northern Journeys', votes: 64 },
        { id: 'opt_3', text: 'Hero Party flashback reveals', votes: 92 },
        { id: 'opt_4', text: 'Himmel and Frieren ring reunion scenes', votes: 110 }
      ],
      userVotedOptionId: 'opt_1'
    },
    replies: [
      {
        id: 'rep_1',
        authorId: 'user_kenji',
        username: 'senpai_kenji',
        displayName: 'Kenji Sato',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        content: 'Macht vs Denken is going to break the internet if Keiichiro Saito returns to direct. The sheer philosophical clash of gold transmutation is peak cinema.',
        createdAt: '1 day ago',
        likes: ['user_ashokrimal']
      },
      {
        id: 'rep_2',
        authorId: 'user_sakura',
        username: 'sakura_reads',
        displayName: 'Sakura Tanaka',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
        content: 'I just want more quiet cooking and tavern moments with Fern, Stark, and Frieren.',
        createdAt: '18 hours ago',
        likes: []
      }
    ]
  },
  {
    id: 'top_2',
    title: 'Top 3 Anime Openings of the 2020s So Far — Drop Your Picks!',
    category: 'General',
    authorId: 'user_kenji',
    username: 'senpai_kenji',
    displayName: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
    content: 'Between Creepy Nuts with Otonoke (Dandadan), Yoasobi with Idol (Oshi no Ko), King Gnu with SPECIALZ (Jujutsu Kaisen), and Eve with Kaikai Kitan, the production values have skyrocketed. What is your uncontested top 3?',
    viewsCount: 1890,
    isPinned: false,
    createdAt: '3 days ago',
    replies: [
      {
        id: 'rep_3',
        authorId: 'user_ashokrimal',
        username: 'ashokrimal',
        displayName: 'Ashok Rimal',
        avatar: '/src/assets/images/user_avatar_ashok_1793517808935.jpg',
        content: '1. SPECIALZ - King Gnu (The Shibuya mood is haunting)\n2. Yuusha - YOASOBI (Frieren)\n3. Kick Back - Kenshi Yonezu (Chainsaw Man)',
        createdAt: '2 days ago',
        likes: ['user_kenji']
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    type: 'like',
    actor: {
      username: 'senpai_kenji',
      displayName: 'Kenji Sato',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80'
    },
    title: 'Liked your review',
    description: 'Kenji Sato liked your review of Frieren: Beyond Journey\'s End',
    link: '#reviews',
    isRead: false,
    createdAt: '10 minutes ago'
  },
  {
    id: 'notif_2',
    type: 'airing_reminder',
    actor: {
      username: 'kuro_system',
      displayName: 'KuroList Schedule',
      avatar: '/src/assets/images/user_avatar_ashok_1793517808935.jpg'
    },
    title: 'New Episode Airing Today',
    description: 'Solo Leveling Season 2 Episode 10 airs in 3 hours!',
    link: '#schedule',
    isRead: false,
    createdAt: '1 hour ago'
  },
  {
    id: 'notif_3',
    type: 'achievement',
    actor: {
      username: 'kuro_bot',
      displayName: 'Achievements',
      avatar: '/src/assets/images/user_avatar_ashok_1793517808935.jpg'
    },
    title: 'Achievement Unlocked: Tier of Legends!',
    description: 'You earned 500 XP for rating 3 titles with a perfect 10/10.',
    link: '#achievements',
    isRead: true,
    createdAt: '3 days ago'
  }
];
