import { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  ArrowLeft,
  X,
  Gift,
  Globe,
  Shield,
  Zap,
  Clock,
  Eye,
  EyeOff,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Link, useLocation } from 'wouter';
import { useTranslation } from '@/contexts/TranslationContext';
import { useQuery } from '@tanstack/react-query';
import { useSettingByKey } from '@/hooks/useSettings';
import { signInWithGoogle } from "@/lib/firebase";
import ReCAPTCHA from 'react-google-recaptcha';
import { useRef } from 'react';

interface ReferralSettings {
  enabled: boolean;
  referredUserDiscount: string;
}

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [signupStep, setSignupStep] = useState<'email' | 'otp' | 'details'>('email');
  const [forgotStep, setForgotStep] = useState<'email' | 'reset'>('email');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [showReferralBanner, setShowReferralBanner] = useState(false);

  const logo = useSettingByKey('logo');
  const siteName = useSettingByKey('platform_name');

  const recaptchaRef = useRef<ReCAPTCHA | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const VITE_RECAPTCHA_SITE_KEY = useSettingByKey('recaptcha_site_key');
  const RecaptchaEnabled = useSettingByKey('recaptcha_enabled');

  const isCaptchaEnabled = String(RecaptchaEnabled) === 'true';

  const { data: settings } = useQuery<ReferralSettings>({
    queryKey: ['/api/referrals/settings'],
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');

    if (refCode) {
      const upperRefCode = refCode.toUpperCase();
      setReferralCode(upperRefCode);
      setShowReferralBanner(true);
      localStorage.setItem('pendingReferralCode', upperRefCode);
    }
  }, []);

  const resetForms = () => {
    setSignupStep('email');
    setForgotStep('email');
    setShowForgotPassword(false);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setName('');
  };

  // ✅ Cleanup effect
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  // const handlePasswordLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!email || !password) return;

  //   setIsLoading(true);
  //   try {
  //     await apiRequest('POST', '/api/auth/login-password', { email, password });

  //     queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });

  //     toast({
  //       title: t('common.success'),
  //       description: t('checkout.loginSuccessful', 'Login successful!'),
  //     });

  //     setLocation('/account/profile');
  //   } catch (error: any) {
  //     let errorMessage = 'Invalid email or password';
  //     try {
  //       const match = error.message?.match(/\d+:\s*(.+)/);
  //       if (match) {
  //         const parsed = JSON.parse(match[1]);
  //         errorMessage = parsed.message || errorMessage;
  //       }
  //     } catch {}

  //     toast({
  //       title: 'Error',
  //       description: errorMessage,
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please enter email and password',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isCaptchaEnabled && !captchaToken) {
        toast({
          title: t('website.login.captchaRequired', 'Captcha Required'),
          description: t('website.login.verifyHuman', 'Please verify you are human'),
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      await apiRequest('POST', '/api/auth/login-password', {
        email,
        password,
        captchaToken,
      });

      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });

      // Clear form
      setEmail('');
      setPassword('');
      recaptchaRef.current?.reset();
      setCaptchaToken(null);

      toast({
        title: 'Success!',
        description: 'Login successful! Redirecting...',
        duration: 1500,
      });

      // ✅ Safe navigation sequence
      // const timer1 = setTimeout(() => {
      //   setIsLoading(false);
      //   setLocation('/account/profile');
      // }, 800);

      const timer2 = setTimeout(() => {
        if (window.location.pathname !== '/account/profile') {
          window.location.href = '/account/profile';
        }
      }, 1200);

      return () => {
        // clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } catch (error: any) {
      let errorMessage = 'Invalid email or password';
      try {
        const match = error.message?.match(/\d+:\s*(.+)/);
        if (match) {
          const parsed = JSON.parse(match[1]);
          errorMessage = parsed.message || errorMessage;
        }
      } catch { }

      toast({
        title: 'Login Failed',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSignupOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/auth/send-otp', { email, purpose: 'signup' });
      setSignupStep('otp');
      toast({
        title: t('checkout.otpSent', 'OTP Sent'),
        description: t('checkout.checkEmail', 'Check your email for the verification code.'),
      });
    } catch (error: any) {
      let errorMessage = 'Failed to send OTP';
      try {
        const match = error.message?.match(/\d+:\s*(.+)/);
        if (match) {
          const parsed = JSON.parse(match[1]);
          errorMessage = parsed.message || errorMessage;
        }
      } catch { }

      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      if (error.message?.includes('409') || errorMessage.toLowerCase().includes('already exists')) {
        setAuthTab('signin');
        resetForms();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignupOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    try {
      const res = await apiRequest('POST', '/api/auth/verify-otp', { email, otp, purpose: 'signup' });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Invalid OTP code');
      }

      setSignupStep('details');
      toast({
        title: 'Email Verified',
        description: 'Now complete your account setup',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Invalid OTP code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest('PATCH', '/api/user/profile', { name });

      await apiRequest('POST', '/api/auth/set-password', {
        name: name,
        password: newPassword,
        confirmPassword: confirmPassword,
      });

      const pendingCode = localStorage.getItem('pendingReferralCode');
      if (pendingCode) {
        try {
          await apiRequest('POST', '/api/referrals/signup', {
            code: pendingCode,
          });

          localStorage.removeItem('pendingReferralCode');
        } catch (refError) {
          console.log('referror', refError);
        }
      }

      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });

      toast({
        title: 'Account Created',
        description: 'Your account is ready!',
      });

      setLocation('/account/profile');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete signup',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/auth/forgot-password', { email });
      setForgotStep('reset');
      toast({
        title: 'Reset Code Sent',
        description: 'If an account exists, a reset code has been sent to your email.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/auth/reset-password', {
        email,
        otp,
        newPassword,
        confirmPassword,
      });

      toast({
        title: 'Password Reset',
        description: 'Your password has been reset. You can now login.',
      });

      setShowForgotPassword(false);
      resetForms();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const platformBenefits = [
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Access mobile data in 190+ countries worldwide',
    },
    {
      icon: Zap,
      title: 'Instant Activation',
      description: 'Get connected in seconds with QR code setup',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security for your data',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Our team is always here to help you',
    },
  ];

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const idToken = await result.user.getIdToken();

      await apiRequest("POST", "/api/auth/web/login-with-google", {
        idToken,
        referralCode: localStorage.getItem("pendingReferralCode"),
      });

      window.location.href = "/account/profile";
    } catch (err) {
      console.error("Google login error", err);
      toast({
        title: "Error",
        description: "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Side - Platform Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-white border-r border-border p-16 flex-col justify-between relative overflow-hidden dark:bg-zinc-950">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-20 left-20 w-[500px] h-[500px] rounded-full bg-primary blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-[600px] h-[600px] rounded-full bg-primary blur-[150px]" />
        </div>

        <div className="relative z-10">
          <Link href="/">
            {logo ? (
              <img className="h-12 rounded-xl shadow-sm hover:scale-105 transition-transform" src={logo} alt={siteName || 'Voltey'} />
            ) : (
              <div className="flex items-center gap-3 text-slate-900 dark:text-white cursor-pointer group" data-testid="link-logo">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-3xl tracking-tight text-slate-900 dark:text-white">{siteName || 'Voltey'}</span>
              </div>
            )}
          </Link>
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
              Stay Connected <br /><span className="text-primary">Anywhere</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              Join millions of travelers using Voltey eSIM for seamless, borderless connectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {platformBenefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-5 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center dark:bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <benefit.icon className="h-7 w-7 text-primary group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{benefit.title}</h3>
                  <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
            ))}
          </div>
          <p className="text-slate-500 dark:text-zinc-500 text-sm font-semibold tracking-tight">Trusted by 2M+ travelers worldwide</p>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-0 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-md px-6 py-12 sm:p-0">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10 scale-110">
            <Link href="/">
              <div className="inline-flex items-center gap-3 cursor-pointer" data-testid="link-logo-mobile">
                {logo ? (
                  <img src={logo} alt={siteName || 'Voltey'} className="h-10" />
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
                      Vol<span className="text-primary">tey</span>
                    </span>
                  </>
                )}
              </div>
            </Link>
          </div>

          <Link href="/">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-8 cursor-pointer group" data-testid="link-back-home">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {t('checkout.backToHome', 'Back to Home')}
            </div>
          </Link>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Welcome</h2>
            <p className="text-lg text-muted-foreground mt-2">
              Sign in to your account or create a new one
            </p>
          </div>

          {/* Referral Banner */}
          {showReferralBanner && referralCode && (
            <Alert className="mb-8 border-none bg-primary/10 relative p-5 rounded-2xl animate-in slide-in-from-top-4 duration-300" data-testid="alert-referral-banner">
              <Gift className="h-5 w-5 text-primary" />
              <AlertDescription className="pr-10 text-base font-semibold text-primary">
                {t('referrals.youveBeenReferred', { discount: settings?.referredUserDiscount || 0 })}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
                  onClick={() => { setShowReferralBanner(false); localStorage.removeItem('pendingReferralCode'); }}
                  data-testid="button-dismiss-referral"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={authTab} onValueChange={(v) => { setAuthTab(v as any); resetForms(); }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-muted/50 p-1.5 rounded-2xl">
              <TabsTrigger value="signin" className="text-base font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-signin">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-base font-bold rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm" data-testid="tab-signup">
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-0">
              {!showForgotPassword ? (
                <div className="space-y-6">
                  <form onSubmit={handlePasswordLogin} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email-signin" className="text-sm font-bold ml-1">Email</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="email-signin"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 h-14 text-base rounded-2xl border-gray-200 focus:ring-primary/20 transition-all"
                            autoComplete="email"
                            required
                            data-testid="input-email-signin"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="password-signin" className="text-sm font-bold ml-1">Password</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                          <Input
                            id="password-signin"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-12 pr-12 h-14 text-base rounded-2xl border-gray-200 focus:ring-primary/20 transition-all"
                            autoComplete="current-password"
                            required
                            data-testid="input-password-signin"
                          />
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary p-2 transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        <div className="text-right">
                          <button
                            type="button"
                            className="text-sm text-primary font-bold hover:underline py-1"
                            onClick={() => setShowForgotPassword(true)}
                            data-testid="link-forgot-password"
                          >
                            Forgot password?
                          </button>
                        </div>
                      </div>
                    </div>

                    {isCaptchaEnabled && VITE_RECAPTCHA_SITE_KEY && (
                      <div className="flex justify-center py-2 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50/50">
                        <ReCAPTCHA ref={recaptchaRef} sitekey={VITE_RECAPTCHA_SITE_KEY} onChange={(token) => setCaptchaToken(token)} />
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-14 text-lg font-bold gradient-primary rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all"
                      disabled={isLoading}
                      data-testid="button-signin"
                    >
                      {isLoading ? <Loader2 className="animate-spin h-6 w-6" /> : 'Sign In'}
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  {forgotStep === 'email' ? (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div className="space-y-2">
                        <label htmlFor="email-forgot" className="text-sm font-bold ml-1">Email</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input
                            id="email-forgot"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-12 h-14 text-base rounded-2xl border-gray-200"
                            required
                            data-testid="input-email-forgot"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-14 text-lg font-bold gradient-primary rounded-2xl" disabled={isLoading} data-testid="button-forgot-submit">
                        {isLoading ? 'Sending...' : 'Send Reset Code'}
                      </Button>
                      <button type="button" className="w-full text-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors" onClick={() => setShowForgotPassword(false)}>
                        Back to Login
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-6">
                      <Input
                        id="reset-otp"
                        type="text"
                        placeholder="6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="h-14 text-center text-2xl tracking-[0.5em] font-bold rounded-2xl"
                        required
                      />
                      <Button type="submit" className="w-full h-14 text-lg font-bold gradient-primary rounded-2xl" disabled={isLoading}>
                        Reset Password
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="signup" className="mt-0">
              {signupStep === 'email' && (
                <form onSubmit={handleSendSignupOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email-signup" className="text-sm font-bold ml-1">Email</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 text-base rounded-2xl border-gray-200"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg font-bold gradient-primary rounded-2xl" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Continue'}
                  </Button>
                </form>
              )}
              {signupStep === 'otp' && (
                <form onSubmit={handleVerifySignupOTP} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="otp-signup" className="text-sm font-bold ml-1">Verification Code</label>
                    <Input
                      id="otp-signup"
                      type="text"
                      placeholder="6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="h-14 text-center text-2xl tracking-[0.5em] font-bold rounded-2xl"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg font-bold gradient-primary rounded-2xl" disabled={isLoading}>
                    {isLoading ? 'Verifying...' : 'Verify Email'}
                  </Button>
                </form>
              )}
              {signupStep === 'details' && (
                <form onSubmit={handleCompleteSignup} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name-signup" className="text-sm font-bold ml-1">Full Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="name-signup"
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-12 h-14 text-base rounded-2xl border-gray-200"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password-signup" className="text-sm font-bold ml-1">Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="password-signup"
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Min 8 characters"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-12 pr-12 h-14 text-base rounded-2xl border-gray-200"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-14 text-lg font-bold gradient-primary rounded-2xl" disabled={isLoading}>
                    Create Account
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-muted-foreground uppercase font-extrabold tracking-widest">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-14 text-base font-bold rounded-2xl border-2 hover:bg-gray-50 active:scale-[0.98] transition-all"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-6 w-6 mr-3" alt="Google" />
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-10 leading-relaxed max-w-[280px] mx-auto">
            By continuing, you agree to our <br />
            <Link href="/pages/terms-and-condition"><span className="text-primary font-bold hover:underline cursor-pointer">Terms</span></Link> and <Link href="/pages/privacy-policy"><span className="text-primary font-bold hover:underline cursor-pointer">Privacy Policy</span></Link>
          </p>
        </div>
      </div>
    </div>
  );
}
