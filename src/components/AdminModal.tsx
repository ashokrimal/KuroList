/**
 * Admin & Moderation Panel Modal
 * Protected admin dashboard with platform metrics, user moderation, report queue, and audit logs
 */

import React, { useState } from 'react';
import {
  X,
  Shield,
  Users,
  Film,
  AlertTriangle,
  Activity,
  Check,
  Ban,
  Eye,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AdminModal: React.FC = () => {
  const {
    isAdminModalOpen,
    setIsAdminModalOpen,
    currentUser,
    mediaItems,
    reviews,
    topics,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'metrics' | 'reports' | 'moderation' | 'audit'>('metrics');
  const [reports, setReports] = useState([
    {
      id: 'rep_1',
      targetType: 'Review',
      targetTitle: 'Attack on Titan Finale review',
      reportedBy: 'user_anonymous',
      reason: 'Contains untagged plot spoiler for chapter 139',
      status: 'pending',
      timestamp: '2 hours ago'
    },
    {
      id: 'rep_2',
      targetType: 'Discussion Post',
      targetTitle: 'Powerscaling flame war thread',
      reportedBy: 'senpai_kenji',
      reason: 'Harassment and abusive tone towards user',
      status: 'pending',
      timestamp: '5 hours ago'
    }
  ]);

  if (!isAdminModalOpen || currentUser.role !== 'admin') return null;

  const handleResolveReport = (reportId: string, action: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    showToast(`Report resolved: ${action}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#181A26] border border-[#2A2F45] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#2A2F45] flex items-center justify-between bg-amber-500/10">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-bold text-white">KuroList Admin Control Plane</h3>
              <p className="text-xs text-amber-300/80">Authorized role: Administrator ({currentUser.displayName})</p>
            </div>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1F2335] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Tabs */}
        <div className="flex border-b border-[#2A2F45] px-4 text-xs font-medium gap-4 bg-[#131520]">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`py-3 transition-colors relative ${
              activeTab === 'metrics' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview & Telemetry
            {activeTab === 'metrics' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Reports Queue ({reports.length})
            {activeTab === 'reports' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`py-3 transition-colors relative ${
              activeTab === 'moderation' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Content & Users
            {activeTab === 'moderation' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 transition-colors relative ${
              activeTab === 'audit' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Log
            {activeTab === 'audit' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'metrics' && (
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                <div className="p-4 bg-[#131520] border border-[#2A2F45] rounded-xl">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Catalog Titles</div>
                  <div className="text-xl font-bold font-mono text-white mt-1">{mediaItems.length}</div>
                </div>
                <div className="p-4 bg-[#131520] border border-[#2A2F45] rounded-xl">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Total Reviews</div>
                  <div className="text-xl font-bold font-mono text-indigo-400 mt-1">{reviews.length}</div>
                </div>
                <div className="p-4 bg-[#131520] border border-[#2A2F45] rounded-xl">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Discussions</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{topics.length}</div>
                </div>
                <div className="p-4 bg-[#131520] border border-[#2A2F45] rounded-xl">
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider">Open Reports</div>
                  <div className="text-xl font-bold font-mono text-amber-400 mt-1">{reports.length}</div>
                </div>
              </div>

              <div className="p-4 bg-[#131520] border border-[#2A2F45] rounded-xl text-xs space-y-2">
                <div className="font-semibold text-white">System Status: Nominal</div>
                <div className="text-slate-400">
                  External Jikan API proxy operational with dynamic caching. In-app database persistence synced.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-[#131520] rounded-xl border border-[#2A2F45]">
                  No pending community reports. The platform is clean!
                </div>
              ) : (
                reports.map(rep => (
                  <div
                    key={rep.id}
                    className="p-4 bg-[#131520] border border-[#2A2F45] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{rep.targetType}:</span>
                        <span className="text-slate-300 font-medium">{rep.targetTitle}</span>
                      </div>
                      <p className="text-rose-400 mt-1">Reason: {rep.reason}</p>
                      <span className="text-[10px] text-slate-500">Reported {rep.timestamp} by @{rep.reportedBy}</span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleResolveReport(rep.id, 'Dismissed (False Report)')}
                        className="px-2.5 py-1.5 text-slate-300 hover:text-white bg-[#1F2335] rounded-lg"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'Warning Issued')}
                        className="px-2.5 py-1.5 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg"
                      >
                        Warn Author
                      </button>
                      <button
                        onClick={() => handleResolveReport(rep.id, 'Content Removed')}
                        className="px-2.5 py-1.5 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg"
                      >
                        Delete Content
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="space-y-4 text-xs">
              <h4 className="font-semibold text-white">Platform Content Moderation</h4>
              <p className="text-slate-400">
                You can pin seasonal spotlights, mark spoiler filters on reviews, and manage account statuses.
              </p>
              <div className="p-3 bg-[#131520] border border-[#2A2F45] rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">Default Seasonal Spotlight</div>
                  <div className="text-slate-400 text-[11px]">Currently set to Frieren: Beyond Journey's End</div>
                </div>
                <button
                  onClick={() => showToast('Seasonal spotlight refreshed!')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
                >
                  Change Spotlight
                </button>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-[#131520] rounded border border-[#2A2F45] text-slate-300">
                [2026-11-01 00:20:12] User @ashokrimal rated Frieren: Beyond Journey's End (10/10)
              </div>
              <div className="p-2.5 bg-[#131520] rounded border border-[#2A2F45] text-slate-300">
                [2026-11-01 00:15:00] User @senpai_kenji liked activity #act_2
              </div>
              <div className="p-2.5 bg-[#131520] rounded border border-[#2A2F45] text-slate-300">
                [2026-10-31 23:45:10] Automated Jikan rate-limiter token refreshed
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
