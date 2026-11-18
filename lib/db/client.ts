'use client'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

function createStubClient() {
  const stubQuery: any = {
    select: () => stubQuery,
    insert: () => stubQuery,
    update: () => stubQuery,
    delete: () => stubQuery,
    eq: () => stubQuery,
    neq: () => stubQuery,
    gt: () => stubQuery,
    gte: () => stubQuery,
    lt: () => stubQuery,
    lte: () => stubQuery,
    like: () => stubQuery,
    ilike: () => stubQuery,
    is: () => stubQuery,
    in: () => stubQuery,
    contains: () => stubQuery,
    containedBy: () => stubQuery,
    range: () => stubQuery,
    order: () => stubQuery,
    limit: () => stubQuery,
    not: () => stubQuery,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (resolve: any) => Promise.resolve({ data: [], error: null, count: 0 }).then(resolve),
    catch: (reject: any) => Promise.resolve({ data: [], error: null, count: 0 }).catch(reject),
  }

  const stubAuth: any = {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithOAuth: async () => ({ data: null, error: new Error('Supabase is not configured.') }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  }

  return {
    auth: stubAuth,
    from: () => stubQuery,
    channel: () => ({ on: () => ({ subscribe: () => {} }), subscribe: () => {} }),
    removeChannel: () => {},
  } as any
}

if (!isSupabaseConfigured) {
  if (typeof window !== 'undefined') {
    console.info('[Supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Running in guest/local mode.')
  }
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createStubClient()
