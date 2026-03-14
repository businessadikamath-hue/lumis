import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import webpush from 'https://esm.sh/web-push'

const VAPID_PUBLIC_KEY = Deno.env.get('VAPID_PUBLIC_KEY')
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')

webpush.setVapidDetails(
  'mailto:support@lumis.app',
  VAPID_PUBLIC_KEY!,
  VAPID_PRIVATE_KEY!
)

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { data: subs } = await supabase.from('push_subscriptions').select('subscription')

  for (const sub of subs || []) {
    try {
      await webpush.sendNotification(
        sub.subscription,
        JSON.stringify({ title: 'Time for your Lumis check-in', body: 'How is your mind feeling today?' })
      )
    } catch (e) {
      console.error('Push error:', e)
    }
  }

  return new Response("OK")
})