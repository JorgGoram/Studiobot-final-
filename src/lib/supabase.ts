
import { createClient } from '@supabase/supabase-js';
import type { UserProfile } from '../types/UserProfile';
import type {
  OptionalPreferenceType,
  OptionalPreferenceInput,
} from '../types/OptionalPreference';
import type { PhoneNumber } from '../types/PhoneNumber';
import type { Action } from '../types/Action';
import api from '../api/axiosConfig';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client with enhanced configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage, // Explicitly set storage to localStorage
    storageKey: 'supabase.auth.token', // Explicitly set the storage key
  },
  global: {
    headers: {
      'X-Client-Info': 'studiobots-web',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Enhanced session management with retry logic
export const getSession = async (retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      // If no session but we have a refresh token, try to refresh
      if (!session && localStorage.getItem('supabase.auth.refreshToken')) {
        const { data: refreshData, error: refreshError } =
          await supabase.auth.refreshSession();
        if (refreshError) throw refreshError;
        return refreshData.session;
      }

      return session;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return null;
};

// Enhanced error handling for database operations
const handleDatabaseError = (error: any, operation: string) => {
  console.error(`Database error during ${operation}:`, error);
  if (error.code === 'PGRST116') return null;
  if (error.code === '23505') throw new Error('Duplicate entry found');
  if (error.code === '23503') throw new Error('Referenced record not found');
  throw error;
};

// Actions CRUD functions with enhanced error handling
export async function createAction(
  action: Omit<Action, 'id' | 'created_at' | 'user_id'>
): Promise<Action> {
  try {
    const session = await getSession();
    if (!session?.user)
      throw new Error('User must be authenticated to create an action');

    const { data } = await api.post("/action", { action: action });
    return data;
  } catch (error: any) {
    handleDatabaseError(error, 'createAction');
    throw new Error(`Error: ${error.message}`);
  }
}

export async function getActionById(id: number): Promise<Action | null> {
  try {
    const session = await getSession();
    if (!session?.user)
      throw new Error('User must be authenticated to get an action');

    const { data } = await api.get(`/action/${id}`);
    return data;
  } catch (error: any) {
    handleDatabaseError(error, 'getActionById');
    throw new Error(`Error: ${error.message}`);
  }
}
export async function isExistedAction(cond: {
  action_type?: string;
  action_id?: string;
}): Promise<any | null> {
  try {
    const session = await getSession();
    if (!session?.user)
      throw new Error('User must be authenticated to get an action');
    const actionList = await listActions();

    if (!actionList)
      return false
    const action = actionList.filter((action) =>
      (!cond.action_type || action.action_type === cond.action_type) &&
      (!cond.action_id || action.action_id === cond.action_id)
    );

    if (!action.length) {
      return false;
    }
    return action[0];

  } catch (error: any) {
    handleDatabaseError(error, 'getActionById');
    throw new Error(`Error: ${error.message}`);
  }
}
export async function getActionByActionId(
  actionId: string
): Promise<any | null> {
  try {
    const session = await getSession();
    if (!session?.user)
      throw new Error('User must be authenticated to get an action');

    const { data } = await api.post('/action/action_id', { action_id: actionId });
    return data;
  } catch (error: any) {
    handleDatabaseError(error, 'getActionByActionId');
    throw new Error(`Error: ${error.message}`);
  }
}

export async function listActions(): Promise<any[]> {
  try {
    const session = await getSession();
    if (!session?.user)
      throw new Error('User must be authenticated to list actions');

    const { data } = await api.get("/action/list");
    return data || [];
  } catch (error: any) {
    handleDatabaseError(error, 'listActions');
    throw new Error(`Error: ${error.message}`);;
  }
}

export async function updateAction(
  id: number,
  updates: Partial<Action>
): Promise<Action> {
  try {
    const session = await getSession();
    if (!session?.user)
      throw new Error('User must be authenticated to update an action');

    // Remove id and created_at from updates if present
    const { id: _, created_at: __, ...validUpdates } = updates;

    const { data } = await api.put('/action', { id: id, action: validUpdates });
    return data;
  } catch (error: any) {
    handleDatabaseError(error, 'updateAction');
    throw new Error(`Error: ${error.message}`);
  }
}

export async function deleteAction(id: number): Promise<void> {
  try {
    const session = await getSession();
    if (!session?.user)
      throw new Error('User must be authenticated to delete an action');
    try {
      const { data } = await api.delete(`/action/${id}`);
      console.log(data);
    } catch (error) {
      console.log(error);
      throw error
    }
  } catch (error: any) {
    handleDatabaseError(error, 'deleteAction');
    throw new Error(`Error: ${error.message}`);
  }
}

// Phone Numbers CRUD functions with enhanced error handling
export async function createPhoneNumber(
  phoneNumber: string,
  model_id: string
): Promise<PhoneNumber> {
  try {
    const { data } = await api.post("/phone_numbers", {
      phone_number: phoneNumber,
      is_active: false,
      model_id: model_id,
    })

    return data;
  } catch (error: any) {
    handleDatabaseError(error, 'createPhoneNumber')
    throw new Error(`Error: ${error.message}`);
  }
}

// export async function getPhoneNumber(
//   model_id: string
// ): Promise<PhoneNumber | null> {
//   try {
//     const { data, error } = await supabase
//       .from('phone_numbers')
//       .select('*')
//       .eq('model_id', model_id)
//       .single();

//     if (error) throw error;
//     return data;
//   } catch (error: any) {
//     handleDatabaseError(error, 'getPhoneNumber');
//     throw new Error(`Error: ${error.message}`);
//   }
// }

// export async function listPhoneNumbers(): Promise<PhoneNumber[]> {
//   try {
//     const { data, error } = await supabase
//       .from('phone_numbers')
//       .select('*')
//       .order('created_at', { ascending: false });

//     if (error) throw error;
//     return data || [];
//   } catch (error: any) {
//     handleDatabaseError(error, 'listPhoneNumbers');
//     throw new Error(`Error: ${error.message}`);;
//   }
// }
// Optional Preferences functions with enhanced error handling
export async function saveOptionalPreferences(
  preferences: Omit<OptionalPreferenceInput, 'user_id'>
): Promise<OptionalPreferenceType> {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error('Please log in to save preferences.');

    const res = await api.post('/optionalPreferences', { preference: preferences });
    console.log(res);
    return res.data;
  } catch (error: any) {
    handleDatabaseError(error, 'saveOptionalPreferences');
    throw new Error(error?.message);
  }
}

export async function getOptionalPreferences(): Promise<OptionalPreferenceType | null> {
  try {
    const session = await getSession();
    if (!session?.user) return null;

    const { data } = await api.get('/get-optionalPreferences');
    console.log(data)
    return data;
  } catch (error: any) {
    handleDatabaseError(error, 'getOptionalPreferences');
    throw new Error(error.message);
  }
}

export async function updateOptionalPreferences(
  updates: Partial<OptionalPreferenceInput>
): Promise<OptionalPreferenceType> {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error('Please log in to update preferences.');
    console.log(updates)
    const res = await api.put("/update-optionalPreferences", { cond: updates })
    return res.data;
  } catch (error: any) {
    handleDatabaseError(error, 'updateOptionalPreferences');
    throw new Error(error.message);
  }
}

// export async function deleteOptionalPreferences(): Promise<void> {
//   try {
//     const session = await getSession();
//     if (!session?.user) throw new Error('Please log in to delete preferences.');

//     const { error } = await supabase
//       .from('optional_preferences')
//       .delete()
//       .eq('user_id', session.user.id);

//     if (error) throw error;
//   } catch (error) {
//     handleDatabaseError(error, 'deleteOptionalPreferences');
//   }
// }

// Profile functions with enhanced error handling
export async function saveUserProfile(
  profile: Partial<UserProfile> & {
    assistantName?: string;
    welcomeMessage?: string;
  }
) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error('Please log in to save your profile.');
    const res = await api.post("/user-profile", {
      owner_name: profile.ownerName,
      shop_name: profile.shopName,
      timezone: profile.timezone,
      assistant_name: profile.assistantName,
      welcome_message: profile.welcomeMessage,
      model_id: profile.model_id,
      daily_call_limit: profile.dailycallLimit,
      automatic_reminders: profile.automaticReminders,
      waitlist_management: profile.waitlistManagement,
      website: profile.website,
      phone_number: profile.phoneNumber,
    })
    console.log(res);
  } catch (error) {
    handleDatabaseError(error, 'saveUserProfile');
  }
}
export async function updateUserProfile(
  profile: Partial<UserProfile> & {
    assistantName?: string;
    welcomeMessage?: string;
  }
) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error('Please log in to save your profile.');
    const res = await api.put("/user-profile", {
      owner_name: profile.ownerName,
      shop_name: profile.shopName,
      timezone: profile.timezone,
      assistant_name: profile.assistantName,
      welcome_message: profile.welcomeMessage,
      completed_onboarding: profile.completedOnboarding ?? true,
      model_id: profile.model_id,
      daily_call_limit: profile.dailycallLimit,
      automatic_reminders: profile.automaticReminders,
      waitlist_management: profile.waitlistManagement,
      website: profile.website,
      phone_number: profile.phoneNumber,
    })
    console.log(res);
  } catch (error) {
    handleDatabaseError(error, 'updateUserProfile');
  }
}
export async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const session = await getSession();
    if (!session?.user) return null;

    const { data } = await api.get(`/user-profile`)
    return {
      ownerName: data.owner_name,
      shopName: data.shop_name,
      timezone: data.timezone,
      assistantName: data.assistant_name,
      welcomeMessage: data.welcome_message,
      completedOnboarding: data.completed_onboarding,
      model_id: data.model_id,
      phoneNumber: data.phone_number,
      dailycallLimit: data.daily_call_limit,
      automaticReminders: data.automatic_reminders,
      waitlistManagement: data.waitlist_management,
      plan: data.plan || 'TRIAL',
      planStart: data.plan_start ? new Date(data.plan_start) : new Date(),
      planEnd: data.plan_end
        ? new Date(data.plan_end)
        : new Date(new Date().setDate(new Date().getDate() + 15)),
      totalUsageMinutes: data.total_usage_minutes || 15,
      voiceAgentActive: data.voice_agent_active || true,
    };
  } catch (error) {
    return handleDatabaseError(error, 'loadUserProfile');
  }
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  try {
    const profile = await loadUserProfile();
    return profile?.completedOnboarding ?? false;
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
}