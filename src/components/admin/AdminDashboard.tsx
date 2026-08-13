import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { StatusBadge } from '../common/StatusBadge';
import { GhanaianUniversity, AuditEventType } from '../../types';
import { 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  MapPin, 
  Plus, 
  Search,
  Activity,
  Laptop,
  Smartphone,
  Globe,
  Trash2,
  Download,
  Clock
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const AdminDashboard: React.FC = () => {
  const { 
    vendors, 
    riders, 
    orders, 
    universities, 
    approveUserStatus, 
    rejectUserStatus,
    addUniversity,
    updateOrderStatus,
    auditLogs,
    activeSessions,
    clearAuditLogs
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'approvals' | 'orders' | 'universities' | 'audit_logs'>('approvals');
  const [selectedDocReview, setSelectedDocReview] = useState<{ title: string; type: string; docName: string; entity: any } | null>(null);

  // New university form state
  const [newUniName, setNewUniName] = useState<string>('');
  const [newUniShort, setNewUniShort] = useState<string>('');
  const [newUniRegion, setNewUniRegion] = useState<string>('Greater Accra');
  const [newUniCity, setNewUniCity] = useState<string>('Accra');
  const [newUniCampus, setNewUniCampus] = useState<string>('');
  const [newUniLandmarks, setNewUniLandmarks] = useState<string>('Main Gate, Student Canteen, Library');
  const [showAddUniModal, setShowAddUniModal] = useState<boolean>(false);

  // Filter states for orders
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Filter states for audit logs
  const [logSearch, setLogSearch] = useState<string>('');
  const [logEventFilter, setLogEventFilter] = useState<string>('all');
  const [logCampusFilter, setLogCampusFilter] = useState<string>('all');

  // Metrics
  const totalVolume = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const pendingApprovalsCount = vendors.filter(v => v.status === 'pending').length + riders.filter(r => r.status === 'pending').length;

  const handleApprove = (type: 'vendor' | 'rider', id: string) => {
    approveUserStatus(type, id);
    if (selectedDocReview) setSelectedDocReview(null);
  };

  const handleReject = (type: 'vendor' | 'rider', id: string) => {
    rejectUserStatus(type, id, 'Incomplete verification documents');
    if (selectedDocReview) setSelectedDocReview(null);
  };

  const handleCreateUniversity = (e: React.FormEvent) => {
    e.preventDefault();
    const lms = newUniLandmarks.split(',').map(l => l.trim()).filter(Boolean);
    const newUni: GhanaianUniversity = {
      id: `uni-${Date.now()}`,
      name: newUniName,
      shortName: newUniShort || newUniName,
      region: newUniRegion,
      city: newUniCity,
      campusName: newUniCampus || `${newUniName} Main Campus`,
      popularLandmarks: lms.length > 0 ? lms : ['Main Canteen', 'Hostel A'],
      bannerImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    };
    addUniversity(newUni);
    setShowAddUniModal(false);
    setNewUniName('');
    setNewUniShort('');
    setNewUniCampus('');
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.vendorName.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.userName.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      (log.uniqueIdCode && log.uniqueIdCode.toLowerCase().includes(logSearch.toLowerCase()));
    
    const matchesEvent = logEventFilter === 'all' || log.eventType === logEventFilter;
    const matchesCampus = logCampusFilter === 'all' || log.universityId === logCampusFilter;

    return matchesSearch && matchesEvent && matchesCampus;
  });

  const downloadLogsCSV = () => {
    const headers = ['Timestamp', 'Event', 'User', 'Role', 'ID Code', 'Campus', 'IP Address', 'Device', 'Status', 'Details'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      l.eventType,
      `"${l.userName}"`,
      l.userRole,
      l.uniqueIdCode || 'N/A',
      l.universityId,
      l.ipAddress,
      `"${l.deviceInfo}"`,
      l.status,
      `"${l.details.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aduanepa_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatEventBadge = (type: AuditEventType) => {
    switch (type) {
      case 'user_login':
        return <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md text-[10px] font-bold">Login</span>;
      case 'user_signup':
        return <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md text-[10px] font-bold">Signup</span>;
      case 'order_placed':
        return <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md text-[10px] font-bold">Order Placed</span>;
      case 'order_delivered':
        return <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md text-[10px] font-bold">Delivery Completed</span>;
      case 'vendor_registered':
      case 'vendor_status_change':
        return <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md text-[10px] font-bold">Vendor Action</span>;
      case 'rider_registered':
      case 'rider_status_change':
        return <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md text-[10px] font-bold">Rider Action</span>;
      case 'dispute_logged':
        return <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md text-[10px] font-bold">Dispute Flag</span>;
      default:
        return <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded-md text-[10px] font-bold">{type}</span>;
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Admin Operations Top Bar */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-warm border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-warm flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-2xl text-white">
                  AduanePa Fie Platform Governance
                </h1>
                <span className="font-mono text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Ecosystem oversight, live session audits, vendor permits, university taxonomy, and security monitoring
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-3 py-1.5 rounded-xl text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>{activeSessions.length} Active Sessions</span>
            </span>
          </div>
        </div>

        {/* Platform KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-stone-800">
          <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Gross Platform Volume</span>
            <span className="font-display font-black text-2xl text-amber-300 mt-1 block">
              GH₵ {totalVolume.toFixed(2)}
            </span>
          </div>

          <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Orders Processed</span>
            <span className="font-display font-black text-2xl text-white mt-1 block">
              {orders.length} <span className="text-xs text-stone-400 font-normal">({deliveredCount} completed)</span>
            </span>
          </div>

          <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Pending Verifications</span>
            <span className={`font-display font-black text-2xl mt-1 block ${pendingApprovalsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {pendingApprovalsCount} queue
            </span>
          </div>

          <div className="bg-stone-800/60 p-4 rounded-2xl border border-stone-700/60">
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Audit Log Entries</span>
            <span className="font-display font-black text-2xl text-white mt-1 block">
              {auditLogs.length} events
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'approvals'
              ? 'bg-stone-900 text-amber-300 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Account Approvals & Permits</span>
          {pendingApprovalsCount > 0 && (
            <span className="bg-brand-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
              {pendingApprovalsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'audit_logs'
              ? 'bg-stone-900 text-amber-300 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-500" />
          <span>Live Sessions & Audit Logs</span>
          <span className="bg-emerald-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
            {activeSessions.length} Online
          </span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-amber-300 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Master Order Oversight</span>
        </button>

        <button
          onClick={() => setActiveTab('universities')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'universities'
              ? 'bg-stone-900 text-amber-300 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Ghanaian Universities Taxonomy</span>
        </button>
      </div>

      {/* Tab 1: Live Sessions & Security Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="space-y-6">
          
          {/* Active User Sessions Live Grid */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-stone-900">
                    Real-time Active Platform Sessions ({activeSessions.length})
                  </h3>
                  <p className="text-xs text-stone-500">Live active actors logged into AduanePa Fie across campuses</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Realtime Monitoring</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {activeSessions.map((sess) => (
                <div 
                  key={sess.sessionId}
                  className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2 relative hover:border-brand-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-brand-600 block uppercase">{sess.uniqueIdCode}</span>
                      <h4 className="font-bold text-xs text-stone-900 truncate max-w-[140px]">{sess.userName}</h4>
                    </div>
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      ONLINE
                    </span>
                  </div>

                  <div className="space-y-1 text-[11px] text-stone-500 border-t border-stone-200/60 pt-2">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-stone-400" />
                      <span className="font-mono text-[10px] text-stone-700">{sess.ipAddress}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {sess.device.includes('Mobile') ? (
                        <Smartphone className="w-3 h-3 text-stone-400" />
                      ) : (
                        <Laptop className="w-3 h-3 text-stone-400" />
                      )}
                      <span className="truncate text-[10px]">{sess.device} &bull; {sess.browser}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span className="text-[10px]">Active: <strong className="text-stone-700">{sess.lastActive}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs Table & Filter Controls */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-display font-extrabold text-base text-stone-900">
                  Platform Security & Transaction Audit Trail
                </h3>
                <p className="text-xs text-stone-500">
                  Immutable record of signups, logins, order placements, OTP verifications & approvals
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadLogsCSV}
                  className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Export to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={clearAuditLogs}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Clear log history"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Logs</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user, IP address, ID code, or activity details..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={logEventFilter}
                  onChange={(e) => setLogEventFilter(e.target.value)}
                  className="w-full p-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-700 cursor-pointer"
                >
                  <option value="all">All Event Types</option>
                  <option value="user_login">Logins</option>
                  <option value="user_signup">Signups</option>
                  <option value="order_placed">Orders Placed</option>
                  <option value="order_delivered">Deliveries Completed</option>
                  <option value="vendor_registered">Vendor Registrations</option>
                  <option value="rider_registered">Rider Registrations</option>
                  <option value="dispute_logged">Dispute Flags</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={logCampusFilter}
                  onChange={(e) => setLogCampusFilter(e.target.value)}
                  className="w-full p-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-700 cursor-pointer"
                >
                  <option value="all">All Campuses</option>
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>{u.shortName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-100/80 text-stone-600 font-bold border-b border-stone-200 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-3.5">Timestamp</th>
                    <th className="py-3 px-3.5">Event</th>
                    <th className="py-3 px-3.5">User / ID</th>
                    <th className="py-3 px-3.5">IP & Location</th>
                    <th className="py-3 px-3.5">Device Info</th>
                    <th className="py-3 px-3.5">Status</th>
                    <th className="py-3 px-3.5">Activity Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-400">
                        No audit events match your search or filter.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="py-3 px-3.5 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          <span className="block text-[9px] text-stone-400">
                            {new Date(log.timestamp).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap">
                          {formatEventBadge(log.eventType)}
                        </td>

                        <td className="py-3 px-3.5">
                          <div className="font-bold text-stone-900">{log.userName}</div>
                          <span className="text-[10px] font-mono text-stone-400">{log.uniqueIdCode || log.userRole}</span>
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <div className="font-mono text-stone-800 font-semibold">{log.ipAddress}</div>
                          <span className="text-[10px] text-stone-400">{log.locationCity}</span>
                        </td>

                        <td className="py-3 px-3.5 text-[11px] text-stone-500 max-w-[140px] truncate">
                          {log.deviceInfo}
                        </td>

                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            log.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {log.status === 'success' ? 'SUCCESS' : 'ALERT'}
                          </span>
                        </td>

                        <td className="py-3 px-3.5 text-xs text-stone-700 max-w-xs">
                          {log.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Approvals & Verification */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-display font-extrabold text-base text-stone-900">
              Campus Vendor Chop Bar Registrations
            </h3>
            
            <div className="space-y-3">
              {vendors.map((vendor) => (
                <div 
                  key={vendor.id}
                  className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={vendor.logo} 
                      alt={vendor.businessName} 
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-stone-900">{vendor.businessName}</h4>
                        <StatusBadge status={vendor.status} />
                      </div>
                      <p className="text-xs text-stone-500">
                        Owner: <strong className="text-stone-700">{vendor.ownerName}</strong> &bull; {vendor.locationDetails}
                      </p>
                      <p className="text-[11px] text-brand-600 font-mono font-bold">
                        Code: {vendor.uniqueIdCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {vendor.certificateDocName && (
                      <button
                        onClick={() => setSelectedDocReview({
                          title: vendor.businessName,
                          type: 'Food Business Permit & Registrar Certificate',
                          docName: vendor.certificateDocName || 'cert.pdf',
                          entity: vendor
                        })}
                        className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-brand-500" />
                        <span>Inspect Permit</span>
                      </button>
                    )}

                    {vendor.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove('vendor', vendor.id)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject('vendor', vendor.id)}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-display font-extrabold text-base text-stone-900">
              Rider Fleet Verification & License Review
            </h3>

            <div className="space-y-3">
              {riders.map((rider) => (
                <div 
                  key={rider.id}
                  className="bg-stone-50/80 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5">
                    <img 
                      src={rider.avatarUrl} 
                      alt={rider.name} 
                      className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-sm text-stone-900">{rider.name}</h4>
                        <StatusBadge status={rider.status} />
                      </div>
                      <p className="text-xs text-stone-500">
                        Vehicle: <strong className="text-stone-700">{rider.vehicleType} ({rider.vehicleRegNumber})</strong> &bull; {rider.phone}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-mono font-bold">
                        Code: {rider.uniqueIdCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDocReview({
                        title: rider.name,
                        type: `DVLA License & Roadworthy (${rider.vehicleType})`,
                        docName: rider.licenseDocName || 'dvla_license.pdf',
                        entity: rider
                      })}
                      className="px-3 py-2 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Review DVLA License</span>
                    </button>

                    {rider.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove('rider', rider.id)}
                          className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject('rider', rider.id)}
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Orders Oversight */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-display font-extrabold text-base text-stone-900">
                All Campus Orders & Confirmation Codes
              </h3>
              <p className="text-xs text-stone-500">
                Live monitoring of student orders, payment status, and verification codes
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by order ID or student..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="p-2 text-xs bg-stone-50 border border-stone-200 rounded-xl"
              />
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="p-2 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="placed">Placed</option>
                <option value="accepted_vendor">Preparing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm text-stone-900">{order.id}</span>
                      <StatusBadge status={order.status} />
                      {order.disputed && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full">
                          DISPUTE FLAGGED
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Student: <strong className="text-stone-700">{order.customerName}</strong> ({order.customerLandmark})
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block uppercase font-bold">4-Digit Confirmation Code</span>
                      <span className="font-mono text-sm font-black text-brand-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {order.confirmationCode}
                      </span>
                    </div>
                    <span className="font-display font-black text-base text-stone-900">
                      GH₵ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
                  <span>Chop Bar: <strong>{order.vendorName}</strong></span>
                  <span>Rider: <strong>{order.riderName || 'Unassigned'}</strong></span>
                  <span>Time: <strong>{new Date(order.createdAt).toLocaleTimeString()}</strong></span>
                  {order.status !== 'delivered' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered', 'Admin forced completed for verification')}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-bold rounded-lg cursor-pointer"
                    >
                      Admin Force Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Universities Taxonomy */}
      {activeTab === 'universities' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-extrabold text-base text-stone-900">
                Ghanaian Higher Institutions ({universities.length})
              </h3>
              <p className="text-xs text-stone-500">
                Registered universities and accredited campus delivery drop-off zones
              </p>
            </div>
            <button
              onClick={() => setShowAddUniModal(true)}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-warm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add University</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {universities.map((uni) => (
              <div 
                key={uni.id}
                className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">{uni.name}</h4>
                    <span className="text-[10px] font-bold text-brand-600 bg-orange-100 px-2 py-0.5 rounded-md inline-block mt-0.5">
                      {uni.shortName} &bull; {uni.city}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Recognized Delivery Landmarks:
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                    {uni.popularLandmarks.map((lm, idx) => (
                      <span key={idx} className="text-[10px] bg-white border border-stone-200 px-2 py-0.5 rounded-md text-stone-700">
                        {lm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Document Inspection */}
      {selectedDocReview && (
        <Modal
          isOpen={!!selectedDocReview}
          onClose={() => setSelectedDocReview(null)}
          title="Document Verification Review"
          subtitle={`Inspecting credentials for: ${selectedDocReview.title}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-600 block">{selectedDocReview.type}</span>
              <p className="font-bold text-xs text-stone-900">{selectedDocReview.docName}</p>
              <p className="text-[11px] text-stone-500">Simulated Ghanaian Food & Drug Authority / DVLA Registrar Seal</p>
            </div>

            <div className="p-8 bg-stone-100 border-2 border-dashed border-stone-300 rounded-2xl text-center space-y-2">
              <FileText className="w-12 h-12 text-stone-400 mx-auto" />
              <p className="text-xs font-bold text-stone-700">Official Document Preview</p>
              <p className="text-[10px] text-stone-400 font-mono">MD5 Hash: 4e9a8f23b901a74d8e5f</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleApprove(
                  selectedDocReview.entity.vehicleType ? 'rider' : 'vendor',
                  selectedDocReview.entity.id
                )}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Certificate</span>
              </button>
              <button
                onClick={() => handleReject(
                  selectedDocReview.entity.vehicleType ? 'rider' : 'vendor',
                  selectedDocReview.entity.id
                )}
                className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>Flag & Reject</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal: Add University */}
      {showAddUniModal && (
        <Modal
          isOpen={showAddUniModal}
          onClose={() => setShowAddUniModal(false)}
          title="Add Ghanaian University"
          subtitle="Expand AduanePa Fie to another campus"
          maxWidth="md"
        >
          <form onSubmit={handleCreateUniversity} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Institution Name</label>
              <input
                type="text"
                required
                placeholder="e.g. University of Mines and Technology"
                value={newUniName}
                onChange={(e) => setNewUniName(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Short Name / Tag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UMaT (Tarkwa)"
                  value={newUniShort}
                  onChange={(e) => setNewUniShort(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tarkwa"
                  value={newUniCity}
                  onChange={(e) => setNewUniCity(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Region</label>
              <select
                value={newUniRegion}
                onChange={(e) => setNewUniRegion(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold cursor-pointer"
              >
                <option value="Greater Accra">Greater Accra</option>
                <option value="Ashanti Region">Ashanti Region</option>
                <option value="Central Region">Central Region</option>
                <option value="Eastern Region">Eastern Region</option>
                <option value="Western Region">Western Region</option>
                <option value="Northern Region">Northern Region</option>
                <option value="Volta Region">Volta Region</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Campus Landmarks (Comma separated)
              </label>
              <textarea
                rows={3}
                placeholder="Main Gate, Golden Hostel, KT Hall, Library Square"
                value={newUniLandmarks}
                onChange={(e) => setNewUniLandmarks(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-warm flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register University Campus</span>
            </button>
          </form>
        </Modal>
      )}

    </div>
  );
};
