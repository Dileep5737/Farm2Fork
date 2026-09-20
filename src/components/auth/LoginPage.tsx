import React, { useState } from 'react';
import { Role, User, RegionType } from '../../types';
import { DEMO_FARMER, DEMO_BUYER, DEMO_INTL_FARMER, DEMO_INTL_BUYER, SEED_FARMERS, StorageService } from '../../services/storage';
import {
  Sprout,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  ArrowRight,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Check,
  KeyRound,
  X,
  Loader2,
  Ship,
  User as UserIcon,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface LoginPageProps {
  initialRole?: Role;
  onSuccess: (user: User) => void;
  onBackToHome?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  initialRole = 'FARMER',
  onSuccess,
  onBackToHome,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [region, setRegion] = useState<RegionType>(() => {
    return StorageService.getRegion();
  });
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  
  // Country code for international mode
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState(
    initialRole === 'FARMER' ? '9845012345' : '9988765432'
  );
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation and loading states
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password modal state
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotStep, setForgotStep] = useState<'ENTER_PHONE' | 'OTP_SENT' | 'SUCCESS'>('ENTER_PHONE');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { success, error, info } = useToast();

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setPhoneError('');
    setPasswordError('');
    if (region === 'INTERNATIONAL') {
      if (role === 'FARMER') {
        setCountryCode('+91');
        setPhoneNumber('9845012345');
      } else {
        setCountryCode('+31');
        setPhoneNumber('612345678');
      }
    } else {
      if (role === 'FARMER') {
        setPhoneNumber('9845012345');
      } else {
        setPhoneNumber('9988765432');
      }
    }
  };

  const handleRegionChange = (newRegion: RegionType) => {
    setRegion(newRegion);
    StorageService.setRegion(newRegion);
    setIsRegionDropdownOpen(false);
    if (newRegion === 'INTERNATIONAL') {
      if (selectedRole === 'BUYER') {
        setCountryCode('+31');
        setPhoneNumber('612345678');
      } else {
        setCountryCode('+91');
        setPhoneNumber('9845012345');
      }
      info('Switched to International Mode. Cross-border agri-export & import suite active.', 'Region Updated');
    } else {
      setPhoneNumber(selectedRole === 'FARMER' ? '9845012345' : '9988765432');
      info('Switched to Local Mode. Direct domestic farm gate trading active.', 'Region Updated');
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const cleanPhone = phoneNumber.trim().replace(/\D/g, '');

    if (region === 'LOCAL') {
      if (!cleanPhone) {
        setPhoneError('Phone number is required');
        isValid = false;
      } else if (cleanPhone.length !== 10) {
        setPhoneError('Please enter a valid 10-digit phone number');
        isValid = false;
      } else {
        setPhoneError('');
      }
    } else {
      // International
      if (!cleanPhone || cleanPhone.length < 5 || cleanPhone.length > 15) {
        setPhoneError('Please enter a valid international phone number');
        isValid = false;
      } else {
        setPhoneError('');
      }
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      error('Please resolve the errors before proceeding.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanPhone = phoneNumber.trim().replace(/\D/g, '');

      let matchedUser: User;

      if (region === 'INTERNATIONAL') {
        if (selectedRole === 'FARMER') {
          matchedUser = {
            ...DEMO_INTL_FARMER,
            phone: `${countryCode} ${cleanPhone}`,
          };
        } else {
          matchedUser = {
            ...DEMO_INTL_BUYER,
            phone: `${countryCode} ${cleanPhone}`,
          };
        }
      } else {
        if (selectedRole === 'FARMER') {
          matchedUser = {
            ...DEMO_FARMER,
            phone: `+91 ${cleanPhone}`,
          };
        } else {
          matchedUser = {
            ...DEMO_BUYER,
            phone: `+91 ${cleanPhone}`,
          };
        }
      }

      StorageService.setCurrentUser(matchedUser);
      success(
        `Logged in as ${matchedUser.name} (${region === 'INTERNATIONAL' ? (selectedRole === 'FARMER' ? 'Agri-Exporter' : 'Global Importer') : (selectedRole === 'FARMER' ? 'Farmer' : 'Consumer')})`,
        'Welcome to Farm2Fork!'
      );
      onSuccess(matchedUser);
    }, 500);
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPhone || forgotPhone.trim().replace(/\D/g, '').length < 10) {
      error('Please enter a valid 10-digit registered phone number.');
      return;
    }
    setForgotStep('OTP_SENT');
    info(`One-Time Password sent via SMS to ${forgotPhone}. Demo OTP: 8899`, 'OTP Dispatched');
  };

  const handleVerifyReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '8899' && otpCode.length < 4) {
      error('Please enter the 4-digit OTP (Use demo OTP: 8899).');
      return;
    }
    if (newPassword.length < 6) {
      error('New password must be at least 6 characters.');
      return;
    }
    setForgotStep('SUCCESS');
    success('Your password has been successfully reset! You can now log in.', 'Password Reset Complete');
    setTimeout(() => {
      setIsForgotPasswordOpen(false);
      setForgotStep('ENTER_PHONE');
      setPassword(newPassword);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans select-none">
      {/* 1. Full-Screen Agricultural Farm Background with Subtle Dark Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="/assets/farm_login_bg.jpg"
          alt="Agricultural Farm Landscape"
          className="w-full h-full object-cover object-center transform scale-100 filter brightness-[0.9] saturate-[1.1]"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 2. Top Header (Branding Left & Region Selector Right) */}
      <header className="relative z-20 w-full px-6 sm:px-10 py-6 flex items-center justify-between">
        {/* Top-Left Branding */}
        <button
          onClick={onBackToHome}
          className="flex items-center gap-3 text-left group transition-transform active:scale-95 cursor-pointer"
          title="Farm2Fork"
        >
          <div className="w-10 h-10 rounded-xl bg-[#16a34a] text-white flex items-center justify-center shadow-md">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 leading-none">
              <span>Farm</span>
              <span className="text-[#4ade80]">2</span>
              <span>Fork</span>
            </div>
            <p className="text-[11px] font-medium text-white/90 mt-1 leading-none">
              From Farm. Directly to You.
            </p>
          </div>
        </button>

        {/* Top-Right Region Selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/95 hover:bg-white text-stone-800 font-semibold text-xs sm:text-sm shadow-md border border-stone-200/80 transition-all cursor-pointer"
          >
            {region === 'LOCAL' ? (
              <MapPin className="w-4 h-4 text-emerald-600" />
            ) : (
              <Globe className="w-4 h-4 text-sky-500" />
            )}
            <span>{region === 'LOCAL' ? 'Local' : 'International'}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-200 ${
                isRegionDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Region Dropdown Menu */}
          {isRegionDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsRegionDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 p-1.5 z-50 animate-slide-up">
                <button
                  type="button"
                  onClick={() => handleRegionChange('LOCAL')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    region === 'LOCAL'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>Local</span>
                  </div>
                  {region === 'LOCAL' && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleRegionChange('INTERNATIONAL')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    region === 'INTERNATIONAL'
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-sky-500" />
                    <span>International</span>
                  </div>
                  {region === 'INTERNATIONAL' && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 3. Center Login Card Matching Second Screenshot */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-[460px] bg-white rounded-[2rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border border-stone-100 p-8 sm:p-10 animate-slide-up">
          {/* Card Top Title & Subtitle */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-[28px] font-extrabold text-stone-900 tracking-tight">
              Welcome to Farm2Fork
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
              Choose your role to continue
            </p>
          </div>

          {/* Region Segmented Switcher (Top of Card) */}
          <div className="flex items-center justify-center mb-5">
            <div className="inline-flex p-1 bg-stone-100 rounded-2xl border border-stone-200/80 shadow-xs">
              <button
                type="button"
                onClick={() => handleRegionChange('LOCAL')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  region === 'LOCAL'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>🇮🇳 Domestic Local</span>
              </button>
              <button
                type="button"
                onClick={() => handleRegionChange('INTERNATIONAL')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  region === 'INTERNATIONAL'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🌐 Global Export</span>
              </button>
            </div>
          </div>

          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100/90 rounded-2xl mb-6 border border-stone-200/60">
            <button
              type="button"
              onClick={() => handleRoleSelect('FARMER')}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'FARMER'
                  ? region === 'INTERNATIONAL'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#16a34a] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span className="text-base">{region === 'INTERNATIONAL' ? '🚢' : '👨‍🌾'}</span>
              <span>{region === 'INTERNATIONAL' ? 'Agri-Exporter' : 'Farmer Login'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('BUYER')}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                selectedRole === 'BUYER'
                  ? region === 'INTERNATIONAL'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#16a34a] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {region === 'INTERNATIONAL' ? <Globe className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
              <span>{region === 'INTERNATIONAL' ? 'Global Importer' : 'Consumer Login'}</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phone-input"
                className="block text-xs font-bold text-stone-800 mb-1.5"
              >
                {region === 'INTERNATIONAL' ? 'Registered Trade Phone / Mobile' : 'Phone Number'}
              </label>
              <div
                className={`relative flex items-center bg-stone-50/80 border rounded-xl px-3 py-2.5 transition-all ${
                  phoneError
                    ? 'border-rose-400 bg-rose-50/40 ring-1 ring-rose-400'
                    : region === 'INTERNATIONAL'
                    ? 'border-stone-200 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20'
                    : 'border-stone-200 focus-within:border-[#16a34a] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20'
                }`}
              >
                {region === 'LOCAL' ? (
                  <div className="flex items-center gap-1.5 text-stone-500 pr-2 border-r border-stone-200 mr-2 shrink-0">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span className="text-xs font-semibold text-stone-700">+91</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 pr-2 border-r border-stone-200 mr-2 shrink-0">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="text-xs font-semibold text-stone-700 bg-transparent outline-none cursor-pointer"
                    >
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+31">🇳🇱 +31</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                    </select>
                  </div>
                )}

                <input
                  id="phone-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (phoneError) setPhoneError('');
                  }}
                  placeholder={region === 'LOCAL' ? 'Enter your 10-digit phone number' : 'Enter your phone number'}
                  className="w-full bg-transparent text-stone-900 text-sm font-medium outline-none placeholder:text-stone-400"
                />
              </div>

              {phoneError ? (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">
                  {phoneError}
                </p>
              ) : (
                <p className="text-[11px] text-stone-400 mt-1">
                  {region === 'LOCAL'
                    ? 'Please enter a valid 10-digit phone number'
                    : selectedRole === 'FARMER'
                    ? 'Agri-Exporter contact (Kiran Patel • Mumbai & Bengaluru Hub)'
                    : 'Global Importer contact (EuroFresh Continental • Rotterdam)'}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password-input"
                className="block text-xs font-bold text-stone-800 mb-1.5"
              >
                Password
              </label>
              <div
                className={`relative flex items-center bg-stone-50/80 border rounded-xl px-3 py-2.5 transition-all ${
                  passwordError
                    ? 'border-rose-400 bg-rose-50/40 ring-1 ring-rose-400'
                    : region === 'INTERNATIONAL'
                    ? 'border-stone-200 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/20'
                    : 'border-stone-200 focus-within:border-[#16a34a] focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-stone-400 mr-2 shrink-0" />

                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-stone-900 text-sm font-medium outline-none placeholder:text-stone-400"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError ? (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">
                  {passwordError}
                </p>
              ) : (
                <p className="text-[11px] text-stone-400 mt-1">
                  Password must be at least 6 characters (Demo: 123456)
                </p>
              )}
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-xl text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed ${
                  region === 'INTERNATIONAL'
                    ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-blue-600/25'
                    : 'bg-[#16a34a] hover:bg-[#15803d] active:bg-[#14532d] shadow-emerald-600/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {region === 'INTERNATIONAL'
                        ? selectedRole === 'FARMER'
                          ? 'Sign in to Agri-Export Console'
                          : 'Sign in to Global Importer Portal'
                        : 'Login'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setIsForgotPasswordOpen(true)}
                className={`text-xs font-semibold hover:underline transition-colors cursor-pointer ${
                  region === 'INTERNATIONAL' ? 'text-blue-600 hover:text-blue-700' : 'text-[#16a34a] hover:text-[#15803d]'
                }`}
              >
                Forgot Password?
              </button>
            </div>

            {/* Quick Demo Assist Banner */}
            <div className={`mt-3 p-3 rounded-2xl border flex flex-col gap-2 ${
              region === 'INTERNATIONAL'
                ? 'bg-blue-50/70 border-blue-200'
                : 'bg-stone-50 border-stone-200/70'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-stone-700 text-xs">
                  <Sparkles className={`w-3.5 h-3.5 shrink-0 ${region === 'INTERNATIONAL' ? 'text-blue-600' : 'text-amber-500'}`} />
                  <span className="font-bold text-[11px]">
                    {region === 'INTERNATIONAL'
                      ? selectedRole === 'FARMER'
                        ? 'Agri-Exporter (Kiran Patel • Mumbai)'
                        : 'Global Importer (Alexandre Dubois • Netherlands)'
                      : selectedRole === 'FARMER'
                      ? 'Local Farmer (Kiran • Doddaballapura)'
                      : 'Local Consumer (Priya Sharma • Bengaluru)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (region === 'INTERNATIONAL') {
                      if (selectedRole === 'FARMER') {
                        setCountryCode('+91');
                        setPhoneNumber('9845012345');
                        setPassword('123456');
                      } else {
                        setCountryCode('+31');
                        setPhoneNumber('612345678');
                        setPassword('123456');
                      }
                    } else {
                      if (selectedRole === 'FARMER') {
                        setPhoneNumber('9845012345');
                        setPassword('123456');
                      } else {
                        setPhoneNumber('9988765432');
                        setPassword('123456');
                      }
                    }
                    info('Demo credentials populated.', 'Quick Fill');
                  }}
                  className={`text-[11px] font-bold px-2 py-0.5 rounded border cursor-pointer ${
                    region === 'INTERNATIONAL'
                      ? 'text-blue-700 bg-white border-blue-300 hover:bg-blue-50'
                      : 'text-[#16a34a] bg-white border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  Auto-Fill
                </button>
              </div>

              {/* Direct Instant 1-Click Login Button */}
              <button
                type="button"
                onClick={() => {
                  let demoUser: User;
                  if (region === 'INTERNATIONAL') {
                    demoUser = selectedRole === 'FARMER' ? DEMO_INTL_FARMER : DEMO_INTL_BUYER;
                  } else {
                    demoUser = selectedRole === 'FARMER' ? DEMO_FARMER : DEMO_BUYER;
                  }
                  StorageService.setCurrentUser(demoUser);
                  success(
                    `Logged in as ${demoUser.name} (${region === 'INTERNATIONAL' ? (selectedRole === 'FARMER' ? 'Agri-Exporter' : 'Global Importer') : (selectedRole === 'FARMER' ? 'Farmer' : 'Consumer')})`,
                    'Welcome to Farm2Fork!'
                  );
                  onSuccess(demoUser);
                }}
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  region === 'INTERNATIONAL'
                    ? 'bg-blue-600/15 hover:bg-blue-600/25 text-blue-900 border border-blue-300'
                    : 'bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-900 border border-emerald-300'
                }`}
              >
                <span>⚡ 1-Click Instant Demo Login</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* 4. Bottom Footer */}
      <footer className="relative z-20 w-full px-4 py-4 text-center text-xs text-white/90 drop-shadow-sm font-medium">
        © 2026 Farm2Fork Marketplace • Direct Farm-to-Consumer Gateway
      </footer>

      {/* 5. Functional Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 sm:p-8 animate-slide-up relative">
            <button
              onClick={() => {
                setIsForgotPasswordOpen(false);
                setForgotStep('ENTER_PHONE');
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-extrabold text-stone-900 mb-1">
              Reset Your Password
            </h3>
            <p className="text-xs text-stone-600 mb-6">
              Enter your registered phone number to receive verification code and reset your credentials.
            </p>

            {forgotStep === 'ENTER_PHONE' && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Registered Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3" />
                    <input
                      type="tel"
                      required
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      placeholder="e.g. 9845012345"
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Send Verification Code →
                </button>
              </form>
            )}

            {forgotStep === 'OTP_SENT' && (
              <form onSubmit={handleVerifyReset} className="space-y-4">
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                  <span>Demo OTP sent: </span>
                  <strong className="font-mono text-sm">8899</strong>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    4-Digit Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="8899"
                    className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    New Password (min 6 characters)
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full py-2.5 px-3 text-sm border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Confirm & Reset Password
                </button>
              </form>
            )}

            {forgotStep === 'SUCCESS' && (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-emerald-900 text-sm">Password Reset Successful!</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Updating your login credentials...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
