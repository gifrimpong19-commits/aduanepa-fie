import React, { useState } from 'react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Modal } from '../common/Modal';
import { 
  MapPin, 
  CheckCircle2, 
  KeyRound, 
  ArrowRight
} from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    signupCustomer, 
    universities, 
    activeUniversity, 
    setActiveUniversity,
    users,
    setCurrentUser
  } = useMarketplace();

  const [mode, setMode] = useState<'profile' | 'login' | 'signup' | 'otp_verify'>('profile');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [selectedUniId, setSelectedUniId] = useState<string>(activeUniversity.id);
  const [landmark, setLandmark] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [simulatedSentOtp, setSimulatedSentOtp] = useState<string>('');

  const handleStartSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !landmark) {
      alert('Please fill all required fields');
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedSentOtp(code);
    setMode('otp_verify');
  };

  const handleVerifyOtpAndCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== simulatedSentOtp && otpCode !== '123456') {
      alert(`Invalid OTP code! For demo, enter "${simulatedSentOtp}" or "123456"`);
      return;
    }

    signupCustomer({
      name,
      email,
      phone,
      universityId: selectedUniId,
      landmark,
    });

    const uni = universities.find(u => u.id === selectedUniId);
    if (uni) setActiveUniversity(uni);

    setMode('profile');
    onClose();
  };

  const handleDirectLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
      const uni = universities.find(u => u.id === existing.universityId);
      if (uni) setActiveUniversity(uni);
      setMode('profile');
      onClose();
    } else {
      const newUser = signupCustomer({
        name: email.split('@')[0] || 'Student User',
        email,
        phone: phone || '+233 54 111 2233',
        universityId: selectedUniId,
        landmark: 'Campus Hostel',
      });
      setCurrentUser(newUser);
      setMode('profile');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        mode === 'profile' 
          ? 'Account Profile' 
          : mode === 'signup' 
          ? 'Student Registration' 
          : mode === 'otp_verify'
          ? 'Email Verification (OTP)'
          : 'Student Login'
      }
      subtitle={
        mode === 'profile'
          ? `Unique ID: ${currentUser.uniqueIdCode || 'ADP-CUST-1001'}`
          : 'AduanePa Fie Ghanaian Campus Network'
      }
      maxWidth="md"
    >
      {mode === 'profile' && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-orange-50/70 border border-orange-200 rounded-3xl">
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&h=300&q=80'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500 shadow-sm"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="font-display font-bold text-base text-stone-900">{currentUser.name}</h4>
                <span className="text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  {currentUser.status}
                </span>
              </div>
              <p className="text-xs text-stone-500">{currentUser.email}</p>
              <div className="text-[11px] font-semibold text-brand-700 flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeUniversity.shortName} &bull; {currentUser.landmark || 'Campus Hostel'}</span>
              </div>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Platform Role:</span>
              <span className="font-bold text-stone-900 uppercase">{currentUser.role}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Phone Number:</span>
              <span className="font-bold text-stone-900">{currentUser.phone || '+233 54 892 1432'}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Institution:</span>
              <span className="font-bold text-stone-900">{activeUniversity.name}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setMode('signup')}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 transition-colors"
            >
              Switch / New Signup
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white shadow-warm transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {mode === 'signup' && (
        <form onSubmit={handleStartSignup} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Ama Osei"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Phone (Ghana)</label>
              <input
                type="tel"
                required
                placeholder="+233 54 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Student / Personal Email</label>
            <input
              type="email"
              required
              placeholder="ama.osei@st.ug.edu.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Select University</label>
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
            <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Hall / Room Landmark</label>
            <input
              type="text"
              required
              placeholder="e.g. Pentagon Block B Room 314"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Create Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-warm flex items-center justify-center gap-2"
          >
            <span>Continue to Email OTP Verification</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-xs text-stone-500 hover:text-brand-600 font-semibold"
            >
              Already have an account? Login here
            </button>
          </div>
        </form>
      )}

      {mode === 'otp_verify' && (
        <form onSubmit={handleVerifyOtpAndCreate} className="space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-brand-600 flex items-center justify-center mx-auto text-2xl">
            <KeyRound className="w-6 h-6" />
          </div>

          <div>
            <h4 className="font-display font-bold text-base text-stone-900">Enter Email Verification OTP</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              We simulated sending a 6-digit code to <strong className="text-stone-800">{email}</strong>
            </p>
            <div className="mt-2 bg-amber-50 border border-amber-200 p-2 rounded-xl text-xs font-mono font-bold text-amber-900">
              Demo Code: <span className="text-brand-700 font-black">{simulatedSentOtp}</span> (or 123456)
            </div>
          </div>

          <div>
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-48 mx-auto p-3 text-center text-xl font-mono font-black tracking-widest bg-stone-50 border border-stone-300 rounded-2xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-warm flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify & Complete Registration</span>
          </button>
        </form>
      )}

      {mode === 'login' && (
        <form onSubmit={handleDirectLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="ama.osei@st.ug.edu.gh"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-warm flex items-center justify-center gap-2"
          >
            <span>Sign In to AduanePa Fie</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-xs text-stone-500 hover:text-brand-600 font-semibold"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
