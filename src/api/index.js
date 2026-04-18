import { supabase } from '@/api/supabaseClient';
import { entities } from '@/api/entities';
import { invokeFunction } from '@/api/functions';
import { uploadFile } from '@/api/storage';
import { invokeLLM } from '@/api/llm';

const auth = {
  async me() {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },
  async isAuthenticated() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return Boolean(data.session);
  },
  async login(email, password) {
    if (password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    }

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/OperatorAuth`,
      },
    });
    if (error) throw error;
    return data;
  },
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  redirectToLogin(redirectPath = '/OperatorAuth') {
    window.location.href = redirectPath;
  },
};

export const appApi = {
  auth,
  entities,
  functions: {
    invoke: invokeFunction,
  },
  integrations: {
    Core: {
      async UploadFile({ file, bucket }) {
        const file_url = await uploadFile(file, bucket);
        return { file_url };
      },
      InvokeLLM: invokeLLM,
    },
  },
  appLogs: {
    async logUserInApp() {
      return null;
    },
  },
  asServiceRole: {
    entities,
    scheduledTasks: {
      list: (...args) => entities.ScheduledTask.list(...args),
      create: (payload) => entities.ScheduledTask.create(payload),
      delete: (id) => entities.ScheduledTask.delete(id),
    },
  },
};
