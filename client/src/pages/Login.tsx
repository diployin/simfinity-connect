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

  const logo = useSettingByKey('white_logo');
  const siteName = useSettingByKey('platform_name');

  const { data: settings } = useQuery<ReferralSettings>({
    queryKey: ['/api/admin/referrals/settings'],
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
      });

      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });

      // Clear form
      setEmail('');
      setPassword('');

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
      await apiRequest('POST', '/api/auth/send-otp', { email, purpose: 'login' });
      setSignupStep('otp');
      toast({
        title: t('checkout.otpSent', 'OTP Sent'),
        description: t('checkout.checkEmail', 'Check your email for the verification code.'),
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send OTP',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySignupOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;

    setIsLoading(true);
    try {
      const res = await apiRequest('POST', '/api/auth/verify-otp', { email, otp });

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
            {logo ? (
              <img className="h-16 rounded-lg" src={logo} />
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
            <h1 className="text-4xl font-bold text-white mb-4">Stay Connected Anywhere</h1>
            <p className="text-xl text-white/80">
              Join millions of travelers using eSIM for seamless connectivity
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
          <p className="text-white/60 text-sm">Trusted by 2M+ travelers worldwide</p>
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
                {logo ? (
                  <img src={useSettingByKey('logo')} alt={siteName || 'Simfinity'} className="h-10" />
                ) : (siteName && siteName.toLowerCase() === 'simfinity') || !siteName ? (
                  <>
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#2c7338] to-[#1e5427] flex items-center justify-center">
                      <Globe className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-lg text-gray-900 dark:text-white">
                      Sim
                      <span className="bg-gradient-to-r from-[#2c7338] to-[#3d9a4d] bg-clip-text text-transparent">
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
            <h2 className="text-2xl font-bold text-foreground">Welcome</h2>
            <p className="text-muted-foreground mt-1">
              Sign in to your account or create a new one
            </p>
          </div>

          {/* Referral Banner */}
          {showReferralBanner && referralCode && (
            <Alert
              className="mb-6 border-primary-light bg-[#2c7338]/5 relative"
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
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" data-testid="tab-signup">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Sign In - Password with Forgot Password Flow */}
            <TabsContent value="signin">
              {!showForgotPassword ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Sign In</CardTitle>
                    <CardDescription>Enter your email and password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordLogin} className="space-y-4">
                      <div>
                        <label htmlFor="email-signin" className="text-sm font-medium mb-2 block">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email-signin"
                            type="email"
                            placeholder="you@example.com"
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
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password-signin"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
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
                            Forgot password?
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-primary-gradient hover:bg-primary-gradient "
                        disabled={isLoading}
                        data-testid="button-signin"
                      >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <button
                          type="button"
                          className="text-primary hover:underline font-medium"
                          onClick={() => {
                            setAuthTab('signup');
                            resetForms();
                          }}
                          data-testid="link-goto-signup"
                        >
                          Sign up
                        </button>
                      </p>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {forgotStep === 'email' ? 'Reset Password' : 'Set New Password'}
                    </CardTitle>
                    <CardDescription>
                      {forgotStep === 'email'
                        ? 'Enter your email to receive a reset code'
                        : `Enter the code sent to ${email} and your new password`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {forgotStep === 'email' ? (
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div>
                          <label htmlFor="email-forgot" className="text-sm font-medium mb-2 block">
                            Email
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email-forgot"
                              type="email"
                              placeholder="you@example.com"
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
                          {isLoading ? 'Sending...' : 'Send Reset Code'}
                        </Button>
                        <p className="text-center text-sm text-muted-foreground">
                          Remember your password?{' '}
                          <button
                            type="button"
                            className="text-primary hover:underline font-medium"
                            onClick={() => {
                              setShowForgotPassword(false);
                              resetForms();
                            }}
                            data-testid="link-back-signin"
                          >
                            Sign in
                          </button>
                        </p>
                      </form>
                    ) : (
                      <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                          <label htmlFor="reset-otp" className="text-sm font-medium mb-2 block">
                            Reset Code
                          </label>
                          <Input
                            id="reset-otp"
                            type="text"
                            placeholder="Enter 6-digit code"
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
                            New Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="new-password"
                              type={showNewPassword ? 'text' : 'password'}
                              placeholder="Min 8 characters"
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
                            Confirm Password
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="confirm-password-reset"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your new password"
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
                          {isLoading ? 'Resetting...' : 'Reset Password'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full"
                          onClick={() => setForgotStep('email')}
                          data-testid="button-back-forgot"
                        >
                          Use different email
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
                    {signupStep === 'email' && 'Create Account'}
                    {signupStep === 'otp' && 'Verify Email'}
                    {signupStep === 'details' && 'Complete Setup'}
                  </CardTitle>
                  <CardDescription>
                    {signupStep === 'email' && 'Enter your email to get started'}
                    {signupStep === 'otp' && `Enter the code sent to ${email}`}
                    {signupStep === 'details' && 'Enter your name and create a password'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {signupStep === 'email' && (
                    <form onSubmit={handleSendSignupOTP} className="space-y-4">
                      <div>
                        <label htmlFor="email-signup" className="text-sm font-medium mb-2 block">
                          Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email-signup"
                            type="email"
                            placeholder="you@example.com"
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
                        {isLoading ? 'Sending...' : 'Continue'}
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <button
                          type="button"
                          className="text-primary hover:underline font-medium"
                          onClick={() => {
                            setAuthTab('signin');
                            resetForms();
                          }}
                          data-testid="link-goto-signin"
                        >
                          Sign in
                        </button>
                      </p>
                    </form>
                  )}

                  {signupStep === 'otp' && (
                    <form onSubmit={handleVerifySignupOTP} className="space-y-4">
                      <div>
                        <label htmlFor="otp-signup" className="text-sm font-medium mb-2 block">
                          Verification Code
                        </label>
                        <Input
                          id="otp-signup"
                          type="text"
                          placeholder="Enter 6-digit code"
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
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={() => setSignupStep('email')}
                        data-testid="button-back-signup-email"
                      >
                        Use different email
                      </Button>
                    </form>
                  )}

                  {signupStep === 'details' && (
                    <form onSubmit={handleCompleteSignup} className="space-y-4">
                      <div>
                        <label htmlFor="name-signup" className="text-sm font-medium mb-2 block">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name-signup"
                            type="text"
                            placeholder="John Doe"
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
                          Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password-signup"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Min 8 characters"
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
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirm-password-signup"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
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
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('checkout.termsAgreement', 'By continuing, you agree to our')}{' '}
            <Link href="/pages/terms-and-condition">
              <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
            </Link>{' '}
            and{' '}
            <Link href="/pages/privacy-policy">
              <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
