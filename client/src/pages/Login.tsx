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
import { useTheme } from '@/contexts/ThemeContext';
import ReCAPTCHA from 'react-google-recaptcha';
import React, { useRef } from 'react';
import { signInWithGoogle } from '@/lib/firebase';
import { SettingsState } from '@/redux/slice/settingsSlice';

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

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const { theme } = useTheme();
  const whiteLogo = useSettingByKey('white_logo');
  const normalLogo = useSettingByKey('logo');
  const siteName = useSettingByKey('platform_name');

  const { data: allSettings } = useQuery<SettingsState>({
    queryKey: ['/api/public/settings'],
  });

  const recaptchaEnabled = allSettings?.recaptcha_enabled === 'true';
  const recaptchaSiteKey = allSettings?.recaptcha_site_key;
  const currentLogo = theme === 'dark' ? (whiteLogo || normalLogo) : normalLogo;

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
      await apiRequest('POST', '/api/auth/login-password', {
        email,
        password,
        captchaToken,
      });

      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });

      // Clear form
      setEmail('');
      setPassword('');
      setCaptchaToken(null);
      recaptchaRef.current?.reset();

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

      setCaptchaToken(null);
      recaptchaRef.current?.reset();

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

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const idToken = await user.getIdToken();

      // Get referral code from state or local storage
      const pendingReferralCode = referralCode || localStorage.getItem('pendingReferralCode');

      const response = await apiRequest('POST', '/api/auth/web/login-with-google', {
        idToken,
        referralCode: pendingReferralCode
      });

      const data = await response.json();

      queryClient.setQueryData(['/api/auth/me'], data.data);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });

      // Clean up referral code from local storage
      if (pendingReferralCode) {
        localStorage.removeItem('pendingReferralCode');
      }

      toast({
        title: t('website.login.success', 'Success!'),
        description: t('website.login.redirecting', 'Login successful! Redirecting...'),
      });

      setTimeout(() => {
        window.location.href = '/account/profile';
      }, 1500);

    } catch (error: any) {
      console.error('❌ Google Login error:', error);
      toast({
        title: t('website.login.error', 'Login Error'),
        description: error.message || t('website.login.googleFailed', 'Google login failed. Please try again.'),
        variant: 'destructive',
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
      title: t('website.auth.benefits.globalTitle', 'Global Coverage'),
      description: t('website.auth.benefits.globalDesc', 'Access mobile data in 190+ countries worldwide'),
    },
    {
      icon: Zap,
      title: t('website.auth.benefits.instantTitle', 'Instant Activation'),
      description: t('website.auth.benefits.instantDesc', 'Get connected in seconds with QR code setup'),
    },
    {
      icon: Shield,
      title: t('website.auth.benefits.secureTitle', 'Secure & Reliable'),
      description: t('website.auth.benefits.secureDesc', 'Enterprise-grade security for your data'),
    },
    {
      icon: Clock,
      title: t('website.auth.benefits.supportTitle', '24/7 Support'),
      description: t('website.auth.benefits.supportDesc', 'Our team is always here to help you'),
    },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Platform Benefits */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-light to-primary-dark p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative z-10">
          <Link href="/">
            {whiteLogo || normalLogo ? (
              <img className="h-16 rounded-lg" src={whiteLogo || normalLogo} />
            ) : (
              <div className="flex items-center gap-2 text-white cursor-pointer" data-testid="link-logo">
                <Globe className="h-8 w-8" />
                <span className="font-bold text-2xl">{siteName || 'Simfinity'}</span>
              </div>
            )}
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {t('website.auth.stayConnected', 'Stay Connected Anywhere')}
            </h1>
            <p className="text-xl text-white/80">
              {t('website.auth.stayConnectedDesc', 'Join millions of travelers using eSIM for seamless connectivity')}
            </p>
          </div>

          <div className="space-y-6">
            {platformBenefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{benefit.title}</h3>
                  <p className="text-white/70 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm">
            {t('website.auth.trustedBy', 'Trusted by 2M+ travelers worldwide')}
          </p>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/">
              <div
                className="inline-flex items-center gap-2 cursor-pointer"
                data-testid="link-logo-mobile"
              >
                {currentLogo ? (
                  <img src={currentLogo} alt={siteName || 'Simfinity'} className="h-10" />
                ) : (siteName && siteName.toLowerCase() === 'simfinity') || !siteName ? (
                  <>
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-primary-second flex items-center justify-center">
                      <Globe className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      Sim
                      <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] bg-clip-text text-transparent">
                        finity
                      </span>
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Globe className="h-8 w-8 text-primary" />
                    <span className="font-bold text-2xl">{siteName}</span>
                  </div>
                )}
              </div>
            </Link>
          </div>

          <Link href="/">
            <div
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer"
              data-testid="link-back-home"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('checkout.backToHome', 'Back to Home')}
            </div>
          </Link>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {t('website.auth.loginTitle', 'Welcome')}
            </h2>
            <p className="text-muted-foreground mt-1">
              {t('website.auth.loginSubtitle', 'Sign in to your account or create a new one')}
            </p>
          </div>

          {/* Referral Banner */}
          {showReferralBanner && referralCode && (
            <Alert
              className="mb-6 border-primary-light bg-[var(--primary)]/5 relative"
              data-testid="alert-referral-banner"
            >
              <Gift className="h-4 w-4 text-primary" />
              <AlertDescription className="pr-8">
                <span className="font-semibold text-primary">
                  {t('referrals.youveBeenReferred', {
                    discount: settings?.referredUserDiscount || 0,
                  })}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6 bg-gradient-primary"
                  onClick={() => {
                    setShowReferralBanner(false);
                    localStorage.removeItem('pendingReferralCode');
                  }}
                  data-testid="button-dismiss-referral"
                >
                  <X className="h-4 w-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Tabs
            value={authTab}
            onValueChange={(v) => {
              setAuthTab(v as any);
              resetForms();
            }}
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" data-testid="tab-signin">
                {t('website.auth.signIn', 'Sign In')}
              </TabsTrigger>
              <TabsTrigger value="signup" data-testid="tab-signup">
                {t('website.auth.signUp', 'Sign Up')}
              </TabsTrigger>
            </TabsList>

            {/* Sign In - Password with Forgot Password Flow */}
            <TabsContent value="signin">
              {!showForgotPassword ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{t('website.auth.signIn', 'Sign In')}</CardTitle>
                    <CardDescription>
                      {t('website.auth.enterEmailPassword', 'Enter your email and password')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                      <div>
                        <label htmlFor="email-signin" className="text-sm font-medium mb-2 block">
                          {t('website.auth.email', 'Email')}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email-signin"
                            type="email"
                            placeholder={t('website.auth.placeholderEmail', 'you@example.com')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            autoComplete="email"
                            required
                            data-testid="input-email-signin"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="password-signin" className="text-sm font-medium mb-2 block">
                          {t('website.auth.password', 'Password')}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password-signin"
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('website.auth.placeholderPassword', 'Enter your password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10"
                            autoComplete="current-password"
                            required
                            data-testid="input-password-signin"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <div className="text-right mt-2">
                          <button
                            type="button"
                            className="text-sm text-primary-dark hover:underline font-medium"
                            onClick={() => setShowForgotPassword(true)}
                            data-testid="link-forgot-password"
                          >
                            {t('website.auth.forgotPassword', 'Forgot password?')}
                          </button>
                        </div>
                      </div>

                      {/* ---------------------------------
                         RECAPTCHA
                      ---------------------------------- */}
                      {recaptchaEnabled && recaptchaSiteKey && (
                        <div className="flex justify-center my-4 overflow-hidden rounded-lg border border-border/50">
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={recaptchaSiteKey}
                            onChange={(token) => setCaptchaToken(token)}
                            theme={theme === 'dark' ? 'dark' : 'light'}
                          />
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-primary-gradient hover:bg-primary-gradient "
                        disabled={isLoading || (recaptchaEnabled && !captchaToken)}
                        data-testid="button-signin"
                      >
                        {isLoading
                          ? t('website.auth.signingIn', 'Signing in...')
                          : t('website.auth.signIn', 'Sign In')}
                      </Button>

                      {/* ---------------------------------
                         GOOGLE LOGIN
                      ---------------------------------- */}
                      <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-muted-foreground/20"></div>
                        </div>
                        <span className="relative px-4 text-xs uppercase bg-background text-muted-foreground font-medium">
                          {t('website.auth.orContinueWith', 'Or continue with')}
                        </span>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-muted-foreground/20 hover:bg-muted/10 transition-all duration-300"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        data-testid="button-google-login"
                      >
                        <div className="flex items-center gap-3">
                          <svg width="18" height="18" viewBox="0 0 18 18">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                            <path d="M3.964 10.71a5.41 5.41 0 01-.282-1.71c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                          </svg>
                          <span className="font-medium">
                            {t('website.auth.googleContinue', 'Continue with Google')}
                          </span>
                        </div>
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        {t('website.auth.noAccount', "Don't have an account?")}{' '}
                        <button
                          type="button"
                          className="text-primary hover:underline font-medium"
                          onClick={() => {
                            setAuthTab('signup');
                            resetForms();
                          }}
                          data-testid="link-goto-signup"
                        >
                          {t('website.auth.signUp', 'Sign Up')}
                        </button>
                      </p>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {forgotStep === 'email'
                        ? t('website.auth.resetPassword', 'Reset Password')
                        : t('website.auth.setNewPassword', 'Set New Password')}
                    </CardTitle>
                    <CardDescription>
                      {forgotStep === 'email'
                        ? t('website.auth.enterEmailReset', 'Enter your email to receive a reset code')
                        : t('website.auth.enterCodeSent', 'Enter the code sent to {{email}} and your new password', { email })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {forgotStep === 'email' ? (
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                          <label htmlFor="email-forgot" className="text-sm font-medium mb-2 block">
                            {t('website.auth.email', 'Email')}
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email-forgot"
                              type="email"
                              placeholder={t('website.auth.placeholderEmail', 'you@example.com')}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="pl-10"
                              autoComplete="email"
                              required
                              data-testid="input-email-forgot"
                            />
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-primary-gradient"
                          disabled={isLoading}
                          data-testid="button-forgot-submit"
                        >
                          {isLoading
                            ? t('website.auth.sending', 'Sending...')
                            : t('website.auth.sendResetCode', 'Send Reset Code')}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                          {t('website.auth.rememberPassword', 'Remember your password?')}{' '}
                          <button
                            type="button"
                            className="text-primary hover:underline font-medium"
                            onClick={() => {
                              setShowForgotPassword(false);
                              resetForms();
                            }}
                            data-testid="link-back-signin"
                          >
                            {t('website.auth.signIn', 'Sign In')}
                          </button>
                        </p>
                      </form>
                    ) : (
                      <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                          <label htmlFor="reset-otp" className="text-sm font-medium mb-2 block">
                            {t('website.auth.resetCode', 'Reset Code')}
                          </label>
                          <Input
                            id="reset-otp"
                            type="text"
                            placeholder={t('website.auth.placeholderCode', 'Enter 6-digit code')}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength={6}
                            className="text-center text-lg tracking-widest"
                            autoComplete="one-time-code"
                            required
                            data-testid="input-reset-otp"
                          />
                        </div>
                        <div>
                          <label htmlFor="new-password" className="text-sm font-medium mb-2 block">
                            {t('website.auth.newPassword', 'New Password')}
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="new-password"
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder={t('website.auth.placeholderNewPassword', 'Min 8 characters')}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="pl-10 pr-10"
                              autoComplete="new-password"
                              required
                              data-testid="input-new-password"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              data-testid="button-toggle-new-password"
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="confirm-password-reset"
                            className="text-sm font-medium mb-2 block"
                          >
                            {t('website.auth.confirmPassword', 'Confirm Password')}
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="confirm-password-reset"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder={t('website.auth.placeholderConfirmPassword', 'Confirm your new password')}
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              className="pl-10 pr-10"
                              autoComplete="new-password"
                              required
                              data-testid="input-confirm-password-reset"
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              data-testid="button-toggle-confirm-password-reset"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-primary-gradient"
                          disabled={isLoading}
                          data-testid="button-reset-password"
                        >
                          {isLoading
                            ? t('website.auth.resetting', 'Resetting...')
                            : t('website.auth.resetPassword', 'Reset Password')}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full"
                          onClick={() => setForgotStep('email')}
                          data-testid="button-back-forgot"
                        >
                          {t('website.auth.useDifferentEmail', 'Use different email')}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Sign Up - OTP then Name/Password */}
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>
                    {signupStep === 'email' && t('website.auth.createAccount', 'Create Account')}
                    {signupStep === 'otp' && t('website.auth.verifyEmail', 'Verify Email')}
                    {signupStep === 'details' && t('website.auth.completeSetup', 'Complete Setup')}
                  </CardTitle>
                  <CardDescription>
                    {signupStep === 'email' && t('website.auth.enterEmailStart', 'Enter your email to get started')}
                    {signupStep === 'otp' && t('website.auth.enterCodeSent', 'Enter the code sent to {{email}}', { email })}
                    {signupStep === 'details' && t('website.auth.enterDetails', 'Enter your name and create a password')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {signupStep === 'email' && (
                    <form onSubmit={handleSendSignupOTP} className="space-y-4">
                      <div>
                        <label htmlFor="email-signup" className="text-sm font-medium mb-2 block">
                          {t('website.auth.email', 'Email')}
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email-signup"
                            type="email"
                            placeholder={t('website.auth.placeholderEmail', 'you@example.com')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10"
                            autoComplete="email"
                            required
                            data-testid="input-email-signup"
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary-gradient"
                        disabled={isLoading}
                        data-testid="button-send-signup-otp"
                      >
                        {isLoading
                          ? t('website.auth.sending', 'Sending...')
                          : t('website.auth.continue', 'Continue')}
                      </Button>

                      <div className="relative my-6 text-center">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-muted-foreground/20"></div>
                        </div>
                        <span className="relative px-4 text-xs uppercase bg-background text-muted-foreground font-medium">
                          {t('website.auth.orContinueWith', 'Or continue with')}
                        </span>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-muted-foreground/20 hover:bg-muted/10 transition-all duration-300"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        data-testid="button-google-signup"
                      >
                        <div className="flex items-center gap-3">
                          <svg width="18" height="18" viewBox="0 0 18 18">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                            <path d="M3.964 10.71a5.41 5.41 0 01-.282-1.71c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.443 2.048.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
                          </svg>
                          <span className="font-medium">
                            {t('website.auth.googleContinue', 'Continue with Google')}
                          </span>
                        </div>
                      </Button>

                      <p className="text-center text-sm text-muted-foreground">
                        {t('website.auth.alreadyHaveAccount', 'Already have an account?')}{' '}
                        <button
                          type="button"
                          className="text-primary hover:underline font-medium"
                          onClick={() => {
                            setAuthTab('signin');
                            resetForms();
                          }}
                          data-testid="link-goto-signin"
                        >
                          {t('website.auth.signIn', 'Sign In')}
                        </button>
                      </p>
                    </form>
                  )}

                  {signupStep === 'otp' && (
                    <form onSubmit={handleVerifySignupOTP} className="space-y-4">
                      <div>
                        <label htmlFor="otp-signup" className="text-sm font-medium mb-2 block">
                          {t('website.auth.verificationCode', 'Verification Code')}
                        </label>
                        <Input
                          id="otp-signup"
                          type="text"
                          placeholder={t('website.auth.placeholderCode', 'Enter 6-digit code')}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          maxLength={6}
                          className="text-center text-lg tracking-widest"
                          autoComplete="one-time-code"
                          required
                          data-testid="input-otp-signup"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary-gradient"
                        disabled={isLoading}
                        data-testid="button-verify-signup-otp"
                      >
                        {isLoading
                          ? t('website.auth.verifying', 'Verifying...')
                          : t('website.auth.verifyEmail', 'Verify Email')}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setSignupStep('email')}
                        data-testid="button-back-signup-email"
                      >
                        {t('website.auth.useDifferentEmail', 'Use different email')}
                      </Button>
                    </form>
                  )}

                  {signupStep === 'details' && (
                    <form onSubmit={handleCompleteSignup} className="space-y-4">
                      <div>
                        <label htmlFor="name-signup" className="text-sm font-medium mb-2 block">
                          {t('website.auth.fullName', 'Full Name')}
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name-signup"
                            type="text"
                            placeholder={t('website.auth.placeholderName', 'John Doe')}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="pl-10"
                            autoComplete="name"
                            required
                            data-testid="input-name-signup"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="password-signup" className="text-sm font-medium mb-2 block">
                          {t('website.auth.password', 'Password')}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password-signup"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder={t('website.auth.placeholderNewPassword', 'Min 8 characters')}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="pl-10 pr-10"
                            autoComplete="new-password"
                            required
                            data-testid="input-password-signup"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            data-testid="button-toggle-password-signup"
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="confirm-password-signup"
                          className="text-sm font-medium mb-2 block"
                        >
                          {t('website.auth.confirmPassword', 'Confirm Password')}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password-signup"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder={t('website.auth.placeholderConfirmPassword', 'Confirm your password')}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="pl-10 pr-10"
                            autoComplete="new-password"
                            required
                            data-testid="input-confirm-password-signup"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            data-testid="button-toggle-confirm-password"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary-gradient"
                        disabled={isLoading}
                        data-testid="button-complete-signup"
                      >
                        {isLoading
                          ? t('website.auth.creatingAccount', 'Creating Account...')
                          : t('website.auth.createAccount', 'Create Account')}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('website.auth.termsAgreement', 'By continuing, you agree to our')}{' '}
            <Link href="/pages/terms-and-condition">
              <span className="text-primary hover:underline cursor-pointer">
                {t('website.auth.terms', 'Terms of Service')}
              </span>
            </Link>{' '}
            {t('website.auth.and', 'and')}{' '}
            <Link href="/pages/privacy-policy">
              <span className="text-primary hover:underline cursor-pointer">
                {t('website.auth.privacy', 'Privacy Policy')}
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
