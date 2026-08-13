import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { 
  Store, 
  Upload, 
  ShieldCheck,
  ShieldAlert,
  Phone,
  User,
  MapPin
} from 'lucide-react';

interface VendorRegisterProps {
  onRegistered: () => void;
}

export const VendorRegister: React.FC<VendorRegisterProps> = ({ onRegistered }) => {
  const { universities, addVendor, activeUniversity } = useMarketplace();

  const [ownerName, setOwnerName] = useState<string>('');
  const [businessName, setBusinessName] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedUniId, setSelectedUniId] = useState<string>(activeUniversity.id);
  const [locationDetails, setLocationDetails] = useState<string>('');
  const [openHour, setOpenHour] = useState<string>('08:00');
  const [closeHour, setCloseHour] = useState<string>('21:30');
  const [categories, setCategories] = useState<string>('Waakye, Jollof & Rice, Local Soups');
  const [certFileName, setCertFileName] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validateGhanaPhone = (phoneStr: string) => {
    return /^(\+?233|0)[235][0-9]{8}$/.test(phoneStr.replace(/[\s-]/g, ''));
  };

  const handleFileUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertFileName(e.target.files[0].name);
    } else {
      setCertFileName('gh_food_permit_cert_2026.pdf');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!businessName.trim()) {
      setErrorMessage('Please enter the restaurant/chop bar business name.');
      return;
    }
    if (!ownerName.trim()) {
      setErrorMessage('Please enter the owner full name.');
      return;
    }
    if (phone.trim() && !validateGhanaPhone(phone.trim())) {
      setErrorMessage('Please enter a valid Ghanaian phone number (e.g. 024 333 4455 or +233 24 333 4455).');
      return;
    }
    if (!locationDetails.trim()) {
      setErrorMessage('Please specify the exact campus location (e.g. Bush Canteen Lane).');
      return;
    }

    const uni = universities.find(u => u.id === selectedUniId) || activeUniversity;
    const catList = categories.split(',').map(c => c.trim()).filter(Boolean);

    const newVen = addVendor({
      ownerId: `usr-vendor-${Date.now()}`,
      businessName: businessName.trim(),
      ownerName: ownerName.trim(),
      tagline: tagline.trim() || 'Authentic Ghanaian Campus Delicacies',
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&h=200&q=80',
      bannerImage: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
      universityId: selectedUniId,
      region: uni.region,
      city: uni.city,
      locationDetails: locationDetails.trim() || `${uni.campusName} Food Joint`,
      operatingHours: {
        open: openHour,
        close: closeHour,
        daysOpen: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      },
      isManuallyOpen: true,
      certificateDocName: certFileName || 'gh_food_board_registration.pdf',
      categories: catList.length > 0 ? catList : ['Waakye', 'Jollof & Rice'],
      rating: 5.0,
      deliveryTimeEstimate: '20-30 mins',
      minOrder: 25,
      deliveryFee: 10,
    });

    setGeneratedCode(newVen.uniqueIdCode);
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in duration-200">
      {submitted ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 text-brand-600 flex items-center justify-center mx-auto text-3xl">
            📋
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-2xl text-stone-900">
              Vendor Application Submitted!
            </h3>
            <p className="text-xs text-stone-500">
              Your chop bar application has been logged for Admin Operations review.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl max-w-sm mx-auto space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-500">Assigned Vendor Code</span>
            <p className="font-mono text-xl font-black text-brand-700">{generatedCode}</p>
            <span className="inline-block text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
              Status: Pending Verification
            </span>
          </div>

          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            Our Admin Operations team verifies food hygiene permits and university affiliations before publishing your restaurant storefront on the student feed.
          </p>

          <button
            onClick={onRegistered}
            className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-warm transition-all"
          >
            Go to Vendor Hub
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-brand-600 flex items-center justify-center">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl text-stone-900">
                Register Your Campus Food Business
              </h2>
              <p className="text-xs text-stone-500">
                Join AduanePa Fie to receive direct student orders across campus
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Business / Restaurant Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bush Canteen Special"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-brand-500" />
                  <span>Owner Full Name</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kofi Mensah"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-brand-500" />
                  <span>Contact Phone Number</span>
                </label>
                <input
                  type="tel"
                  placeholder="024 333 4455"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Tagline / Food Specialties</label>
                <input
                  type="text"
                  placeholder="e.g. Best Waakye with Shito & Fried Fish in Legon"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Target University Campus</label>
                <select
                  value={selectedUniId}
                  onChange={(e) => setSelectedUniId(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800 focus:ring-2 focus:ring-brand-500"
                >
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-brand-500" />
                  <span>Campus Spot / Stall Location</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Night Market Stall 14 or Bush Canteen Lane"
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Opening Hour</label>
                <input
                  type="time"
                  value={openHour}
                  onChange={(e) => setOpenHour(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Closing Hour</label>
                <input
                  type="time"
                  value={closeHour}
                  onChange={(e) => setCloseHour(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Main Categories (Comma separated)</label>
              <input
                type="text"
                placeholder="Waakye, Jollof & Rice, Fried Yam & Grills, Local Soups"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1 flex items-center justify-between">
                <span>Business / Food Hygiene Certificate (Mandatory)</span>
                <span className="text-[10px] text-brand-600 font-semibold">PDF, JPG, PNG</span>
              </label>
              
              <div className="p-4 border-2 border-dashed border-stone-200 hover:border-brand-300 rounded-2xl text-center bg-stone-50/50 transition-colors">
                <input
                  type="file"
                  id="certUpload"
                  onChange={handleFileUploadSim}
                  className="hidden"
                />
                <label htmlFor="certUpload" className="cursor-pointer block space-y-2">
                  <Upload className="w-6 h-6 text-brand-500 mx-auto" />
                  <span className="text-xs font-bold text-stone-700 block">
                    {certFileName || 'Click to upload Registrar Certificate / Food Permit'}
                  </span>
                  <span className="text-[10px] text-stone-400 block">
                    {certFileName ? 'Document selected successfully' : 'Simulated verification upload for Admin review'}
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-600 hover:to-amber-600 text-white font-bold text-xs rounded-2xl shadow-warm flex items-center justify-center gap-2 transition-all mt-4"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Vendor Registration for Admin Approval</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
