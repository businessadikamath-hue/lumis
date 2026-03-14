import { supabase } from '../lib/supabase';

export const sendDeviceVerificationCode = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    }
  });
  
  if (error) {
    console.error('Error sending verification code:', error.message);
    throw error;
  }
};