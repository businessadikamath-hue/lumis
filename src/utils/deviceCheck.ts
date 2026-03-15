import { supabase } from '../lib/supabase';
import { db } from '../db/db';

export type AppRoute = '/welcome' | '/onboarding' | '/home' | '/checkin';

export const checkDeviceAndAuth = async (): Promise<AppRoute> => {
  // If there's a pending verification, don't interrupt it
  const pendingEmail = localStorage.getItem('lumis_pending_email');
  if (pendingEmail) return '/welcome';

  // Step 1: Check for existing device ID
  let deviceId = localStorage.getItem('lumis_device_id');

  if (!deviceId) {
    // Brand new device — generate and store a permanent UUID
    deviceId = crypto.randomUUID();
    localStorage.setItem('lumis_device_id', deviceId);
    // Always send new devices to welcome screen
    return '/welcome';
  }

  // Step 2: Device is known — check for an active Supabase auth session
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    // Device is known but session expired or was signed out — go to welcome
    return '/welcome';
  }

  // Step 3: Authenticated — check if this is a newly trusted device
  const isTrusted = localStorage.getItem('lumis_device_trusted');
  if (!isTrusted) {
    // User is logged in but this device hasn't been verified yet
    localStorage.setItem('lumis_verify_reason', 'new_device');
    return '/welcome';
  }

  // Step 4: Known device, active session, trusted — route into the app
  const onboarded = localStorage.getItem('lumis_onboarded');
  if (!onboarded) return '/onboarding';

  // Check if today's entry already exists
  const today = new Date().toISOString().split('T')[0];
  const todayEntry = await db.entries.where('date').equals(today).first();
  
  return todayEntry ? '/home' : '/checkin';
};
