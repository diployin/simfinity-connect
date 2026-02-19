'use strict';

import { Router, type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import { storage } from '../storage';
import { asyncHandler } from '../lib/asyncHandler';
import { ValidationError, NotFoundError } from '../lib/errors';
import { logger } from '../lib/logger';
import { sendEmail, generateOTPEmail, generateWelcomeEmail } from '../email';
import { generateToken } from 'server/utils/auth';
import { requireAuth, requireAdmin } from 'server/middleware/auth';
import * as ApiResponse from '../utils/response';

const router = Router();
const BCRYPT_ROUNDS = 12;

function generateOTP(): string {
  if (process.env.NODE_ENV === 'development') {
    return '123456';
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  return { valid: true };
}

router.post('/send-otp', async (req: Request, res: Response) => {
  try {
    const { email, purpose = 'login' } = req.body;
    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    if (purpose === 'signup') {
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return ApiResponse.conflict(res, 'Account already exists. Please sign in.');
      }
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await storage.createOTP({ email, code, expiresAt, verified: false, purpose });
    console.log(
      `Generated OTP for ${email}: ${code} (purpose: ${purpose}, expires at ${expiresAt.toISOString()})`,
    );

    const emailContent = await generateOTPEmail(code);
    await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return ApiResponse.success(res, `OTP sent successfully ${code}`, { email });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/app/send-otp', async (req: Request, res: Response) => {
  try {
    const { email, purpose = 'login' } = req.body;

    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    /* ---------------------------------
       CHECK USER EXISTS
    ---------------------------------- */
    const existingUser = await storage.getUserByEmail(email);

    // ✅ User exists AND password is already set → DO NOT send OTP
    if (existingUser?.hashedPassword != null) {
      return ApiResponse.success(res, 'User password already set', {
        email,
        is_password_set: true,
      });
    }

    /* ---------------------------------
       PASSWORD NOT SET → SEND OTP
    ---------------------------------- */
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    console.log('🔥 BEFORE CREATE OTP');

    const otpRecord = await storage.createOTP({
      email,
      code,
      expiresAt,
      verified: false,
      purpose,
    });

    console.log('🔥 AFTER CREATE OTP', otpRecord);

    console.log(
      `Generated OTP for ${email}: ${code} (purpose: ${purpose}, expires at ${expiresAt.toISOString()})`,
    );

    const emailContent = await generateOTPEmail(code);

    await sendEmail({
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return ApiResponse.success(res, `OTP sent successfully ${code}`, {
      email,
      is_password_set: false,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/app/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    if (!otp) {
      return ApiResponse.badRequest(res, 'OTP is required');
    }

    const isValid = await storage.verifyOTP(email, otp);

    if (!isValid) {
      // ❌ OTP invalid or expired
      return ApiResponse.success(res, 'Invalid or expired OTP', {
        success: false,
      });
    }

    let user = await storage.getUserByEmail(email);

    if (!user) {
      user = await storage.createUser({
        email,
        kycStatus: 'pending',
      });
    }

    // ✅ OTP matched
    return ApiResponse.success(res, 'OTP verified successfully', {
      success: true,
      userId: user?.id,
    });
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const {
      email,
      otp,
      purpose,
      isFromGoogle = false,
      fcmToken,
      imagePath,
      deviceid,
      deviceType,
      deviceModel,
      appVersion,
      deviceManufacturer,
      deviceLocation,
      name,
    } = req.body;

    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    if (!isFromGoogle) {
      if (!otp) {
        return ApiResponse.badRequest(res, 'OTP is required');
      }

      const isValid = await storage.verifyOTP(email, otp, purpose);
      if (!isValid) {
        return ApiResponse.badRequest(res, 'Invalid or expired OTP');
      }
    }

    let user = await storage.getUserByEmail(email);

    if (!user) {
      user = await storage.createUser({
        email,
        name: name ?? null,
        imagePath: imagePath ?? null,
        isFromGoogle,
        kycStatus: 'pending',
      });

      const welcomeEmail = await generateWelcomeEmail(user.name || 'Traveler', email);
      await sendEmail({
        to: email,
        subject: welcomeEmail.subject,
        html: welcomeEmail.html,
      });

      await storage.createNotification({
        userId: user.id,
        type: 'welcome',
        title: 'Welcome message coming up as simfinity!',
        message: 'Thank you for joining us. Start browsing destinations to get your first eSIM.',
        read: false,
      });
    } else {
      await storage.updateUser(user.id, {
        ...(name && { name }),
        ...(imagePath && { imagePath }),
        ...(fcmToken && { fcmToken }),
        ...(deviceid && { deviceid }),
        ...(deviceType && { deviceType }),
        ...(deviceModel && { deviceModel }),
        ...(appVersion && { appVersion }),
        ...(deviceManufacturer && { deviceManufacturer }),
        ...(deviceLocation && { deviceLocation }),
        ...(typeof isFromGoogle === 'boolean' && { isFromGoogle }),
      });
    }

    req.session.userId = user.id;
    // console.log("User logged in or registered with ID:", user.id, req.session.userId);
    const token = generateToken(user);

    return ApiResponse.success(res, 'User logged in successfully', {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
      passwordSet: !!user.hashedPassword,
    });
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/check-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    const user = await storage.getUserByEmail(email);

    return ApiResponse.success(res, 'Email check completed', {
      exists: !!user,
      passwordSet: user ? !!user.hashedPassword : false,
    });
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/login-password', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.badRequest(res, 'Email and password are required');
    }

    const user = await storage.getUserByEmail(email);

    if (!user) {
      return ApiResponse.badRequest(res, 'Invalid email or password');
    }

    // ✅ NEW CHECK — isDeleted
    if (user.isDeleted) {
      return ApiResponse.badRequest(
        res,
        'Your account has been deleted or deactivated. Please contact support.'
      );
    }

    if (!user.hashedPassword) {
      return ApiResponse.badRequest(res, 'Password not set. Please login with OTP first.');
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isValid) {
      return ApiResponse.badRequest(res, 'Invalid email or password');
    }



    await storage.updateUser(user.id, {
      lastPasswordLoginAt: new Date(),
    });

    req.session.userId = user.id;
    const token = generateToken(user);

    logger.info('User logged in with password', { userId: user.id, email: user.email });

    return ApiResponse.success(res, 'Login successful', {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
      passwordSet: true,
    });
  } catch (error: any) {
    logger.error('Password login error', { error: error.message });
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/app/login-password', async (req, res) => {
  try {
    const {
      email,
      password,
      isFromGoogle = false,
      fcmToken,
      imagePath,
      deviceid,
      deviceType,
      deviceModel,
      appVersion,
      deviceManufacturer,
      deviceLocation,
    } = req.body;

    if (!email || !password) {
      return ApiResponse.badRequest(res, 'Email and password are required');
    }

    const user = await storage.getUserByEmail(email);
    if (!user || !user.hashedPassword) {
      return ApiResponse.badRequest(res, 'Invalid email or password');
    }


    // ✅ NEW CHECK — isDeleted
    if (user.isDeleted) {
      return ApiResponse.badRequest(
        res,
        'Your account has been deleted or deactivated. Please contact support.'
      );
    }

    const isValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isValid) {
      return ApiResponse.badRequest(res, 'Invalid email or password');
    }

    await storage.updateUser(user.id, {
      lastPasswordLoginAt: new Date(),
      ...(typeof isFromGoogle === 'boolean' && { isFromGoogle }),
      ...(fcmToken && { fcmToken }),
      ...(imagePath && { imagePath }),
      ...(deviceid && { deviceid }),
      ...(deviceType && { deviceType }),
      ...(deviceModel && { deviceModel }),
      ...(appVersion && { appVersion }),
      ...(deviceManufacturer && { deviceManufacturer }),
      ...(deviceLocation && { deviceLocation }),
    });

    const token = generateToken({ id: user.id, email: user.email });

    return ApiResponse.success(res, 'Login successful', {
      id: user.id,
      email: user.email,
      token,
      passwordSet: true,
    });
  } catch (err: any) {
    return ApiResponse.serverError(res, err.message);
  }
});

router.post('/set-password', requireAuth, async (req: any, res: Response) => {
  try {
    const { password, confirmPassword, name } = req.body;
    const userId = req.userId;

    console.log('password:', password, 'confirmPassword:', confirmPassword);
    // if (!password || !confirmPassword) {
    //   return ApiResponse.badRequest(res, "Password and confirmation are required");
    // }

    if (password !== confirmPassword) {
      return ApiResponse.badRequest(res, 'Passwords do not match');
    }

    const validation = validatePassword(password);
    if (!validation.valid) {
      return ApiResponse.badRequest(res, validation.message || 'Invalid password');
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    if (user.hashedPassword) {
      return ApiResponse.badRequest(res, 'Password already set. Use change password instead.');
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await storage.updateUser(userId, {
      hashedPassword,
      passwordSetAt: new Date(),
      name
    });

    logger.info('Password set for user', { userId });

    return ApiResponse.success(res, 'Password set successfully');
  } catch (error: any) {
    logger.error('Set password error', { error: error.message });
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/app/set-password', async (req: any, res: Response) => {
  try {
    const { password, confirmPassword } = req.body;
    const { userId } = req.body;

    console.log('password:', password, 'confirmPassword:', confirmPassword);
    // if (!password || !confirmPassword) {
    //   return ApiResponse.badRequest(res, "Password and confirmation are required");
    // }

    if (password !== confirmPassword) {
      return ApiResponse.badRequest(res, 'Passwords do not match');
    }

    const validation = validatePassword(password);
    if (!validation.valid) {
      return ApiResponse.badRequest(res, validation.message || 'Invalid password');
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    if (user.hashedPassword) {
      return ApiResponse.badRequest(res, 'Password already set. Use change password instead.');
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);

    await storage.updateUser(userId, {
      hashedPassword,
      passwordSetAt: new Date(),
    });

    logger.info('Password set for user', { userId });

    return ApiResponse.success(res, 'Password set successfully');
  } catch (error: any) {
    logger.error('Set password error', { error: error.message });
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/change-password', requireAuth, async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.userId;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return ApiResponse.badRequest(res, 'All fields are required');
    }

    if (newPassword !== confirmPassword) {
      return ApiResponse.badRequest(res, 'New passwords do not match');
    }

    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      return ApiResponse.badRequest(res, validation.message || 'Invalid password');
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    if (!user.hashedPassword) {
      return ApiResponse.badRequest(res, 'No password set. Use set password instead.');
    }

    const isValid = await bcrypt.compare(currentPassword, user.hashedPassword);
    if (!isValid) {
      return ApiResponse.badRequest(res, 'Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await storage.updateUser(userId, {
      hashedPassword,
      passwordSetAt: new Date(),
    });

    logger.info('Password changed for user', { userId });

    return ApiResponse.success(res, 'Password changed successfully');
  } catch (error: any) {
    logger.error('Change password error', { error: error.message });
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/forgot-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    const user = await storage.getUserByEmail(email);

    // if (!user) {
    //   return ApiResponse.success(res, "If an account exists, a reset code has been sent", { email });
    // }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await storage.createOTP({ email, code, expiresAt, verified: false, purpose: 'password_reset' });

    const emailContent = await generateOTPEmail(code);
    await sendEmail({
      to: email,
      subject: 'Password Reset Code - Simfinity',
      html: emailContent.html.replace('verification code', 'password reset code'),
    });

    logger.info('Password reset OTP sent', { email });

    return ApiResponse.success(res, `If an account exists, a reset code has been sent ${code}`, {
      email,
    });
  } catch (error: any) {
    logger.error('Forgot password error', { error: error.message });
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return ApiResponse.badRequest(res, 'All fields are required');
    }

    if (newPassword !== confirmPassword) {
      return ApiResponse.badRequest(res, 'Passwords do not match');
    }

    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      return ApiResponse.badRequest(res, validation.message || 'Invalid password');
    }

    const isValid = await storage.verifyOTP(email, otp, 'password_reset');
    if (!isValid) {
      return ApiResponse.badRequest(res, 'Invalid or expired reset code');
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return ApiResponse.badRequest(res, 'Invalid or expired reset code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

    await storage.updateUser(user.id, {
      hashedPassword,
      passwordSetAt: new Date(),
    });

    logger.info('Password reset for user', { userId: user.id, email });

    return ApiResponse.success(
      res,
      'Password reset successfully. You can now login with your new password.',
    );
  } catch (error: any) {
    logger.error('Reset password error', { error: error.message });
    return ApiResponse.serverError(res, error.message);
  }
});

router.get('/admin/me', requireAdmin, async (req: Request, res: Response) => {
  try {
    console.log('Fetching user with ID:', req.session);
    const admin = await storage.getAdminById(req.session.adminId!);
    if (!admin) {
      return ApiResponse.notFound(res, 'Admin not found');
    }
    const { password, ...user } = admin;
    return ApiResponse.success(res, 'Admin fetched successfully', user);
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.get('/me', requireAuth, async (req: any, res: Response) => {
  try {
    const userId = req.userId;

    const user = await storage.getUserWithDestinationsAndCurrency(userId);
    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    const unreadNotificationCount = await storage.getUnreadNotificationCount(userId);

    return ApiResponse.success(res, 'User fetched successfully', {
      ...user,
      unreadNotificationCount,
    });
  } catch (error: any) {
    return ApiResponse.serverError(res, error.message);
  }
});

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    return ApiResponse.success(res, 'Logged out successfully');
  });
});

router.post('/app/login-with-google', async (req: Request, res: Response) => {
  try {
    const {
      email,
      fcmToken,
      imagePath,
      deviceid,
      deviceType,
      deviceModel,
      appVersion,
      deviceManufacturer,
      deviceLocation,
    } = req.body;

    if (!email) {
      return ApiResponse.badRequest(res, 'Email is required');
    }

    let user = await storage.getUserByEmail(email);

    /* -----------------------------------
       CREATE USER IF NOT EXISTS
    ----------------------------------- */
    if (!user) {
      user = await storage.createUser({
        email,
        kycStatus: 'pending',
        isFromGoogle: true,
        imagePath,
        fcmToken,
        deviceid,
        deviceType,
        deviceModel,
        appVersion,
        deviceManufacturer,
        deviceLocation,
      });
    } else {
      /* -----------------------------------
       UPDATE USER IF EXISTS
    ----------------------------------- */
      await storage.updateUser(user.id, {
        lastGoogleLoginAt: new Date(),
        isFromGoogle: true,
        ...(fcmToken && { fcmToken }),
        ...(imagePath && { imagePath }),
        ...(deviceid && { deviceid }),
        ...(deviceType && { deviceType }),
        ...(deviceModel && { deviceModel }),
        ...(appVersion && { appVersion }),
        ...(deviceManufacturer && { deviceManufacturer }),
        ...(deviceLocation && { deviceLocation }),
      });
    }

    /* -----------------------------------
       GENERATE TOKEN
    ----------------------------------- */
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    return ApiResponse.success(res, 'Login successful', {
      id: user.id,
      email: user.email,
      token,
      passwordSet: Boolean(user.hashedPassword),
    });
  } catch (err: any) {
    return ApiResponse.serverError(res, err.message);
  }
});

export default router;
