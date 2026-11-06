/**
 * KuroList - MyAnimeList (MAL) & AniList Import / Export Engine
 * Provides standard MAL XML export/import, KuroList JSON backups,
 * live AniList GraphQL sync, and intelligent library diffing.
 */

import { LibraryEntry, MediaItem, MediaType, LibraryStatus } from '../types';

/**
 * Maps KuroList status to MAL XML status format
 */
export function toMalStatus(status: string): string {
  switch (status) {
    case 'watching':
    case 'reading':
      return 'Watching';
    case 'completed':
      return 'Completed';
    case 'on_hold':
      return 'On-Hold';
    case 'dropped':
      return 'Dropped';
    case 'plan_to_watch':
    case 'plan_to_read':
      return 'Plan to Watch';
    default:
      return 'Watching';
  }
}

/**
 * Maps MAL status string to KuroList status
 */
export function fromMalStatus(status: string, isAnime = true): LibraryStatus {
  const s = (status || '').trim().toLowerCase();
  if (s.includes('watch') || s.includes('reading') || s === '1') {
    return isAnime ? 'watching' : 'reading';
  }
  if (s.includes('complete') || s === '2') {
    return 'completed';
  }
  if (s.includes('hold') || s === '3') {
    return 'on_hold';
  }
  if (s.includes('drop') || s === '4') {
    return 'dropped';
  }
  if (s.includes('plan') || s === '6') {
    return isAnime ? 'plan_to_watch' : 'plan_to_read';
  }
  return isAnime ? 'watching' : 'reading';
}

/**
 * Normalizes title string for robust fuzzy matching
 */
export function normalizeTitle(title: string): string {
  return (title || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parsed media entry from MAL XML, JSON, or AniList
 */
export interface MalParsedEntry {
  malId: number;
  title: string;
  mediaType: MediaType;
  watchedEpisodes: number; // progress (episodes or chapters)
  totalEpisodes: number;   // total (episodes or chapters)
  score: number;
  status: LibraryStatus;
  notes?: string;
  format?: string;
}

/**
 * Export user library to official MyAnimeList XML format
 */
export function generateMalXmlExport(
  username: string,
  library: LibraryEntry[],
  mediaItems: MediaItem[]
): string {
  const animeEntries = library.filter(e => e.mediaType === 'anime');
  const mangaEntries = library.filter(e => e.mediaType === 'manga' || e.mediaType === 'manhwa');
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8" ?>\n`;
  xml += `<!--\n  Exported from KuroList NextGen (https://kurolist.app)\n  Compatible with MyAnimeList.net and AniList.co\n  Date: ${now}\n-->\n`;
  xml += `<myanimelist>\n`;
  xml += `  <myinfo>\n`;
  xml += `    <user_id>1001</user_id>\n`;
  xml += `    <user_name><![CDATA[${username}]]></user_name>\n`;
  xml += `    <user_export_type>1</user_export_type>\n`;
  xml += `    <user_total_anime>${animeEntries.length}</user_total_anime>\n`;
  xml += `    <user_total_watching>${animeEntries.filter(e => e.status === 'watching').length}</user_total_watching>\n`;
  xml += `    <user_total_completed>${animeEntries.filter(e => e.status === 'completed').length}</user_total_completed>\n`;
  xml += `    <user_total_onhold>${animeEntries.filter(e => e.status === 'on_hold').length}</user_total_onhold>\n`;
  xml += `    <user_total_dropped>${animeEntries.filter(e => e.status === 'dropped').length}</user_total_dropped>\n`;
  xml += `    <user_total_plantowatch>${animeEntries.filter(e => e.status === 'plan_to_watch').length}</user_total_plantowatch>\n`;
  xml += `  </myinfo>\n`;

  animeEntries.forEach(entry => {
    const media = mediaItems.find(m => m.id === entry.mediaId);
    const title = media?.title || 'Unknown Anime';
    const totalEpisodes = entry.totalProgress || media?.episodes || 12;
    const malId = media?.malId || parseInt(entry.mediaId.replace(/\D/g, '') || '0', 10) || 1;

    xml += `  <anime>\n`;
    xml += `    <series_animedb_id>${malId}</series_animedb_id>\n`;
    xml += `    <series_title><![CDATA[${title}]]></series_title>\n`;
    xml += `    <series_type>${media?.format || 'TV'}</series_type>\n`;
    xml += `    <series_episodes>${totalEpisodes}</series_episodes>\n`;
    xml += `    <my_id>${entry.id}</my_id>\n`;
    xml += `    <my_watched_episodes>${entry.progress}</my_watched_episodes>\n`;
    xml += `    <my_start_date>${entry.startDate || '0000-00-00'}</my_start_date>\n`;
    xml += `    <my_finish_date>${entry.finishDate || '0000-00-00'}</my_finish_date>\n`;
    xml += `    <my_score>${entry.score}</my_score>\n`;
    xml += `    <my_status>${toMalStatus(entry.status)}</my_status>\n`;
    xml += `    <my_comments><![CDATA[${entry.notes || ''}]]></my_comments>\n`;
    xml += `    <update_on_import>1</update_on_import>\n`;
    xml += `  </anime>\n`;
  });

  mangaEntries.forEach(entry => {
    const media = mediaItems.find(m => m.id === entry.mediaId);
    const title = media?.title || 'Unknown Manga';
    const totalChapters = entry.totalProgress || media?.chapters || 100;
    const malId = media?.malId || parseInt(entry.mediaId.replace(/\D/g, '') || '0', 10) || 1;

    xml += `  <manga>\n`;
    xml += `    <manga_mangadb_id>${malId}</manga_mangadb_id>\n`;
    xml += `    <manga_title><![CDATA[${title}]]></manga_title>\n`;
    xml += `    <manga_chapters>${totalChapters}</manga_chapters>\n`;
    xml += `    <my_id>${entry.id}</my_id>\n`;
    xml += `    <my_read_chapters>${entry.progress}</my_read_chapters>\n`;
    xml += `    <my_read_volumes>${entry.volumesRead || 0}</my_read_volumes>\n`;
    xml += `    <my_score>${entry.score}</my_score>\n`;
    xml += `    <my_status>${toMalStatus(entry.status)}</my_status>\n`;
    xml += `    <my_comments><![CDATA[${entry.notes || ''}]]></my_comments>\n`;
    xml += `    <update_on_import>1</update_on_import>\n`;
    xml += `  </manga>\n`;
  });

  xml += `</myanimelist>\n`;
  return xml;
}

/**
 * Export library to JSON format
 */
export function generateJsonBackup(
  username: string,
  library: LibraryEntry[],
  mediaItems: MediaItem[]
): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    source: 'KuroList NextGen',
    username,
    version: '2.0',
    library: library.map(entry => {
      const media = mediaItems.find(m => m.id === entry.mediaId);
      return {
        ...entry,
        mediaTitle: media?.title,
        mediaType: entry.mediaType
      };
    })
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Triggers a file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse a MyAnimeList XML string for both <anime> and <manga>
 */
export function parseMalXml(xmlString: string): MalParsedEntry[] {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // Check for parse error
  const parserError = xmlDoc.getElementsByTagName('parsererror');
  if (parserError.length > 0) {
    throw new Error('Malformed XML file: ' + parserError[0].textContent);
  }

  const results: MalParsedEntry[] = [];

  // 1. Parse Anime nodes
  const animeNodes = xmlDoc.getElementsByTagName('anime');
  for (let i = 0; i < animeNodes.length; i++) {
    const node = animeNodes[i];
    const malId = parseInt(node.getElementsByTagName('series_animedb_id')[0]?.textContent || '0', 10);
    const title = node.getElementsByTagName('series_title')[0]?.textContent || 'Untitled Anime';
    const watchedEpisodes = parseInt(node.getElementsByTagName('my_watched_episodes')[0]?.textContent || '0', 10);
    const totalEpisodes = parseInt(node.getElementsByTagName('series_episodes')[0]?.textContent || '12', 10);
    const score = parseFloat(node.getElementsByTagName('my_score')[0]?.textContent || '0');
    const rawStatus = node.getElementsByTagName('my_status')[0]?.textContent || 'Watching';
    const comments = node.getElementsByTagName('my_comments')[0]?.textContent || '';
    const format = node.getElementsByTagName('series_type')[0]?.textContent || 'TV';

    results.push({
      malId,
      title,
      mediaType: 'anime',
      watchedEpisodes: isNaN(watchedEpisodes) ? 0 : watchedEpisodes,
      totalEpisodes: totalEpisodes > 0 ? totalEpisodes : 12,
      score: isNaN(score) ? 0 : score,
      status: fromMalStatus(rawStatus, true),
      notes: comments,
      format
    });
  }

  // 2. Parse Manga nodes
  const mangaNodes = xmlDoc.getElementsByTagName('manga');
  for (let i = 0; i < mangaNodes.length; i++) {
    const node = mangaNodes[i];
    const malId = parseInt(node.getElementsByTagName('manga_mangadb_id')[0]?.textContent || '0', 10);
    const title = node.getElementsByTagName('manga_title')[0]?.textContent || 'Untitled Manga';
    const readChapters = parseInt(node.getElementsByTagName('my_read_chapters')[0]?.textContent || '0', 10);
    const totalChapters = parseInt(node.getElementsByTagName('manga_chapters')[0]?.textContent || '100', 10);
    const score = parseFloat(node.getElementsByTagName('my_score')[0]?.textContent || '0');
    const rawStatus = node.getElementsByTagName('my_status')[0]?.textContent || 'Reading';
    const comments = node.getElementsByTagName('my_comments')[0]?.textContent || '';

    results.push({
      malId,
      title,
      mediaType: 'manga',
      watchedEpisodes: isNaN(readChapters) ? 0 : readChapters,
      totalEpisodes: totalChapters > 0 ? totalChapters : 100,
      score: isNaN(score) ? 0 : score,
      status: fromMalStatus(rawStatus, false),
      notes: comments,
      format: 'Manga'
    });
  }

  return results;
}

/**
 * Parse JSON backup (KuroList format or AniList JSON format)
 */
export function parseBackupJson(jsonString: string): MalParsedEntry[] {
  const data = JSON.parse(jsonString);

  // KuroList format
  if (data && Array.isArray(data.library)) {
    return data.library.map((item: any, idx: number) => ({
      malId: item.mediaId ? parseInt(String(item.mediaId).replace(/\D/g, '') || `${idx + 1000}`, 10) : idx + 1000,
      title: item.mediaTitle || item.title || 'Untitled',
      mediaType: (item.mediaType as MediaType) || 'anime',
      watchedEpisodes: item.progress || item.watchedEpisodes || 0,
      totalEpisodes: item.totalProgress || item.totalEpisodes || 12,
      score: item.score || 0,
      status: item.status || 'watching',
      notes: item.notes || '',
      format: item.format || 'TV'
    }));
  }

  // AniList export or array of objects format
  const rawList = Array.isArray(data) ? data : data?.data?.MediaListCollection?.lists?.flatMap((l: any) => l.entries) || [];
  if (Array.isArray(rawList) && rawList.length > 0) {
    return rawList.map((entry: any, idx: number) => {
      const media = entry.media || {};
      const title = media.title?.english || media.title?.romaji || entry.title || 'Untitled';
      const isAnime = entry.type !== 'MANGA' && (!media.type || media.type === 'ANIME');
      return {
        malId: media.idMal || entry.malId || idx + 1000,
        title,
        mediaType: (isAnime ? 'anime' : 'manga') as MediaType,
        watchedEpisodes: entry.progress || 0,
        totalEpisodes: media.episodes || media.chapters || 12,
        score: entry.score || 0,
        status: fromMalStatus(entry.status || 'CURRENT', isAnime),
        notes: entry.notes || '',
        format: media.format || 'TV'
      };
    });
  }

  throw new Error('Unsupported JSON structure. Expected a KuroList backup or AniList export.');
}

/**
 * Live Fetch from AniList GraphQL API (Public, CORS-Friendly)
 */
export async function fetchAniListUserList(username: string): Promise<MalParsedEntry[]> {
  const query = `
    query ($userName: String) {
      MediaListCollection(userName: $userName, type: ANIME) {
        lists {
          name
          entries {
            status
            score(format: POINT_10)
            progress
            notes
            media {
              idMal
              title {
                romaji
                english
              }
              episodes
              format
            }
          }
        }
      }
    }
  `;

  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      query,
      variables: { userName: username.trim() }
    })
  });

  if (!response.ok) {
    throw new Error(`AniList user "${username}" was not found or profile is private.`);
  }

  const json = await response.json();
  const lists = json?.data?.MediaListCollection?.lists || [];
  const results: MalParsedEntry[] = [];

  for (const list of lists) {
    for (const entry of list.entries || []) {
      const title = entry.media?.title?.english || entry.media?.title?.romaji || 'Untitled';
      results.push({
        malId: entry.media?.idMal || Math.floor(Math.random() * 100000),
        title,
        mediaType: 'anime',
        watchedEpisodes: entry.progress || 0,
        totalEpisodes: entry.media?.episodes || 12,
        score: entry.score || 0,
        status: fromMalStatus(entry.status || 'CURRENT', true),
        notes: entry.notes || '',
        format: entry.media?.format || 'TV'
      });
    }
  }

  return results;
}

/**
 * Diff result structure for intelligent library sync
 */
export interface SyncUpdateItem {
  existingEntryId: string;
  mediaId: string;
  title: string;
  mediaType: MediaType;
  oldProgress: number;
  newProgress: number;
  oldStatus: LibraryStatus;
  newStatus: LibraryStatus;
  oldScore: number;
  newScore: number;
  totalProgress: number;
  reasons: string[];
}

export interface SyncAddItem {
  mediaId: string;
  title: string;
  mediaType: MediaType;
  progress: number;
  totalProgress: number;
  score: number;
  status: LibraryStatus;
  notes?: string;
  format?: string;
}

export interface SyncUnchangedItem {
  title: string;
  mediaType: MediaType;
  progress: number;
  status: LibraryStatus;
  score: number;
}

export interface SyncDiffResult {
  toUpdate: SyncUpdateItem[];
  toAdd: SyncAddItem[];
  unchanged: SyncUnchangedItem[];
  totalParsed: number;
}

/**
 * Intelligent Library Diffing Engine
 * Automatically compares incoming parsed entries against user's current library.
 * Detects:
 * - Progress advancement (e.g. watched ep 8 -> 12)
 * - Status transition (e.g. Watching -> Completed)
 * - Rating changes
 * - New titles to add
 * - Already up-to-date titles
 */
export function diffParsedWithLibrary(
  parsedItems: MalParsedEntry[],
  userLibrary: LibraryEntry[],
  mediaItems: MediaItem[]
): SyncDiffResult {
  const toUpdate: SyncUpdateItem[] = [];
  const toAdd: SyncAddItem[] = [];
  const unchanged: SyncUnchangedItem[] = [];

  for (const item of parsedItems) {
    const normItemTitle = normalizeTitle(item.title);

    // Look for match in user library by:
    // 1. Direct media.malId === item.malId
    // 2. Title matching mediaItems
    // 3. Normalized string matching
    let matchedEntry: LibraryEntry | undefined;
    let matchedMedia: MediaItem | undefined;

    for (const entry of userLibrary) {
      const media = mediaItems.find(m => m.id === entry.mediaId);
      if (!media) continue;

      const normMediaTitle = normalizeTitle(media.title);
      const normMediaRomaji = normalizeTitle(media.titleRomaji || '');

      const isMalIdMatch = item.malId > 0 && media.malId === item.malId;
      const isTitleMatch =
        normMediaTitle === normItemTitle ||
        normMediaRomaji === normItemTitle ||
        (normItemTitle.length > 5 && (normMediaTitle.includes(normItemTitle) || normItemTitle.includes(normMediaTitle)));

      if (isMalIdMatch || isTitleMatch) {
        matchedEntry = entry;
        matchedMedia = media;
        break;
      }
    }

    if (matchedEntry) {
      // Compare state: progress, status, score
      const reasons: string[] = [];

      const progressChanged = item.watchedEpisodes !== matchedEntry.progress;
      const statusChanged = item.status !== matchedEntry.status;
      const scoreChanged = item.score > 0 && item.score !== matchedEntry.score;

      if (progressChanged) {
        reasons.push(`Progress: ${matchedEntry.progress} → ${item.watchedEpisodes}`);
      }
      if (statusChanged) {
        reasons.push(`Status: ${matchedEntry.status} → ${item.status}`);
      }
      if (scoreChanged) {
        reasons.push(`Score: ${matchedEntry.score > 0 ? matchedEntry.score : 'None'} → ${item.score}`);
      }

      if (reasons.length > 0) {
        toUpdate.push({
          existingEntryId: matchedEntry.id,
          mediaId: matchedEntry.mediaId,
          title: matchedMedia?.title || item.title,
          mediaType: item.mediaType,
          oldProgress: matchedEntry.progress,
          newProgress: item.watchedEpisodes,
          oldStatus: matchedEntry.status,
          newStatus: item.status,
          oldScore: matchedEntry.score,
          newScore: item.score > 0 ? item.score : matchedEntry.score,
          totalProgress: matchedEntry.totalProgress || item.totalEpisodes,
          reasons
        });
      } else {
        unchanged.push({
          title: matchedMedia?.title || item.title,
          mediaType: item.mediaType,
          progress: matchedEntry.progress,
          status: matchedEntry.status,
          score: matchedEntry.score
        });
      }
    } else {
      // New title to add
      const existingCatalogMedia = mediaItems.find(
        m => (item.malId > 0 && m.malId === item.malId) || normalizeTitle(m.title) === normItemTitle
      );
      const mediaId = existingCatalogMedia ? existingCatalogMedia.id : `ext_mal_${item.malId || Date.now()}`;

      toAdd.push({
        mediaId,
        title: item.title,
        mediaType: item.mediaType,
        progress: item.watchedEpisodes,
        totalProgress: item.totalEpisodes,
        score: item.score,
        status: item.status,
        notes: item.notes,
        format: item.format
      });
    }
  }

  return {
    toUpdate,
    toAdd,
    unchanged,
    totalParsed: parsedItems.length
  };
}
