// This is a SHIM to replace the Supabase client.
// The Supabase library has been removed.
// TODO: Refactor all usages of this client to use the new backend API (src/lib/api.ts).

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
    signInWithPassword: async () => ({ error: { message: "Supabase removed. Use new backend." } }),
    signUp: async () => ({ error: { message: "Supabase removed. Use new backend." } }),
    signOut: async () => { },
    getUser: async () => ({ data: { user: null } }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        maybeSingle: async () => ({ data: null, error: null }),
      }),
      order: () => ({ data: [], error: null }),
      limit: () => ({ data: [], error: null }),
      then: (cb: any) => cb({ data: [], error: null }), // approximate promise
    }),
    insert: async () => ({ error: null }),
    update: () => ({ eq: async () => ({ error: null }) }),
    delete: () => ({ eq: async () => ({ error: null }) }),
    upsert: async () => ({ error: null }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: "Storage removed" }),
      getPublicUrl: () => ({ data: { publicUrl: "" } }),
    }),
  },
  functions: {
    invoke: async () => ({ data: null, error: "Edge Functions removed" }),
  }
};