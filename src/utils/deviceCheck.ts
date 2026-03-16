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

  // Step 3: Authenticated — bypass device trust (returning users with passwords are trusted)
  localStorage.setItem('lumis_device_trusted', 'true');

  // Step 4: Known device, active session, trusted — route into the app
  const onboarded = localStorage.getItem('lumis_onboarded');
  if (!onboarded) return '/onboarding';

  // Landing page is now always Home.
  return '/home';
};
