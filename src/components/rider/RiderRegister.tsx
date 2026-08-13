import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { VehicleType } from '../../types';
import { 
  Bike, 
  Upload, 
  ShieldCheck
} from 'lucide-react';

interface RiderRegisterProps {
  onRegistered: () => void;
}

export const RiderRegister: React.FC<RiderRegisterProps> = ({ onRegistered }) => {
  const { universities, addRider, activeUniversity } = useMarketplace();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('Motorbike');
  const [vehicleRegNumber, setVehicleRegNumber] = useState<string>('GR-4829-25');
  const [selectedUniId, setSelectedUniId] = useState<string>(activeUniversity.id);
  const [licenseDoc, setLicenseDoc] = useState<string>('');
  const [vehicleDoc, setVehicleDoc] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [assignedCode, setAssignedCode] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uni = universities.find(u => u.id === selectedUniId) || activeUniversity;

    const newRider = addRider({
      name,
      email,
      phone,
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&h=300&q=80',
      vehicleType,
      vehicleRegNumber,
      universityId: selectedUniId,
      region: uni.region,
      city: uni.city,
      licenseDocName: licenseDoc || 'dvla_class_a_license.pdf',
      vehicleDocName: vehicleDoc || 'roadworthy_insurance_cert.pdf',
      isAvailable: true,
    });

    setAssignedCode(newRider.uniqueIdCode);
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto pb-20 animate-in fade-in duration-200">
      {submitted ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
            🛵
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-2xl text-stone-900">
              Rider Application Submitted!
            </h3>
            <p className="text-xs text-stone-500">
              Your driver credentials and vehicle papers have been forwarded to Admin Operations.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl max-w-sm mx-auto space-y-1">
            <span className="text-[10px] uppercase font-bold text-stone-500">Assigned Rider Code</span>
            <p className="font-mono text-xl font-black text-emerald-800">{assignedCode}</p>
            <span className="inline-block text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-md">
              Status: Pending Verification
            </span>
          </div>

          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            Admin ops will review your DVLA license and roadworthy document. You will be able to accept orders across {activeUniversity.shortName} as soon as approved.
          </p>

          <button
            onClick={onRegistered}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-warm transition-all"
          >
            Go to Rider Fleet
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-xl text-stone-900">
                Join AduanePa Rider Fleet
              </h2>
              <p className="text-xs text-stone-500">
                Earn money fulfilling food deliveries across university campus hostels & halls
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Full Legal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yaw Boateng"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Phone Number (Ghana)</label>
                <input
                  type="tel"
                  required
                  placeholder="+233 24 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="yaw.boateng@aduanepa.gh"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Vehicle Mode</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value as VehicleType)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Motorbike">Motorbike / Scooter</option>
                  <option value="Bicycle">Bicycle / Electric Bike</option>
                  <option value="Car">Car</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Vehicle / Bike Registration #</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GR-4829-25 or BIKE-08"
                  value={vehicleRegNumber}
                  onChange={(e) => setVehicleRegNumber(e.target.value)}
                  className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Primary Campus Operating Zone</label>
              <select
                value={selectedUniId}
                onChange={(e) => setSelectedUniId(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-500"
              >
                {universities.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.city}, {u.region})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Driver's License / Ghana Card
                </label>
                <div className="p-3 border-2 border-dashed border-stone-200 rounded-2xl text-center bg-stone-50/50">
                  <input
                    type="file"
                    id="licenseUpload"
                    onChange={(e) => setLicenseDoc(e.target.files?.[0]?.name || 'license_doc.pdf')}
                    className="hidden"
                  />
                  <label htmlFor="licenseUpload" className="cursor-pointer block space-y-1">
                    <Upload className="w-5 h-5 text-emerald-600 mx-auto" />
                    <span className="text-[11px] font-bold text-stone-700 block truncate">
                      {licenseDoc || 'Upload License / ID'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Vehicle Roadworthy / Permit
                </label>
                <div className="p-3 border-2 border-dashed border-stone-200 rounded-2xl text-center bg-stone-50/50">
                  <input
                    type="file"
                    id="vehicleUpload"
                    onChange={(e) => setVehicleDoc(e.target.files?.[0]?.name || 'roadworthy_doc.pdf')}
                    className="hidden"
                  />
                  <label htmlFor="vehicleUpload" className="cursor-pointer block space-y-1">
                    <Upload className="w-5 h-5 text-emerald-600 mx-auto" />
                    <span className="text-[11px] font-bold text-stone-700 block truncate">
                      {vehicleDoc || 'Upload Roadworthy'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-warm flex items-center justify-center gap-2 transition-all mt-4"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Submit Rider Profile for Admin Approval</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
