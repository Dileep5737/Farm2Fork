import React, { useState, useEffect } from 'react';
import { Role, User } from '../../types';
import { DEMO_FARMER, DEMO_BUYER, StorageService } from '../../services/storage';
import { X, Sprout, ShoppingBag, Sparkles, Lock, Mail, User as UserIcon, Phone, MapPin } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  initialRole?: Role;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialRole = 'FARMER',
  onClose,
  onSuccess,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<Role>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [farmName, setFarmName] = useState('');
  const { success, error } = useToast();

  useEffect(() => {
    if (initialRole) setRole(initialRole);
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      error('Please fill in both email and password.');
      return;
    }

    if (isRegister) {
      if (!name || !location) {
        error('Please enter your full name and location.');
        return;
      }

      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        phone: phone || '+91 98765 43210',
        role,
        location,
        coordinates: role === 'FARMER' ? { lat: 13.2925, lng: 77.5429 } : { lat: 12.9784, lng: 77.6408 },
        farmName: role === 'FARMER' ? farmName || `${name}'s Farm` : undefined,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      };

      StorageService.setCurrentUser(newUser);
      success(`Registered and logged in as ${newUser.name}!`, 'Account Created');
      onSuccess(newUser);
      onClose();
    } else {
      // Login flow
      let loggedUser: User;
      if (email.toLowerCase().includes('farmer') || role === 'FARMER') {
        loggedUser = { ...DEMO_FARMER, email, name: name || DEMO_FARMER.name };
      } else {
        loggedUser = { ...DEMO_BUYER, email, name: name || DEMO_BUYER.name };
      }
      StorageService.setCurrentUser(loggedUser);
      success(`Welcome back, ${loggedUser.name}!`, 'Logged In');
      onSuccess(loggedUser);
      onClose();
    }
  };

  const handleQuickDemo = (demoRole: Role) => {
    const demoUser = demoRole === 'FARMER' ? DEMO_FARMER : DEMO_BUYER;
    StorageService.setCurrentUser(demoUser);
    success(`Logged in as ${demoUser.name} (${demoUser.role === 'FARMER' ? 'Farmer' : 'Buyer'})`, 'Quick Login');
    onSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-slide-up relative">
        {/* Header with Background Gradient & Tomato Image */}
        <div className="p-6 bg-stone-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="/assets/tomato_login.jpg"
              alt="Fresh Tomatoes"
              className="w-full h-full object-cover opacity-30 object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-farm-950/80 to-stone-950/90" />
          </div>

          <div className="relative z-10">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-farm-500/20 border border-farm-500/30 text-farm-300 text-xs font-bold mb-2 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Farm2Fork Direct Access</span>
            </div>

            <h3 className="text-xl font-extrabold text-white">
              {isRegister ? 'Create Your Account' : 'Welcome to Farm2Fork'}
            </h3>
            <p className="text-xs text-stone-300 mt-1">
              {role === 'FARMER'
                ? 'Empowering farmers with direct gate sales and transparent pricing.'
                : 'Direct from local farms with smart recommendation pricing.'}
            </p>
          </div>
        </div>

        {/* Quick Demo Logins */}
        <div className="px-6 pt-4 pb-2 bg-amber-50/70 border-b border-amber-200/60">
          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>⚡ Quick Demo Logins</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('FARMER')}
              className="px-3 py-2 rounded-xl bg-white border border-farm-300 text-farm-800 text-xs font-bold hover:bg-farm-50 transition-colors text-left flex items-center gap-2 shadow-xs"
            >
              <span>👨‍🌾</span>
              <span className="truncate">Demo Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('BUYER')}
              className="px-3 py-2 rounded-xl bg-white border border-blue-300 text-blue-800 text-xs font-bold hover:bg-blue-50 transition-colors text-left flex items-center gap-2 shadow-xs"
            >
              <span>🛒</span>
              <span className="truncate">Demo Buyer</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Role Toggle */}
          <div>
            <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setRole('FARMER')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'FARMER'
                    ? 'bg-white text-farm-800 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sprout className="w-4 h-4 text-farm-600" />
                <span>Farmer / FPO</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('BUYER')}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  role === 'BUYER'
                    ? 'bg-white text-blue-800 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <span>Buyer</span>
              </button>
            </div>
          </div>

          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none"
                  />
                </div>
              </div>

              {role === 'FARMER' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Farm / FPO Name</label>
                  <div className="relative">
                    <Sprout className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={farmName}
                      onChange={(e) => setFarmName(e.target.value)}
                      placeholder="e.g. Green Valley Agro FPO"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450..."
                      className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Bengaluru Rural"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'FARMER' ? 'farmer@farm2fork.com' : 'buyer@farm2fork.com'}
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:ring-2 focus:ring-farm-500 focus:border-farm-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-farm-600 hover:bg-farm-700 text-white font-bold text-sm shadow-md shadow-farm-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>{isRegister ? 'Complete Registration' : `Login as ${role === 'FARMER' ? 'Farmer' : 'Buyer'}`}</span>
          </button>

          {/* Toggle Register / Login */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-semibold text-farm-700 hover:text-farm-800 hover:underline"
            >
              {isRegister
                ? 'Already have an account? Sign in here'
                : "Don't have an account? Register new profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
