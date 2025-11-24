export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      organization_audit_log: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          id: string
          ip_address: unknown
          organization_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown
          organization_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          id?: string
          ip_address?: unknown
          organization_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          organization_id: string
          payload: Json
          processed_at: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          organization_id: string
          payload: Json
          processed_at?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          organization_id?: string
          payload?: Json
          processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_events_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          email: string
          expires_at: string
          id: string
          invited_by: string
          invited_by_email: string | null
          invited_by_name: string | null
          last_sent_at: string | null
          message: string | null
          metadata: Json | null
          organization_id: string
          resend_count: number | null
          role: string
          status: string | null
          token: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          email: string
          expires_at?: string
          id?: string
          invited_by: string
          invited_by_email?: string | null
          invited_by_name?: string | null
          last_sent_at?: string | null
          message?: string | null
          metadata?: Json | null
          organization_id: string
          resend_count?: number | null
          role: string
          status?: string | null
          token: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string
          invited_by_email?: string | null
          invited_by_name?: string | null
          last_sent_at?: string | null
          message?: string | null
          metadata?: Json | null
          organization_id?: string
          resend_count?: number | null
          role?: string
          status?: string | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_invites_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_invites_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          joined_at: string
          last_accessed_at: string | null
          organization_id: string
          permissions: Json | null
          role: string
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          joined_at?: string
          last_accessed_at?: string | null
          organization_id: string
          permissions?: Json | null
          role: string
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          joined_at?: string
          last_accessed_at?: string | null
          organization_id?: string
          permissions?: Json | null
          role?: string
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_postal_code: string | null
          address_state: string | null
          address_street: string | null
          annual_budget: string | null
          billing_email: string | null
          brand_primary_color: string | null
          brand_secondary_color: string | null
          created_at: string
          data_region: string | null
          deleted_at: string | null
          deleted_by: string | null
          ein: string | null
          focus_areas: string[] | null
          founded_year: number | null
          id: string
          industry: string | null
          logo_url: string | null
          metadata: Json | null
          mission: string | null
          name: string
          organization_type: string | null
          owner_id: string
          parent_organization_id: string | null
          plan_seats: number | null
          plan_tier: string | null
          settings: Json | null
          staff_count: number | null
          subscription_id: string | null
          subscription_status: string | null
          trial_ends_at: string | null
          type: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_state?: string | null
          address_street?: string | null
          annual_budget?: string | null
          billing_email?: string | null
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          created_at?: string
          data_region?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          ein?: string | null
          focus_areas?: string[] | null
          founded_year?: number | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          metadata?: Json | null
          mission?: string | null
          name: string
          organization_type?: string | null
          owner_id: string
          parent_organization_id?: string | null
          plan_seats?: number | null
          plan_tier?: string | null
          settings?: Json | null
          staff_count?: number | null
          subscription_id?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_state?: string | null
          address_street?: string | null
          annual_budget?: string | null
          billing_email?: string | null
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          created_at?: string
          data_region?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          ein?: string | null
          focus_areas?: string[] | null
          founded_year?: number | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          metadata?: Json | null
          mission?: string | null
          name?: string
          organization_type?: string | null
          owner_id?: string
          parent_organization_id?: string | null
          plan_seats?: number | null
          plan_tier?: string | null
          settings?: Json | null
          staff_count?: number | null
          subscription_id?: string | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          type?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_parent_organization_id_fkey"
            columns: ["parent_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          active_organization_id: string | null
          created_at: string
          email_digest: string | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active_organization_id?: string | null
          created_at?: string
          email_digest?: string | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active_organization_id?: string | null
          created_at?: string
          email_digest?: string | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_active_organization_id_fkey"
            columns: ["active_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_rls_policy_summary: {
        Row: {
          cmd: string | null
          permissive: string | null
          policyname: unknown
          qual: string | null
          roles: unknown[] | null
          schemaname: unknown
          tablename: unknown
          with_check: string | null
        }
        Relationships: []
      }
      v_table_sizes: {
        Row: {
          indexes_size: string | null
          schemaname: unknown
          table_size: string | null
          tablename: unknown
          total_size: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      expire_old_invites: { Args: never; Returns: undefined }
      generate_invite_token: { Args: never; Returns: string }
      get_user_org_role: {
        Args: { org_id: string; user_id: string }
        Returns: string
      }
      get_user_organizations: {
        Args: { user_id?: string }
        Returns: {
          joined_at: string
          last_accessed_at: string
          member_status: string
          organization_id: string
          organization_name: string
          user_role: string
        }[]
      }
      is_organization_member: {
        Args: { org_id: string; user_id: string }
        Returns: boolean
      }
      is_organization_owner: { Args: { org_id: string }; Returns: boolean }
      user_has_org_permission: {
        Args: { org_id: string; required_role: string }
        Returns: boolean
      }
      validate_invite_token: {
        Args: { invite_token: string }
        Returns: {
          email: string
          expires_at: string
          invite_id: string
          invited_by_name: string
          is_valid: boolean
          organization_id: string
          organization_name: string
          role: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
