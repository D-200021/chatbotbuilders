import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

export const signUp = async (email: string, password: string, displayName?: string) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        display_name: displayName,
      }
    }
  });

  if (error) {
    toast({
      title: "Sign up failed",
      description: error.message,
      variant: "destructive",
    });
    return { data: null, error };
  }

  toast({
    title: "Account created!",
    description: "Please check your email to verify your account.",
  });

  return { data, error: null };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    toast({
      title: "Sign in failed",
      description: error.message,
      variant: "destructive",
    });
    return { data: null, error };
  }

  toast({
    title: "Welcome back!",
    description: "You have successfully signed in.",
  });

  return { data, error: null };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    toast({
      title: "Sign out failed",
      description: error.message,
      variant: "destructive",
    });
    return { error };
  }

  toast({
    title: "Signed out",
    description: "You have been successfully signed out.",
  });

  return { error: null };
};