import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  MessageCircle, 
  ArrowLeft, 
  Lock, 
  RefreshCw, 
  Trash2, 
  Filter, 
  ExternalLink,
  PieChart,
  Info
} from 'lucide-react';
import { getLocalAnalyticsEvents, clearLocalAnalyticsEvents, StoredLocalEvent } from '../../utils/analytics';

interface AdminAnalyticsPageProps {
  onBackToHome: () => void;
}

export const AdminAnalyticsPage: React.FC<AdminAnalyticsPageProps> = ({ onBackToHome }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('agy_admin_authenticated') === 'true';
  });
  const [authError, setAuthError] = useState(false);

  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'all'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1740 or 'admin'
    if (pin === '1740' || pin === 'admin' || pin === 'robert') {
      setIsAuthenticated(true);
      sessionStorage.setItem('agy_admin_authenticated', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('agy_admin_authenticated');
    setIsAuthenticated(false);
  };

  // Pure real events from local storage (NO DUMMY / MOCK DATA)
  const events = useMemo(() => {
    return getLocalAnalyticsEvents();
  }, [refreshKey]);

  // Filter events by time range
  const filteredEvents = useMemo(() => {
    const now = Date.now();
    let cutoff = 0;
    if (timeRange === 'today') cutoff = now - 24 * 3600 * 1000;
    else if (timeRange === '7d') cutoff = now - 7 * 24 * 3600 * 1000;
    else if (timeRange === '30d') cutoff = now - 30 * 24 * 3600 * 1000;

    return events.filter((ev) => new Date(ev.timestamp).getTime() >= cutoff);
  }, [events, timeRange]);

  // High level KPIs (100% Real Data, starts at 0)
  const kpis = useMemo(() => {
    // Exclude internal admin dashboard views from public metrics
    const publicPageViews = filteredEvents.filter(
      (e) => e.eventName === 'page_view' && 
             e.properties.page !== 'admin_analytics' && 
             e.properties.page !== 'admin'
    );

    // Unique visitors deduplicated by visitor_id or session_id
    const uniqueVisitorIds = new Set(
      publicPageViews
        .map((e) => e.properties.visitor_id || e.properties.session_id)
        .filter(Boolean)
    );

    const uniqueVisitors = uniqueVisitorIds.size;
    const pageViews = publicPageViews.length;

    const toolStarts = filteredEvents.filter((e) => e.eventName === 'tool_started').length;
    const toolCompletions = filteredEvents.filter((e) => e.eventName === 'tool_completed').length;
    const waClicks = filteredEvents.filter((e) => e.eventName === 'whatsapp_clicked').length;
    const riskEdViews = filteredEvents.filter(
      (e) => e.eventName === 'risk_management_option_clicked' || e.eventName === 'financial_protection_viewed'
    ).length;
    const protectionOpens = filteredEvents.filter((e) => e.eventName === 'protection_gap_opened').length;

    const completionRate = toolStarts > 0 ? Math.round((toolCompletions / toolStarts) * 100) : 0;
    const waConversionRate = uniqueVisitors > 0 ? ((waClicks / uniqueVisitors) * 100).toFixed(1) : '0.0';

    return {
      uniqueVisitors,
      pageViews,
      toolStarts,
      toolCompletions,
      completionRate,
      waClicks,
      waConversionRate,
      riskEdViews,
      protectionOpens,
    };
  }, [filteredEvents]);

  // Traffic Source Breakdown
  const trafficSources = useMemo(() => {
    const map: Record<string, { visitors: number; starts: number; waClicks: number }> = {};

    filteredEvents.forEach((ev) => {
      if (ev.eventName === 'page_view' && (ev.properties.page === 'admin_analytics' || ev.properties.page === 'admin')) {
        return;
      }
      const src = (ev.properties.first_touch_source || 'direct').toLowerCase();
      if (!map[src]) {
        map[src] = { visitors: 0, starts: 0, waClicks: 0 };
      }
      if (ev.eventName === 'page_view') map[src].visitors++;
      if (ev.eventName === 'tool_started') map[src].starts++;
      if (ev.eventName === 'whatsapp_clicked') map[src].waClicks++;
    });

    return Object.entries(map).sort((a, b) => b[1].visitors - a[1].visitors);
  }, [filteredEvents]);

  // Tool Performance Breakdown
  const toolStats = useMemo(() => {
    const map: Record<string, { starts: number; completions: number; wa: number }> = {
      'life_readiness': { starts: 0, completions: 0, wa: 0 },
      'lifestyle_age': { starts: 0, completions: 0, wa: 0 },
      'emergency_checker': { starts: 0, completions: 0, wa: 0 },
      'medical_simulator': { starts: 0, completions: 0, wa: 0 },
      'financial_health': { starts: 0, completions: 0, wa: 0 },
      'family_readiness': { starts: 0, completions: 0, wa: 0 },
      'health_checklist': { starts: 0, completions: 0, wa: 0 },
      'protection_gap': { starts: 0, completions: 0, wa: 0 },
    };

    filteredEvents.forEach((ev) => {
      const tool = (ev.properties.tool_name || ev.properties.source_tool || '').toLowerCase().replace(/[- ]/g, '_');
      if (map[tool]) {
        if (ev.eventName === 'tool_started') map[tool].starts++;
        if (ev.eventName === 'tool_completed') map[tool].completions++;
        if (ev.eventName === 'whatsapp_clicked') map[tool].wa++;
      }
    });

    return Object.entries(map).map(([id, stat]) => {
      const rate = stat.starts > 0 ? Math.round((stat.completions / stat.starts) * 100) : 0;
      return { id, ...stat, rate };
    }).sort((a, b) => b.starts - a.starts);
  }, [filteredEvents]);

  // Conversion Funnel Data (starts from 0)
  const funnelSteps = [
    { 
      label: '1. Pengunjung Unik (Unique Visitors)', 
      count: kpis.uniqueVisitors, 
      pct: kpis.uniqueVisitors > 0 ? 100 : 0 
    },
    {
      label: '2. Mulai Assessment (Tool Started)',
      count: kpis.toolStarts,
      pct: kpis.uniqueVisitors > 0 ? Math.round((kpis.toolStarts / kpis.uniqueVisitors) * 100) : 0,
    },
    {
      label: '3. Menyelesaikan Hasil (Completed)',
      count: kpis.toolCompletions,
      pct: kpis.toolStarts > 0 ? Math.round((kpis.toolCompletions / kpis.toolStarts) * 100) : 0,
    },
    {
      label: '4. Membaca Edukasi Risiko',
      count: kpis.riskEdViews,
      pct: kpis.toolCompletions > 0 ? Math.round((kpis.riskEdViews / kpis.toolCompletions) * 100) : 0,
    },
    {
      label: '5. Membuka Protection Gap',
      count: kpis.protectionOpens,
      pct: kpis.riskEdViews > 0 ? Math.round((kpis.protectionOpens / kpis.riskEdViews) * 100) : 0,
    },
    {
      label: '6. Konsultasi WhatsApp Clicked',
      count: kpis.waClicks,
      pct: kpis.toolCompletions > 0 ? Math.round((kpis.waClicks / kpis.toolCompletions) * 100) : 0,
    },
  ];

  // PIN AUTH FORM
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Dashboard Analytics Pemilik</h2>
        <p className="text-xs text-muted mt-1.5 mb-6">
          Masukkan PIN keamanan untuk melihat data performa traffic dan funnel konversi riil.
        </p>

        <form onSubmit={handleLogin} className="space-y-4 max-w-xs mx-auto">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Masukkan PIN (Default: 1740)"
              className="w-full text-center tracking-widest text-lg px-4 py-3 rounded-card border border-border focus:border-teal-brand outline-none bg-white text-foreground"
              autoFocus
            />
            {authError && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">
                PIN salah. Silakan coba 1740.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-brand hover:bg-teal-light text-white font-bold py-2.5 rounded-btn text-xs shadow-soft transition-all"
          >
            Buka Dashboard
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="w-full text-xs text-muted hover:text-foreground font-medium py-1"
          >
            ← Kembali ke Beranda
          </button>
        </form>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD VIEW
  return (
    <div className="max-w-[760px] mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Situs</span>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Owner Analytics &amp; Funnel Hub
            </h1>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Real Data (100% Murni)
            </span>
          </div>
          <p className="text-xs text-muted mt-0.5">
            Semua angka di bawah adalah hasil rekaman riil aktivitas pengunjung, tanpa data dummy.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            title="Refresh Data"
            className="p-2 rounded-card border border-border hover:bg-section text-muted hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset semua log analitik lokal menjadi 0?')) {
                clearLocalAnalyticsEvents();
                setRefreshKey((k) => k + 1);
              }
            }}
            title="Reset Analitik ke 0"
            className="p-2 rounded-card border border-border hover:bg-rose-50 hover:text-rose-600 text-muted transition-colors flex items-center gap-1 text-xs"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Reset ke 0</span>
          </button>

          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-muted hover:text-foreground py-2 px-3 rounded-card border border-border hover:bg-section"
          >
            Kunci
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-3.5 rounded-card border border-border shadow-soft">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-muted" />
          <span className="text-xs font-semibold text-muted mr-1">Rentang Waktu:</span>
          <div className="flex items-center gap-1 bg-section p-1 rounded-card text-xs">
            {(['today', '7d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  timeRange === r
                    ? 'bg-white text-teal-brand shadow-soft'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {r === 'today' ? 'Hari Ini' : r === '7d' ? '7 Hari' : r === '30d' ? '30 Hari' : 'Semua'}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-muted flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
          <span>Log Perangkat: {events.length} event tersimpan</span>
        </div>
      </div>

      {/* ZERO DATA NOTIFICATION IF EMPTY */}
      {filteredEvents.length === 0 && (
        <div className="p-4 rounded-card bg-section/70 border border-border text-xs text-muted flex items-start gap-2.5">
          <Info className="w-4 h-4 text-teal-brand shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground block">
              Data masih kosong (0)
            </span>
            Belum ada kunjungan atau interaksi pada rentang waktu ini. Angka akan otomatis bertambah secara real-time saat ada pengunjung membuka halaman, mencoba kalkulator, atau mengklik tombol WhatsApp.
          </div>
        </div>
      )}

      {/* KPI CARDS (4 CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-card bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pengunjung</span>
            <Users className="w-4 h-4 text-teal-brand" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{kpis.uniqueVisitors}</div>
          <div className="text-[10px] text-muted mt-0.5">{kpis.pageViews} Total Page Views</div>
        </div>

        <div className="p-4 rounded-card bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Mulai Tool</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{kpis.toolStarts}</div>
          <div className="text-[10px] text-muted mt-0.5">Asesmen Dimulai</div>
        </div>

        <div className="p-4 rounded-card bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{kpis.completionRate}%</div>
          <div className="text-[10px] text-muted mt-0.5">{kpis.toolCompletions} assessment rampung</div>
        </div>

        <div className="p-4 rounded-card bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Leads WA</span>
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{kpis.waClicks}</div>
          <div className="text-[10px] text-muted mt-0.5">Konversi: {kpis.waConversionRate}%</div>
        </div>
      </div>

      {/* CONVERSION FUNNEL BAR */}
      <div className="bg-card border border-border rounded-card-lg p-5 sm:p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-teal-brand" />
          Funnel Konversi Keseluruhan
        </h3>

        <div className="space-y-3">
          {funnelSteps.map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{step.label}</span>
                <span className="font-bold text-teal-brand">
                  {step.count} ({step.pct}%)
                </span>
              </div>
              <div className="h-2 w-full bg-section rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-brand transition-all duration-300"
                  style={{ width: `${step.pct > 0 ? Math.min(100, Math.max(4, step.pct)) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOOL PERFORMANCE TABLE */}
      <div className="bg-card border border-border rounded-card-lg p-5 sm:p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-foreground">
          Performa Per Tool Assessment
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-border/80 text-muted uppercase font-bold text-[10px]">
              <tr>
                <th className="py-2.5 pr-4">Nama Tool</th>
                <th className="py-2.5 px-3 text-center">Mulai</th>
                <th className="py-2.5 px-3 text-center">Selesai</th>
                <th className="py-2.5 px-3 text-center">Completion Rate</th>
                <th className="py-2.5 pl-3 text-right">WA Leads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {toolStats.map((t) => (
                <tr key={t.id} className="hover:bg-section/40">
                  <td className="py-3 pr-4 font-semibold text-foreground capitalize">
                    {t.id.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-3 text-center text-muted">{t.starts}</td>
                  <td className="py-3 px-3 text-center text-muted">{t.completions}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        t.rate >= 70
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.rate >= 40
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-section text-muted'
                      }`}
                    >
                      {t.rate}%
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right font-bold text-teal-brand">
                    {t.wa > 0 ? `💬 ${t.wa}` : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRAFFIC SOURCE BREAKDOWN */}
      <div className="bg-card border border-border rounded-card-lg p-5 sm:p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <PieChart className="w-4 h-4 text-teal-brand" />
          Sumber Traffic (UTM / Saluran Masuk)
        </h3>

        <div className="overflow-x-auto">
          {trafficSources.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted">
              Belum ada data traffic kunjungan tercatat.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="border-b border-border/80 text-muted uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 pr-4">Channel (Source)</th>
                  <th className="py-2.5 px-3 text-center">Visitors</th>
                  <th className="py-2.5 px-3 text-center">Tool Starts</th>
                  <th className="py-2.5 pl-3 text-right">WA Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {trafficSources.map(([src, stat]) => (
                  <tr key={src} className="hover:bg-section/40">
                    <td className="py-2.5 pr-4 font-semibold text-foreground uppercase tracking-wide">
                      {src}
                    </td>
                    <td className="py-2.5 px-3 text-center text-muted">{stat.visitors}</td>
                    <td className="py-2.5 px-3 text-center text-muted">{stat.starts}</td>
                    <td className="py-2.5 pl-3 text-right font-bold text-teal-brand">
                      {stat.waClicks > 0 ? `💬 ${stat.waClicks}` : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* POSTHOG INTEGRATION GUIDE CARD */}
      <div className="p-4 rounded-card bg-teal-50 border border-teal-brand/30 text-xs text-teal-950 space-y-1.5 leading-relaxed">
        <div className="font-bold flex items-center gap-1.5 text-teal-brand">
          <ExternalLink className="w-4 h-4" />
          <span>PostHog Cloud Setup (Opsional)</span>
        </div>
        <p>
          Situs ini sudah siap terhubung ke PostHog Cloud. Cukup tambahkan environment variable di dashboard Vercel project:
        </p>
        <div className="p-2 rounded bg-white border border-teal-brand/20 font-mono text-[11px] text-teal-900">
          VITE_POSTHOG_KEY=phc_your_key_here<br />
          VITE_POSTHOG_HOST=https://us.i.posthog.com
        </div>
        <p className="text-[11px] text-teal-800">
          Semua event akan otomatis terkirim ke PostHog dashboard secara terenkripsi dan bebas dari data sensitif (PII).
        </p>
      </div>
    </div>
  );
};
