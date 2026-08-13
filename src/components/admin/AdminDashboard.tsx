import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { StatusBadge } from '../common/StatusBadge';
import { GhanaianUniversity } from '../../types';
import { 
  ShieldCheck, 
  Store, 
  Bike, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  MapPin, 
  Plus, 
  Search
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
    updateOrderStatus
  } = useMarketplace();

  const [activeTab, setActiveTab] = useState<'approvals' | 'orders' | 'universities' | 'analytics'>('approvals');
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

  // Metrics
  const totalVolume = orders.reduce((sum, o) => sum + o.total, 0);
  const deliveredCount = orders.filter(o => o.status === 'delivered').length;
  const pendingApprovalsCount = vendors.filter(v => v.status === 'pending').length + riders.filter(r => r.status === 'pending').length;
  const disputedOrders = orders.filter(o => o.disputed);

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

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      
      {/* Admin Operations Top Bar */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-warm border border-stone-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-warm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-extrabold text-2xl text-white">
                  AduanePa Fie Platform Governance
                </h1>
                <span className="font-mono text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Ecosystem oversight, vendor & rider verification, Ghanaian universities taxonomy, and dispute handling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-3 py-1.5 rounded-xl text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Ecosystem Healthy & Active
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
            <span className="text-[10px] uppercase font-bold text-stone-400 block">Dispute Flags</span>
            <span className={`font-display font-black text-2xl mt-1 block ${disputedOrders.length > 0 ? 'text-rose-400' : 'text-stone-300'}`}>
              {disputedOrders.length} issues
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
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
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
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
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'universities'
              ? 'bg-stone-900 text-amber-300 shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Ghanaian Universities Taxonomy</span>
        </button>
      </div>

      {/* Tab: Approvals & Verification */}
      {activeTab === 'approvals' && (
        <div className="space-y-8">
          
          {/* Vendor Applications */}
          <div className="space-y-4">
            <h3 className="font-display font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-brand-600" />
              <span>Campus Food Vendor Applications</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {vendors.map((v) => (
                <div 
                  key={v.id}
                  className="bg-white rounded-3xl border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={v.logo}
                      alt={v.businessName}
                      className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-base text-stone-900">{v.businessName}</h4>
                        <span className="font-mono text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                          {v.uniqueIdCode}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          v.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : v.status === 'pending'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {v.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Owner: <strong className="text-stone-700">{v.ownerName}</strong> &bull; Campus: <strong className="text-stone-700">{v.universityId}</strong> ({v.city})
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Doc: <span className="font-mono font-bold text-emerald-700">{v.certificateDocName || 'gh_food_permit.pdf'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDocReview({
                        title: v.businessName,
                        type: 'Food Business Permit & Certificate',
                        docName: v.certificateDocName || 'gh_food_permit.pdf',
                        entity: v,
                      })}
                      className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Inspect Docs</span>
                    </button>

                    {v.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove('vendor', v.id)}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-warm flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve & Grant ID</span>
                      </button>
                    )}

                    {v.status !== 'rejected' && (
                      <button
                        onClick={() => handleReject('vendor', v.id)}
                        className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rider Applications */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <h3 className="font-display font-extrabold text-lg text-stone-900 flex items-center gap-2">
              <Bike className="w-5 h-5 text-emerald-600" />
              <span>Courier / Delivery Rider Applications</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {riders.map((r) => (
                <div 
                  key={r.id}
                  className="bg-white rounded-3xl border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={r.avatarUrl}
                      alt={r.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-stone-200"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-base text-stone-900">{r.name}</h4>
                        <span className="font-mono text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
                          {r.uniqueIdCode}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          r.status === 'approved' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : r.status === 'pending'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500">
                        Vehicle: <strong className="text-stone-700">{r.vehicleType} ({r.vehicleRegNumber})</strong> &bull; Region: {r.region}
                      </p>
                      <p className="text-[11px] text-stone-400">
                        License: <span className="font-mono font-bold text-emerald-700">{r.licenseDocName || 'dvla_license.pdf'}</span> &bull; Roadworthy: <span className="font-mono font-bold text-emerald-700">{r.vehicleDocName || 'roadworthy.pdf'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDocReview({
                        title: r.name,
                        type: `DVLA Driver License & ${r.vehicleType} Papers`,
                        docName: `${r.licenseDocName} | ${r.vehicleDocName}`,
                        entity: r,
                      })}
                      className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Inspect Docs</span>
                    </button>

                    {r.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove('rider', r.id)}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-warm flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Rider</span>
                      </button>
                    )}

                    {r.status !== 'rejected' && (
                      <button
                        onClick={() => handleReject('rider', r.id)}
                        className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab: Master Order Oversight */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by order ID, student name, or vendor..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="md:col-span-4">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-800 focus:ring-2 focus:ring-brand-500"
              >
                <option value="all">All Order Statuses</option>
                <option value="placed">Placed (Pending Vendor)</option>
                <option value="accepted_vendor">Accepted by Vendor</option>
                <option value="preparing">In Kitchen Preparation</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered Successfully</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-400 uppercase font-bold text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Order ID & OTP</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Student Dropoff</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Intervention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-stone-900 block">{ord.id}</span>
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                          OTP: {ord.confirmationCode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-stone-800">
                        {ord.vendorName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-stone-900 block">{ord.customerName}</span>
                        <span className="text-[11px] text-stone-500">{ord.customerLandmark}</span>
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-stone-900">
                        GH₵ {ord.total.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={ord.status} isDisputed={ord.disputed} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {ord.disputed && (
                          <button
                            onClick={() => {
                              updateOrderStatus(ord.id, 'delivered', 'Admin resolved dispute and closed order.');
                              alert(`Resolved dispute on Order #${ord.id}`);
                            }}
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded-lg mr-2"
                          >
                            Resolve Dispute
                          </button>
                        )}
                        {ord.status !== 'delivered' && ord.status !== 'cancelled' && (
                          <button
                            onClick={() => {
                              updateOrderStatus(ord.id, 'delivered', 'Admin force-completed delivery.');
                            }}
                            className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-bold rounded-lg"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Ghanaian Universities Taxonomy */}
      {activeTab === 'universities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-extrabold text-lg text-stone-900">
                Master List of Ghanaian Institutions ({universities.length})
              </h3>
              <p className="text-xs text-stone-500">
                University, region, and city taxonomies powering localized vendor discovery
              </p>
            </div>
            <button
              onClick={() => setShowAddUniModal(true)}
              className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-warm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Ghanaian University</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {universities.map((uni) => (
              <div 
                key={uni.id}
                className="bg-white rounded-3xl border border-stone-200 p-5 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold bg-orange-100 text-brand-800 px-2 py-0.5 rounded-md">
                    {uni.id}
                  </span>
                  <span className="text-xs text-stone-500 font-semibold">
                    {uni.city}, {uni.region}
                  </span>
                </div>

                <div>
                  <h4 className="font-display font-bold text-base text-stone-900">
                    {uni.name}
                  </h4>
                  <p className="text-xs text-stone-500">{uni.campusName}</p>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                    Key Landmarks ({uni.popularLandmarks.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {uni.popularLandmarks.slice(0, 4).map((lm, i) => (
                      <span key={i} className="text-[10px] bg-stone-50 text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                        {lm}
                      </span>
                    ))}
                    {uni.popularLandmarks.length > 4 && (
                      <span className="text-[10px] text-stone-400 font-bold">
                        +{uni.popularLandmarks.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Inspection Modal */}
      {selectedDocReview && (
        <Modal
          isOpen={!!selectedDocReview}
          onClose={() => setSelectedDocReview(null)}
          title="Document Verification Review"
          subtitle={selectedDocReview.title}
          maxWidth="md"
        >
          <div className="space-y-5">
            <div className="p-4 bg-stone-900 text-white rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <FileText className="w-4 h-4" />
                <span>{selectedDocReview.type}</span>
              </div>
              <p className="font-mono text-xs text-emerald-300 font-bold">
                File: {selectedDocReview.docName}
              </p>
              <div className="h-28 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-center p-4">
                <p className="text-xs text-stone-400">
                  📄 [Official Republic of Ghana Verified Digital Certificate / DVLA Permit Data Stamp]
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleReject('vendor', selectedDocReview.entity.id)}
                className="py-2.5 text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl"
              >
                Reject Application
              </button>
              <button
                onClick={() => handleApprove('vendor', selectedDocReview.entity.id)}
                className="py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-warm"
              >
                Approve & Grant Unique ID
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add University Modal */}
      <Modal
        isOpen={showAddUniModal}
        onClose={() => setShowAddUniModal(false)}
        title="Register New Ghanaian University"
        subtitle="Expand AduanePa Fie campus coverage"
        maxWidth="md"
      >
        <form onSubmit={handleCreateUniversity} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">University Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. University of Mines and Technology (UMaT)"
              value={newUniName}
              onChange={(e) => setNewUniName(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Short Name</label>
              <input
                type="text"
                required
                placeholder="e.g. UMaT"
                value={newUniShort}
                onChange={(e) => setNewUniShort(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Region</label>
              <select
                value={newUniRegion}
                onChange={(e) => setNewUniRegion(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800"
              >
                <option value="Greater Accra">Greater Accra</option>
                <option value="Ashanti Region">Ashanti Region</option>
                <option value="Central Region">Central Region</option>
                <option value="Western Region">Western Region</option>
                <option value="Eastern Region">Eastern Region</option>
                <option value="Northern Region">Northern Region</option>
                <option value="Volta Region">Volta Region</option>
                <option value="Bono Region">Bono Region</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">City / Town</label>
              <input
                type="text"
                required
                placeholder="e.g. Tarkwa"
                value={newUniCity}
                onChange={(e) => setNewUniCity(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Campus Description</label>
              <input
                type="text"
                placeholder="e.g. Tarkwa Main Campus"
                value={newUniCampus}
                onChange={(e) => setNewUniCampus(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Popular Landmarks (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Gold Hall, KT Annex, Engineering Block, UMaT Cafeteria"
              value={newUniLandmarks}
              onChange={(e) => setNewUniLandmarks(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-warm"
          >
            Register University & Enable Vendors
          </button>
        </form>
      </Modal>

    </div>
  );
};
