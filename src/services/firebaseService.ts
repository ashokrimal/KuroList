/**
 * Firebase Firestore & Authentication Service
 * KuroList - Real-time cloud persistence and Google Sign-in
 */

import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { auth, googleAuthProvider, db, testFirestoreConnection } from '../lib/firebase';
import { LibraryEntry, UserProfile, MediaReview, CommunityTopic } from '../types';

export { auth, db, testFirestoreConnection };

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle(): Promise<FirebaseUser | null> {
  try {
    const result = await signInWithPopup(auth, googleAuthProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
}

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email: string, password: string): Promise<FirebaseUser> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return cred.user;
  } catch (error: any) {
    console.error('Email Sign-In failed:', error);
    throw error;
  }
}

/**
 * Sign up with Email and Password
 */
export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<FirebaseUser> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName && cred.user) {
      await updateProfile(cred.user, { displayName });
    }
    return cred.user;
  } catch (error: any) {
    console.error('Email Sign-Up failed:', error);
    throw error;
  }
}

/**
 * Reset password via Email
 */
export async function resetUserPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error: any) {
    console.error('Password reset failed:', error);
    throw error;
  }
}

/**
 * Update password for currently signed-in user
 */
export async function updateUserPassword(newPassword: string): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('Please sign in with your email and password to change your password.');
  }
  try {
    await updatePassword(auth.currentUser, newPassword);
  } catch (error: any) {
    console.error('Password update failed:', error);
    if (error.code === 'auth/requires-recent-login') {
      throw new Error('For security, this action requires a recent sign-in. Please log out and sign in again before changing password.');
    }
    throw error;
  }
}

/**
 * Update user display name and avatar in Firebase Auth
 */
export async function updateUserAuthProfile(displayName?: string, photoURL?: string): Promise<void> {
  if (auth.currentUser) {
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName ?? auth.currentUser.displayName,
        photoURL: photoURL ?? auth.currentUser.photoURL
      });
    } catch (error) {
      console.warn('Firebase updateProfile error:', error);
    }
  }
}

/**
 * Sign out of Firebase
 */
export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

/**
 * Listen to Firebase Auth state changes
 */
export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Save / Update User Profile in Firestore
 */
export async function saveUserProfile(user: UserProfile): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, {
      uid: user.id,
      username: user.username,
      displayName: user.displayName,
      avatarUrl: user.avatar,
      bannerUrl: user.banner,
      bio: user.bio,
      country: user.country,
      joinDate: user.joinDate,
      level: user.level,
      xp: user.xp,
      badges: user.badges.map(b => b.id),
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      role: user.role,
      isPublic: user.privacy.publicLibrary,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Could not save user profile to Firestore:', error);
  }
}

/**
 * Save / Update a Library Entry in Firestore
 */
export async function saveLibraryEntryToFirestore(userId: string, entry: LibraryEntry): Promise<void> {
  try {
    const entryRef = doc(db, 'users', userId, 'library', entry.mediaId);
    await setDoc(entryRef, {
      id: entry.id,
      userId,
      mediaId: entry.mediaId,
      format: entry.mediaType.toUpperCase(),
      status: entry.status.toUpperCase(),
      progress: entry.progress,
      totalProgress: entry.totalProgress,
      volumesProgress: entry.volumesRead || 0,
      score: entry.score,
      isFavorite: entry.isFavorite,
      notes: entry.notes || '',
      startDate: entry.startDate || '',
      finishDate: entry.finishDate || '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.warn('Could not save library entry to Firestore:', error);
  }
}

/**
 * Remove Library Entry from Firestore
 */
export async function removeLibraryEntryFromFirestore(userId: string, mediaId: string): Promise<void> {
  try {
    const entryRef = doc(db, 'users', userId, 'library', mediaId);
    await deleteDoc(entryRef);
  } catch (error) {
    console.warn('Could not delete library entry from Firestore:', error);
  }
}

/**
 * Fetch all library entries for a user from Firestore
 */
export async function fetchUserLibraryFromFirestore(userId: string): Promise<Partial<LibraryEntry>[]> {
  try {
    const libCollection = collection(db, 'users', userId, 'library');
    const snapshot = await getDocs(libCollection);
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: data.id || docSnap.id,
        userId: data.userId || userId,
        mediaId: data.mediaId,
        mediaType: (data.format?.toLowerCase() === 'manga' ? 'manga' : 'anime') as any,
        status: (data.status?.toLowerCase() || 'watching') as any,
        progress: data.progress ?? 0,
        totalProgress: data.totalProgress ?? 12,
        volumesRead: data.volumesProgress ?? 0,
        score: data.score ?? 0,
        notes: data.notes ?? '',
        isFavorite: data.isFavorite ?? false,
        startDate: data.startDate ?? '',
        finishDate: data.finishDate ?? '',
        updatedAt: data.updatedAt ?? new Date().toISOString()
      };
    });
  } catch (error) {
    console.warn('Could not fetch library from Firestore:', error);
    return [];
  }
}

/**
 * Listen to live library updates from Firestore
 */
export function subscribeToUserLibrary(userId: string, onUpdate: (entries: Partial<LibraryEntry>[]) => void) {
  try {
    const libCollection = collection(db, 'users', userId, 'library');
    return onSnapshot(libCollection, snapshot => {
      const entries = snapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: data.id || docSnap.id,
          userId: data.userId || userId,
          mediaId: data.mediaId,
          mediaType: (data.format?.toLowerCase() === 'manga' ? 'manga' : 'anime') as any,
          status: (data.status?.toLowerCase() || 'watching') as any,
          progress: data.progress ?? 0,
          totalProgress: data.totalProgress ?? 12,
          volumesRead: data.volumesProgress ?? 0,
          score: data.score ?? 0,
          notes: data.notes ?? '',
          isFavorite: data.isFavorite ?? false,
          startDate: data.startDate ?? '',
          finishDate: data.finishDate ?? '',
          updatedAt: data.updatedAt ?? new Date().toISOString()
        };
      });
      onUpdate(entries);
    }, error => {
      console.warn('Library snapshot error:', error);
    });
  } catch (error) {
    console.warn('subscribeToUserLibrary failed:', error);
    return () => {};
  }
}

/**
 * Save a review to Firestore
 */
export async function saveReviewToFirestore(review: MediaReview): Promise<void> {
  try {
    const reviewRef = doc(db, 'reviews', review.id);
    await setDoc(reviewRef, {
      id: review.id,
      userId: review.userId,
      username: review.username,
      displayName: review.displayName,
      avatar: review.avatar,
      mediaId: review.mediaId,
      mediaTitle: review.mediaTitle,
      mediaType: review.mediaType,
      mediaCover: review.mediaCover,
      score: review.rating,
      summary: review.title,
      content: review.content,
      containsSpoilers: review.hasSpoilers,
      helpfulCount: review.helpfulCount,
      createdAt: review.createdAt
    });
  } catch (error) {
    console.warn('Could not save review to Firestore:', error);
  }
}

/**
 * Save a community topic to Firestore
 */
export async function saveTopicToFirestore(topic: CommunityTopic): Promise<void> {
  try {
    const topicRef = doc(db, 'communityTopics', topic.id);
    await setDoc(topicRef, {
      id: topic.id,
      userId: topic.authorId,
      username: topic.username,
      displayName: topic.displayName,
      avatar: topic.avatar,
      title: topic.title,
      category: topic.category,
      content: topic.content,
      viewsCount: topic.viewsCount,
      replyCount: topic.replies.length,
      createdAt: topic.createdAt
    });
  } catch (error) {
    console.warn('Could not save community topic to Firestore:', error);
  }
}
