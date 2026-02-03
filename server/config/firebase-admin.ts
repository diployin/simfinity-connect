import admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';
import { getMessaging } from 'firebase-admin/messaging';

import serviceAccount from './service-account.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
  });
}

export const adminDb = getDatabase();
export const adminMessaging = getMessaging();
export default admin;
