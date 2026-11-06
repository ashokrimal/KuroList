/**
 * KuroList - Smart MyAnimeList (MAL) & AniList Sync Hub
 * Supports:
 * - Direct MAL XML and JSON backup file upload
 * - Direct AniList / MAL live profile sync by username
 * - Intelligent library diffing against current user watchlist:
 *   - Detects progress increases, status transitions, rating changes
 *   - Clear "No new data found — your library is already up to date!" state
 *   - Detailed visual diff log before committing updates
 *   - Error handling for corrupt files, empty data, and network errors
 */

import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Upload,
  FileCode,
  Check,
  AlertCircle,
  FileText,
  ArrowRight,
  Loader2,
  RefreshCw,
  Globe,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  generateMalXmlExport,
  generateJsonBackup,
  downloadFile,
  parseMalXml,
  parseBackupJson,
  fetchAniListUserList,
  diffParsedWithLibrary,
  SyncDiffResult,
  MalParsedEntry
} from '../utils/malSync';

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    library,
    mediaItems,
    applySyncDiffAction,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sync' | 'export'>('sync');
  const [syncMethod, setSyncMethod] = useState<'file' | 'username'>('file');

  // Username sync input state
  const [syncUsername, setSyncUsername] = useState('');
  const [syncPlatform, setSyncPlatform] = useState<'anilist' | 'mal'>('anilist');

  // File upload state
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Diff result state
  const [diffResult, setDiffResult] = useState<SyncDiffResult | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const userLibrary = library.filter(e => e.userId === currentUser.id);

  // Reset modal state
  const handleReset = () => {
    setDiffResult(null);
    setFileName('');
    setErrorMessage(null);
    setIsApplied(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 1. Process parsed items with the intelligent diff engine
  const processParsedItems = (items: MalParsedEntry[], sourceName: string) => {
    try {
      if (!items || items.length === 0) {
        setErrorMessage(`No anime or manga entries found in ${sourceName}. Please verify the file or account.`);
        setDiffResult(null);
        return;
      }

      const diff = diffParsedWithLibrary(items, userLibrary, mediaItems);
      setDiffResult(diff);
      setErrorMessage(null);
      setIsApplied(false);

      if (diff.toUpdate.length === 0 && diff.toAdd.length === 0) {
        showToast('All titles are already up to date with your current library!', 'info');
      } else {
        showToast(`Found ${diff.toUpdate.length} updates and ${diff.toAdd.length} new titles to import!`, 'success');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to compare titles with your current library.');
    }
  };

  // 2. File Upload Handler (XML or JSON)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setErrorMessage(null);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || '';
        let parsed: MalParsedEntry[] = [];

        if (file.name.endsWith('.xml') || text.includes('<?xml') || text.includes('<myanimelist>')) {
          parsed = parseMalXml(text);
        } else if (file.name.endsWith('.json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
          parsed = parseBackupJson(text);
        } else {
          throw new Error('Unsupported file extension. Please upload a .xml or .json file.');
        }

        processParsedItems(parsed, file.name);
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || 'Could not parse file. Make sure it is a valid MyAnimeList XML or JSON backup.');
        setDiffResult(null);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage('Could not read the uploaded file from disk.');
    };

    reader.readAsText(file);
  };

  // 3. Live Username Sync Handler (AniList / MAL)
  const handleLiveUsernameSync = async () => {
    if (!syncUsername.trim()) {
      setErrorMessage('Please enter a username to sync.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (syncPlatform === 'anilist') {
        const parsed = await fetchAniListUserList(syncUsername);
        setFileName(`AniList: @${syncUsername.trim()}`);
        processParsedItems(parsed, `AniList account @${syncUsername}`);
      } else {
        // MAL Jikan API integration with graceful fallback
        try {
          const res = await fetch(`https://api.jikan.moe/v4/users/${encodeURIComponent(syncUsername.trim())}/animelist`);
          if (!res.ok) {
            throw new Error(`MyAnimeList user "${syncUsername}" was not found or public list is restricted.`);
          }
          const jikanData = await res.json();
          const items: MalParsedEntry[] = (jikanData?.data || []).map((entry: any) => ({
            malId: entry.entry?.mal_id || 0,
            title: entry.entry?.title || 'Untitled',
            mediaType: 'anime',
            watchedEpisodes: entry.episodes_watched || 0,
            totalEpisodes: entry.entry?.episodes || 12,
            score: entry.score || 0,
            status: entry.status === 'watching' ? 'watching' : entry.status === 'completed' ? 'completed' : 'watching',
            notes: entry.comments || '',
            format: 'TV'
          }));
          setFileName(`MAL: @${syncUsername.trim()}`);
          processParsedItems(items, `MAL account @${syncUsername}`);
        } catch (jikanErr: any) {
          throw new Error(
            jikanErr.message ||
              'Could not connect to MyAnimeList live API (rate-limited). Please export your XML from MAL and upload it above.'
          );
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to fetch user list. Please check the username or upload an XML file.');
      setDiffResult(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Sample MAL XML Loader
  const loadSampleMalXml = () => {
    const sampleXml = `<?xml version="1.0" encoding="UTF-8" ?>
<myanimelist>
  <myinfo>
    <user_name>OtakuExplorer</user_name>
  </myinfo>
  <anime>
    <series_animedb_id>52991</series_animedb_id>
    <series_title>Sousou no Frieren</series_title>
    <series_episodes>28</series_episodes>
    <my_watched_episodes>28</my_watched_episodes>
    <my_score>10</my_score>
    <my_status>Completed</my_status>
  </anime>
  <anime>
    <series_animedb_id>5114</series_animedb_id>
    <series_title>Fullmetal Alchemist: Brotherhood</series_title>
    <series_episodes>64</series_episodes>
    <my_watched_episodes>64</my_watched_episodes>
    <my_score>10</my_score>
    <my_status>Completed</my_status>
  </anime>
  <anime>
    <series_animedb_id>55644</series_animedb_id>
    <series_title>Dandadan</series_title>
    <series_episodes>12</series_episodes>
    <my_watched_episodes>12</my_watched_episodes>
    <my_score>9</my_score>
    <my_status>Completed</my_status>
  </anime>
  <anime>
    <series_animedb_id>52034</series_animedb_id>
    <series_title>Solo Leveling</series_title>
    <series_episodes>12</series_episodes>
    <my_watched_episodes>12</my_watched_episodes>
    <my_score>9</my_score>
    <my_status>Completed</my_status>
  </anime>
</myanimelist>`;
    try {
      const parsed = parseMalXml(sampleXml);
      setFileName('sample_mal_export.xml');
      processParsedItems(parsed, 'Sample MAL Export');
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  // 5. Commit Diff to Cloud Library
  const handleCommitSync = () => {
    if (!diffResult) return;
    if (diffResult.toUpdate.length === 0 && diffResult.toAdd.length === 0) return;

    applySyncDiffAction(diffResult.toUpdate, diffResult.toAdd);
    setIsApplied(true);
    setTimeout(() => {
      onClose();
      handleReset();
    }, 1200);
  };

  // 6. Export Handlers
  const handleExportMalXml = () => {
    try {
      const xml = generateMalXmlExport(currentUser.username, userLibrary, mediaItems);
      downloadFile(xml, `kuro_${currentUser.username}_mal_export.xml`, 'application/xml');
      showToast('Exported MyAnimeList XML file!', 'success');
    } catch {
      showToast('Export failed. Please try again.', 'error');
    }
  };

  const handleExportJson = () => {
    try {
      const json = generateJsonBackup(currentUser.username, userLibrary, mediaItems);
      downloadFile(json, `kuro_${currentUser.username}_backup.json`, 'application/json');
      showToast('Exported KuroList JSON backup!', 'success');
    } catch {
      showToast('Export failed. Please try again.', 'error');
    }
  };

  const handleCopyJson = () => {
    try {
      const json = generateJsonBackup(currentUser.username, userLibrary, mediaItems);
      navigator.clipboard.writeText(json);
      setCopiedJson(true);
      showToast('JSON copied to clipboard!');
      setTimeout(() => setCopiedJson(false), 2000);
    } catch {
      showToast('Could not copy to clipboard', 'error');
    }
  };

  const hasChanges = diffResult && (diffResult.toUpdate.length > 0 || diffResult.toAdd.length > 0);
  const isUpToDate = diffResult && diffResult.toUpdate.length === 0 && diffResult.toAdd.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#161824] border border-[#262A3E] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#262A3E] bg-[#12141F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                MAL & AniList Smart Sync
              </h3>
              <p className="text-[11px] text-slate-400">
                Automatic progress advancement, status updates, and library backups
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1E2235] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-2 bg-[#0F1016] border-b border-[#262A3E] gap-1.5 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('sync');
              handleReset();
            }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'sync'
                ? 'bg-[#1E2235] text-white shadow-sm font-bold border border-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Sync & Import</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'export'
                ? 'bg-[#1E2235] text-white shadow-sm font-bold border border-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export & Backup</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'sync' && (
            <div className="space-y-4">
              {/* Sync Method Switcher (File Upload vs Live Username) */}
              {!diffResult && (
                <div className="flex items-center gap-1 p-1 bg-[#0F1016] border border-[#262A3E] rounded-xl text-xs font-medium">
                  <button
                    onClick={() => {
                      setSyncMethod('file');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      syncMethod === 'file' ? 'bg-[#1A1D2E] text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Upload XML / JSON File</span>
                  </button>
                  <button
                    onClick={() => {
                      setSyncMethod('username');
                      setErrorMessage(null);
                    }}
                    className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                      syncMethod === 'username' ? 'bg-[#1A1D2E] text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sync by Username</span>
                  </button>
                </div>
              )}

              {/* Mode 1: File Upload */}
              {!diffResult && syncMethod === 'file' && (
                <div className="space-y-3">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#2A2F45] hover:border-indigo-500/70 rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#10121C] hover:bg-[#131526] group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".xml,.json"
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-white">
                      {fileName ? fileName : 'Upload MyAnimeList XML or KuroList JSON'}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                      Exported file from MyAnimeList.net or AniList.co. We will automatically inspect your watching progress.
                    </p>
                  </div>

                  {/* Sample Data Loader */}
                  <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                    <span>Don't have a file ready?</span>
                    <button
                      type="button"
                      onClick={loadSampleMalXml}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Try Sample MAL File
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 2: Username Live Sync */}
              {!diffResult && syncMethod === 'username' && (
                <div className="p-4 bg-[#10121C] border border-[#262A3E] rounded-2xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white">Select Platform & Enter Username</label>
                    <div className="flex items-center gap-1 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setSyncPlatform('anilist')}
                        className={`px-2.5 py-1 rounded-md transition-colors ${
                          syncPlatform === 'anilist'
                            ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        AniList (Live)
                      </button>
                      <button
                        type="button"
                        onClick={() => setSyncPlatform('mal')}
                        className={`px-2.5 py-1 rounded-md transition-colors ${
                          syncPlatform === 'mal'
                            ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50 font-bold'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        MyAnimeList
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">@</span>
                      <input
                        type="text"
                        placeholder={syncPlatform === 'anilist' ? 'Your AniList username...' : 'Your MAL username...'}
                        value={syncUsername}
                        onChange={e => setSyncUsername(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleLiveUsernameSync()}
                        className="w-full bg-[#161824] border border-[#262A3E] text-xs text-white rounded-xl pl-7 pr-3 py-2.5 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleLiveUsernameSync}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5"
                    >
                      {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      <span>Fetch Watchlist</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Connects directly to your public anime profile. We'll automatically identify any progress advances.
                  </p>
                </div>
              )}

              {/* Loading Spinner */}
              {isProcessing && (
                <div className="p-8 text-center bg-[#10121C] border border-[#262A3E] rounded-2xl flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                  <span className="font-semibold text-white">Inspecting and comparing anime records...</span>
                  <span className="text-[11px]">Matching titles and checking watching progress</span>
                </div>
              )}

              {/* Error Alert Box */}
              {errorMessage && (
                <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">Sync Inspection Notice</p>
                    <p className="text-[11px] text-rose-300 mt-0.5">{errorMessage}</p>
                  </div>
                  <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* -------------------- DIFF RESULT STATES -------------------- */}
              {diffResult && !isProcessing && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Summary Metric Header */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-[#10121C] border border-[#262A3E] rounded-xl text-center">
                    <div className="p-2 rounded-lg bg-[#161824]">
                      <div className="text-base font-bold text-indigo-400 font-mono">
                        {diffResult.toUpdate.length}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">To Update</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#161824]">
                      <div className="text-base font-bold text-emerald-400 font-mono">
                        {diffResult.toAdd.length}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">New Titles</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#161824]">
                      <div className="text-base font-bold text-slate-300 font-mono">
                        {diffResult.unchanged.length}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Up To Date</div>
                    </div>
                  </div>

                  {/* EMPTY STATE: "No new data found" */}
                  {isUpToDate && (
                    <div className="p-6 bg-[#10121C] border border-[#262A3E] rounded-2xl text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          No new data found — your library is already up to date!
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                          All {diffResult.totalParsed} titles parsed from {fileName || 'the source'} match your existing watching progress, scores, and status records.
                        </p>
                      </div>

                      {/* Sample titles verified */}
                      <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-[#161824] rounded-xl text-left border border-[#262A3E]/60 text-xs">
                        <div className="text-[10px] text-slate-500 font-mono uppercase px-1">
                          Verified Matches ({diffResult.unchanged.length} titles)
                        </div>
                        {diffResult.unchanged.slice(0, 8).map((u, i) => (
                          <div key={i} className="flex items-center justify-between py-1 px-1.5 text-slate-300">
                            <span className="truncate max-w-[200px] text-[11px]">{u.title}</span>
                            <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                              {u.status} · {u.progress} ep
                            </span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleReset}
                        className="px-4 py-2 bg-[#1A1D2E] hover:bg-[#20253B] text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
                      >
                        Try Another File or Account
                      </button>
                    </div>
                  )}

                  {/* ACTIVE CHANGES STATE: Visual diff list */}
                  {hasChanges && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-white px-0.5">
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Pending Updates ({diffResult.toUpdate.length + diffResult.toAdd.length} changes)</span>
                        </span>
                        <button
                          onClick={handleReset}
                          className="text-[11px] text-slate-400 hover:text-white transition-colors"
                        >
                          Clear
                        </button>
                      </div>

                      {/* Scrollable Diff List */}
                      <div className="max-h-56 overflow-y-auto space-y-2 p-2 bg-[#10121C] border border-[#262A3E] rounded-xl text-xs">
                        {/* 1. Items to Update */}
                        {diffResult.toUpdate.map((item, idx) => (
                          <div
                            key={`upd_${idx}`}
                            className="p-2.5 bg-[#161824] border border-indigo-500/20 rounded-lg flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-white truncate text-xs">{item.title}</div>
                              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                                {item.reasons.map((r, ri) => (
                                  <span key={ri} className="text-indigo-300 font-mono">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono shrink-0">
                              Update
                            </span>
                          </div>
                        ))}

                        {/* 2. Items to Add */}
                        {diffResult.toAdd.map((item, idx) => (
                          <div
                            key={`add_${idx}`}
                            className="p-2.5 bg-[#161824] border border-emerald-500/20 rounded-lg flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold text-white truncate text-xs">{item.title}</div>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 font-mono">
                                <span className="capitalize">{item.status}</span>
                                <span>·</span>
                                <span>
                                  {item.progress}/{item.totalProgress} {item.mediaType === 'anime' ? 'ep' : 'ch'}
                                </span>
                                {item.score > 0 && <span className="text-amber-300">★{item.score}</span>}
                              </div>
                            </div>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono shrink-0">
                              + New
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Commit Button */}
                      <button
                        onClick={handleCommitSync}
                        disabled={isApplied}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                      >
                        {isApplied ? (
                          <>
                            <Check className="w-4 h-4 text-white" />
                            <span>Successfully Applied to Your Cloud Watchlist!</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>
                              Apply {diffResult.toUpdate.length + diffResult.toAdd.length} Updates to My Cloud Library
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* -------------------- EXPORT TAB -------------------- */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#10121C] border border-[#262A3E] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Your Tracked Archive</div>
                  <div className="text-[11px] text-slate-400">
                    {userLibrary.length} titles recorded under @{currentUser.username}
                  </div>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded font-mono">
                  Cloud Persistent
                </span>
              </div>

              {/* 1. Official MAL XML Export */}
              <div className="p-4 bg-[#10121C] border border-[#262A3E] hover:border-indigo-500/50 rounded-xl transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Official MyAnimeList XML Export</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Directly importable into MyAnimeList.net, AniList.co, and Kitsu.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleExportMalXml}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    .xml
                  </button>
                </div>
              </div>

              {/* 2. KuroList JSON Backup */}
              <div className="p-4 bg-[#10121C] border border-[#262A3E] hover:border-indigo-500/50 rounded-xl transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">KuroList JSON Snapshot</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Full portable snapshot including timestamps, personal ratings, and notes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={handleCopyJson}
                      className="p-1.5 bg-[#1E2235] hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                      title="Copy JSON to clipboard"
                    >
                      {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <FileCode className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={handleExportJson}
                      className="px-3 py-1.5 bg-[#1E2235] hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      .json
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
