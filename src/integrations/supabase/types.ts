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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      business_ai_config: {
        Row: {
          api_key_encrypted: string | null
          business_id: string
          created_at: string
          custom_instructions: string | null
          enabled: boolean | null
          greeting_message: string | null
          id: string
          max_tokens: number | null
          provider: string
          system_prompt: string | null
          temperature: number | null
          updated_at: string
        }
        Insert: {
          api_key_encrypted?: string | null
          business_id: string
          created_at?: string
          custom_instructions?: string | null
          enabled?: boolean | null
          greeting_message?: string | null
          id?: string
          max_tokens?: number | null
          provider?: string
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string
        }
        Update: {
          api_key_encrypted?: string | null
          business_id?: string
          created_at?: string
          custom_instructions?: string | null
          enabled?: boolean | null
          greeting_message?: string | null
          id?: string
          max_tokens?: number | null
          provider?: string
          system_prompt?: string | null
          temperature?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_ai_config_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_attributes: {
        Row: {
          attribute_type: string
          attribute_value: string
          business_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          attribute_type: string
          attribute_value: string
          business_id: string
          created_at?: string | null
          id?: string
        }
        Update: {
          attribute_type?: string
          attribute_value?: string
          business_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_attributes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_branches: {
        Row: {
          active: boolean | null
          address: string
          business_id: string
          created_at: string | null
          id: string
          is_main: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          neighborhood: string
          phone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          active?: boolean | null
          address: string
          business_id: string
          created_at?: string | null
          id?: string
          is_main?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          neighborhood: string
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          active?: boolean | null
          address?: string
          business_id?: string
          created_at?: string | null
          id?: string
          is_main?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          neighborhood?: string
          phone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_branches_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          business_id: string
          close_time: string | null
          created_at: string | null
          day_of_week: number
          id: string
          is_closed: boolean | null
          open_time: string | null
        }
        Insert: {
          business_id: string
          close_time?: string | null
          created_at?: string | null
          day_of_week: number
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
        }
        Update: {
          business_id?: string
          close_time?: string | null
          created_at?: string | null
          day_of_week?: number
          id?: string
          is_closed?: boolean | null
          open_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_hours_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_images: {
        Row: {
          business_id: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_type: string
          image_url: string
          is_primary: boolean | null
        }
        Insert: {
          business_id: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_type?: string
          image_url: string
          is_primary?: boolean | null
        }
        Update: {
          business_id?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_type?: string
          image_url?: string
          is_primary?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "business_images_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_menu: {
        Row: {
          available: boolean | null
          business_id: string
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
        }
        Insert: {
          available?: boolean | null
          business_id: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price: number
        }
        Update: {
          available?: boolean | null
          business_id?: string
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "business_menu_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_promotions: {
        Row: {
          active: boolean | null
          business_id: string
          conditions: string | null
          created_at: string | null
          description: string
          first_time_only: boolean | null
          id: string
          image_url: string | null
          max_redemptions_per_user: number | null
          qr_code: string | null
          title: string
          valid_until: string | null
        }
        Insert: {
          active?: boolean | null
          business_id: string
          conditions?: string | null
          created_at?: string | null
          description: string
          first_time_only?: boolean | null
          id?: string
          image_url?: string | null
          max_redemptions_per_user?: number | null
          qr_code?: string | null
          title: string
          valid_until?: string | null
        }
        Update: {
          active?: boolean | null
          business_id?: string
          conditions?: string | null
          created_at?: string | null
          description?: string
          first_time_only?: boolean | null
          id?: string
          image_url?: string | null
          max_redemptions_per_user?: number | null
          qr_code?: string | null
          title?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_promotions_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_reviews: {
        Row: {
          approved: boolean
          author_name: string
          business_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved?: boolean
          author_name: string
          business_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved?: boolean
          author_name?: string
          business_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_shorts: {
        Row: {
          active: boolean | null
          business_id: string
          created_at: string | null
          description: string | null
          id: string
          likes: number | null
          thumbnail_url: string | null
          title: string
          video_url: string
          views: number | null
        }
        Insert: {
          active?: boolean | null
          business_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          likes?: number | null
          thumbnail_url?: string | null
          title: string
          video_url: string
          views?: number | null
        }
        Update: {
          active?: boolean | null
          business_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          likes?: number | null
          thumbnail_url?: string | null
          title?: string
          video_url?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "business_shorts_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_subscriptions: {
        Row: {
          auto_renew: boolean
          business_id: string
          created_at: string
          end_date: string
          id: string
          payment_method: string | null
          payment_reference: string | null
          plan_id: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          auto_renew?: boolean
          business_id: string
          created_at?: string
          end_date: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          plan_id: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          auto_renew?: boolean
          business_id?: string
          created_at?: string
          end_date?: string
          id?: string
          payment_method?: string | null
          payment_reference?: string | null
          plan_id?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string
          category: string
          created_at: string | null
          description: string | null
          email: string | null
          facebook_url: string | null
          featured: boolean | null
          geo_notifications_enabled: boolean | null
          id: string
          instagram_url: string | null
          latitude: number | null
          longitude: number | null
          loyalty_enabled: boolean | null
          loyalty_points_per_scan: number | null
          loyalty_points_to_redeem: number | null
          loyalty_reward_description: string | null
          loyalty_reward_image: string | null
          name: string
          neighborhood: string
          notification_radius_km: number | null
          owner_id: string
          phone: string | null
          price_range: string | null
          slug: string | null
          tiktok_url: string | null
          updated_at: string | null
          website: string | null
          whatsapp: string | null
          zone: string | null
        }
        Insert: {
          address: string
          category: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          featured?: boolean | null
          geo_notifications_enabled?: boolean | null
          id?: string
          instagram_url?: string | null
          latitude?: number | null
          longitude?: number | null
          loyalty_enabled?: boolean | null
          loyalty_points_per_scan?: number | null
          loyalty_points_to_redeem?: number | null
          loyalty_reward_description?: string | null
          loyalty_reward_image?: string | null
          name: string
          neighborhood: string
          notification_radius_km?: number | null
          owner_id: string
          phone?: string | null
          price_range?: string | null
          slug?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
          zone?: string | null
        }
        Update: {
          address?: string
          category?: string
          created_at?: string | null
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          featured?: boolean | null
          geo_notifications_enabled?: boolean | null
          id?: string
          instagram_url?: string | null
          latitude?: number | null
          longitude?: number | null
          loyalty_enabled?: boolean | null
          loyalty_points_per_scan?: number | null
          loyalty_points_to_redeem?: number | null
          loyalty_reward_description?: string | null
          loyalty_reward_image?: string | null
          name?: string
          neighborhood?: string
          notification_radius_km?: number | null
          owner_id?: string
          phone?: string | null
          price_range?: string | null
          slug?: string | null
          tiktok_url?: string | null
          updated_at?: string | null
          website?: string | null
          whatsapp?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          category: string | null
          contact_person: string | null
          converted_from_prospect_id: string | null
          created_at: string
          email: string | null
          facebook: string | null
          id: string
          instagram: string | null
          logo_url: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string
          tiktok: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          contact_person?: string | null
          converted_from_prospect_id?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          tiktok?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          contact_person?: string | null
          converted_from_prospect_id?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          tiktok?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_converted_from_prospect_id_fkey"
            columns: ["converted_from_prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          category: string
          created_at: string
          description: string | null
          end_date: string | null
          featured: boolean | null
          id: string
          image_url: string | null
          latitude: number | null
          location: string
          longitude: number | null
          organizer: string | null
          price_range: string | null
          slug: string | null
          start_date: string
          ticket_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          category: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location: string
          longitude?: number | null
          organizer?: string | null
          price_range?: string | null
          slug?: string | null
          start_date: string
          ticket_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          featured?: boolean | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          organizer?: string | null
          price_range?: string | null
          slug?: string | null
          start_date?: string
          ticket_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      loyalty_history: {
        Row: {
          business_id: string | null
          id: string
          points_earned: number
          scan_type: string | null
          scanned_at: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          id?: string
          points_earned?: number
          scan_type?: string | null
          scanned_at?: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          id?: string
          points_earned?: number
          scan_type?: string | null
          scanned_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_history_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_points: {
        Row: {
          business_id: string | null
          created_at: string
          id: string
          last_scan_at: string | null
          points: number
          reward_claimed: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          business_id?: string | null
          created_at?: string
          id?: string
          last_scan_at?: string | null
          points?: number
          reward_claimed?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          business_id?: string | null
          created_at?: string
          id?: string
          last_scan_at?: string | null
          points?: number
          reward_claimed?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_points_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          link: string | null
          message: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          link?: string | null
          message: string
          read?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          link?: string | null
          message?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          general_points: number
          id: string
          loyalty_points: number
          phone: string | null
          referral_code: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          general_points?: number
          id: string
          loyalty_points?: number
          phone?: string | null
          referral_code?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          general_points?: number
          id?: string
          loyalty_points?: number
          phone?: string | null
          referral_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promotion_redemptions: {
        Row: {
          id: string
          promotion_id: string
          redeemed_at: string
          user_id: string
        }
        Insert: {
          id?: string
          promotion_id: string
          redeemed_at?: string
          user_id: string
        }
        Update: {
          id?: string
          promotion_id?: string
          redeemed_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_redemptions_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "business_promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      prospect_appointments: {
        Row: {
          appointment_date: string
          appointment_time: string | null
          client_id: string | null
          contacted_by: string | null
          created_at: string
          description: string | null
          id: string
          notes: string | null
          prospect_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_time?: string | null
          client_id?: string | null
          contacted_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          prospect_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_time?: string | null
          client_id?: string | null
          contacted_by?: string | null
          created_at?: string
          description?: string | null
          id?: string
          notes?: string | null
          prospect_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospect_appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prospect_appointments_prospect_id_fkey"
            columns: ["prospect_id"]
            isOneToOne: false
            referencedRelation: "prospects"
            referencedColumns: ["id"]
          },
        ]
      }
      prospects: {
        Row: {
          address: string | null
          category: string | null
          contact_person: string | null
          contact_type: string | null
          contacted_by: string | null
          created_at: string
          email: string | null
          facebook: string | null
          first_contact_date: string | null
          id: string
          instagram: string | null
          logo_url: string | null
          name: string
          next_contact_date: string | null
          notes: string | null
          observation: string | null
          phone: string | null
          status: string
          tiktok: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          category?: string | null
          contact_person?: string | null
          contact_type?: string | null
          contacted_by?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          first_contact_date?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          name: string
          next_contact_date?: string | null
          notes?: string | null
          observation?: string | null
          phone?: string | null
          status?: string
          tiktok?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          category?: string | null
          contact_person?: string | null
          contact_type?: string | null
          contacted_by?: string | null
          created_at?: string
          email?: string | null
          facebook?: string | null
          first_contact_date?: string | null
          id?: string
          instagram?: string | null
          logo_url?: string | null
          name?: string
          next_contact_date?: string | null
          notes?: string | null
          observation?: string | null
          phone?: string | null
          status?: string
          tiktok?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      proximity_notifications_sent: {
        Row: {
          business_id: string
          distance_km: number | null
          id: string
          sent_at: string
          user_id: string
          user_latitude: number | null
          user_longitude: number | null
        }
        Insert: {
          business_id: string
          distance_km?: number | null
          id?: string
          sent_at?: string
          user_id: string
          user_latitude?: number | null
          user_longitude?: number | null
        }
        Update: {
          business_id?: string
          distance_km?: number | null
          id?: string
          sent_at?: string
          user_id?: string
          user_latitude?: number | null
          user_longitude?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proximity_notifications_sent_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      push_campaigns: {
        Row: {
          business_id: string
          created_at: string
          id: string
          image_url: string | null
          message: string
          scheduled_at: string
          sent_at: string | null
          sent_count: number | null
          status: string
          target_audience: string | null
          title: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          image_url?: string | null
          message: string
          scheduled_at: string
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          target_audience?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          image_url?: string | null
          message?: string
          scheduled_at?: string
          sent_at?: string | null
          sent_count?: number | null
          status?: string
          target_audience?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_campaigns_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      push_notification_tokens: {
        Row: {
          created_at: string
          device_type: string | null
          id: string
          token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_type?: string | null
          id?: string
          token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_type?: string | null
          id?: string
          token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          points_awarded: number
          referred_id: string
          referrer_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points_awarded?: number
          referred_id: string
          referrer_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points_awarded?: number
          referred_id?: string
          referrer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      route_visits: {
        Row: {
          business_id: string
          created_at: string
          goals_earned: number | null
          id: string
          qr_scanned: boolean | null
          receipt_image_url: string | null
          route_category: string
          user_id: string
          verified: boolean | null
          visited_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          goals_earned?: number | null
          id?: string
          qr_scanned?: boolean | null
          receipt_image_url?: string | null
          route_category: string
          user_id: string
          verified?: boolean | null
          visited_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          goals_earned?: number | null
          id?: string
          qr_scanned?: boolean | null
          receipt_image_url?: string | null
          route_category?: string
          user_id?: string
          verified?: boolean | null
          visited_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_visits_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_campaigns: {
        Row: {
          category_filters: string[] | null
          created_at: string
          cta_action_type: string | null
          cta_action_value: string | null
          cta_label: string | null
          geo_enabled: boolean
          geo_latitude: number | null
          geo_longitude: number | null
          geo_radius_km: number | null
          id: string
          image_url: string | null
          message: string
          rejection_reason: string | null
          scheduled_at: string | null
          sent_at: string | null
          sent_count: number | null
          sponsor_id: string
          status: string
          target_audience: string
          title: string
          updated_at: string
          zone_filters: string[] | null
        }
        Insert: {
          category_filters?: string[] | null
          created_at?: string
          cta_action_type?: string | null
          cta_action_value?: string | null
          cta_label?: string | null
          geo_enabled?: boolean
          geo_latitude?: number | null
          geo_longitude?: number | null
          geo_radius_km?: number | null
          id?: string
          image_url?: string | null
          message: string
          rejection_reason?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          sponsor_id: string
          status?: string
          target_audience?: string
          title: string
          updated_at?: string
          zone_filters?: string[] | null
        }
        Update: {
          category_filters?: string[] | null
          created_at?: string
          cta_action_type?: string | null
          cta_action_value?: string | null
          cta_label?: string | null
          geo_enabled?: boolean
          geo_latitude?: number | null
          geo_longitude?: number | null
          geo_radius_km?: number | null
          id?: string
          image_url?: string | null
          message?: string
          rejection_reason?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          sponsor_id?: string
          status?: string
          target_audience?: string
          title?: string
          updated_at?: string
          zone_filters?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_campaigns_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_plan_requests: {
        Row: {
          admin_notes: string | null
          created_at: string
          id: string
          message: string | null
          plan_id: string
          sponsor_id: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string | null
          plan_id: string
          sponsor_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          id?: string
          message?: string | null
          plan_id?: string
          sponsor_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_plan_requests_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "sponsor_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsor_plan_requests_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_plans: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          data_access_level: string
          description: string | null
          display_order: number
          features: Json | null
          geo_targeting: boolean
          id: string
          main_banners: number
          monthly_push_limit: number
          name: string
          price: number
          priority_support: boolean
          tier: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          data_access_level?: string
          description?: string | null
          display_order?: number
          features?: Json | null
          geo_targeting?: boolean
          id?: string
          main_banners?: number
          monthly_push_limit?: number
          name: string
          price: number
          priority_support?: boolean
          tier: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          data_access_level?: string
          description?: string | null
          display_order?: number
          features?: Json | null
          geo_targeting?: boolean
          id?: string
          main_banners?: number
          monthly_push_limit?: number
          name?: string
          price?: number
          priority_support?: boolean
          tier?: string
          updated_at?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          brand_name: string
          contact_person: string | null
          created_at: string
          current_plan_id: string | null
          description: string | null
          email: string | null
          facebook: string | null
          id: string
          industry: string | null
          instagram: string | null
          logo_url: string | null
          notes: string | null
          phone: string | null
          plan_end_date: string | null
          plan_start_date: string | null
          status: string
          tiktok: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          brand_name: string
          contact_person?: string | null
          created_at?: string
          current_plan_id?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          industry?: string | null
          instagram?: string | null
          logo_url?: string | null
          notes?: string | null
          phone?: string | null
          plan_end_date?: string | null
          plan_start_date?: string | null
          status?: string
          tiktok?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          brand_name?: string
          contact_person?: string | null
          created_at?: string
          current_plan_id?: string | null
          description?: string | null
          email?: string | null
          facebook?: string | null
          id?: string
          industry?: string | null
          instagram?: string | null
          logo_url?: string | null
          notes?: string | null
          phone?: string | null
          plan_end_date?: string | null
          plan_start_date?: string | null
          status?: string
          tiktok?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsors_current_plan_id_fkey"
            columns: ["current_plan_id"]
            isOneToOne: false
            referencedRelation: "sponsor_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          analytics: boolean
          created_at: string
          currency: string
          description: string | null
          duration_days: number
          featured_listing: boolean
          id: string
          max_images: number | null
          max_promotions: number | null
          max_shorts: number | null
          name: string
          price: number
          priority_support: boolean
          proximity_notifications: boolean
          push_notifications: boolean
          updated_at: string
        }
        Insert: {
          analytics?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          duration_days: number
          featured_listing?: boolean
          id?: string
          max_images?: number | null
          max_promotions?: number | null
          max_shorts?: number | null
          name: string
          price: number
          priority_support?: boolean
          proximity_notifications?: boolean
          push_notifications?: boolean
          updated_at?: string
        }
        Update: {
          analytics?: boolean
          created_at?: string
          currency?: string
          description?: string | null
          duration_days?: number
          featured_listing?: boolean
          id?: string
          max_images?: number | null
          max_promotions?: number | null
          max_shorts?: number | null
          name?: string
          price?: number
          priority_support?: boolean
          proximity_notifications?: boolean
          push_notifications?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          business_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance_km: {
        Args: { lat1: number; lat2: number; lon1: number; lon2: number }
        Returns: number
      }
      generate_referral_code: { Args: never; Returns: string }
      generate_slug: { Args: { name: string }; Returns: string }
      get_nearby_businesses: {
        Args: { max_radius_km?: number; user_lat: number; user_lon: number }
        Returns: {
          distance_km: number
          id: string
          latitude: number
          longitude: number
          name: string
          notification_radius_km: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "business_owner" | "customer" | "sponsor"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "business_owner", "customer", "sponsor"],
    },
  },
} as const
