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
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          description_ar: string | null
          icon: string | null
          id: string
          name: string
          name_ar: string | null
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          icon?: string | null
          id?: string
          name: string
          name_ar?: string | null
          requirement_type: string
          requirement_value: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          icon?: string | null
          id?: string
          name?: string
          name_ar?: string | null
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      addresses: {
        Row: {
          city: string
          created_at: string | null
          customer_id: string
          gis_location: Json | null
          id: string
          store_id: string
          street: string
          zip_code: string
        }
        Insert: {
          city: string
          created_at?: string | null
          customer_id: string
          gis_location?: Json | null
          id?: string
          store_id: string
          street: string
          zip_code: string
        }
        Update: {
          city?: string
          created_at?: string | null
          customer_id?: string
          gis_location?: Json | null
          id?: string
          store_id?: string
          street?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          brand_ar_name: string
          brand_eng_name: string
          brand_image: string | null
          created_at: string | null
          id: string
        }
        Insert: {
          brand_ar_name: string
          brand_eng_name: string
          brand_image?: string | null
          created_at?: string | null
          id?: string
        }
        Update: {
          brand_ar_name?: string
          brand_eng_name?: string
          brand_image?: string | null
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      customer_complaints: {
        Row: {
          content: string
          created_at: string | null
          customer_id: string
          id: string
          resolved: boolean | null
        }
        Insert: {
          content: string
          created_at?: string | null
          customer_id: string
          id?: string
          resolved?: boolean | null
        }
        Update: {
          content?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          resolved?: boolean | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          id: string
          name: string
          payment_methods: Json | null
          phone_number: string
          region_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          payment_methods?: Json | null
          phone_number: string
          region_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          payment_methods?: Json | null
          phone_number?: string
          region_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "region_setup"
            referencedColumns: ["id"]
          },
        ]
      }
      item_groups: {
        Row: {
          created_at: string | null
          group_ar_name: string
          group_code: string
          group_eng_name: string
          id: string
          parent_group_id: string | null
          vat_percentage: number | null
        }
        Insert: {
          created_at?: string | null
          group_ar_name: string
          group_code: string
          group_eng_name: string
          id?: string
          parent_group_id?: string | null
          vat_percentage?: number | null
        }
        Update: {
          created_at?: string | null
          group_ar_name?: string
          group_code?: string
          group_eng_name?: string
          id?: string
          parent_group_id?: string | null
          vat_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "item_groups_parent_group_id_fkey"
            columns: ["parent_group_id"]
            isOneToOne: false
            referencedRelation: "item_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      items: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          item_ar_name: string
          item_code: string
          item_eng_name: string
          price: number
          uom: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          item_ar_name: string
          item_code: string
          item_eng_name: string
          price: number
          uom: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          item_ar_name?: string
          item_code?: string
          item_eng_name?: string
          price?: number
          uom?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "item_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      language_setup: {
        Row: {
          created_at: string | null
          group_category: string | null
          id: string
          key_name: string
          language_code: string
          translated_text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          group_category?: string | null
          id?: string
          key_name: string
          language_code: string
          translated_text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          group_category?: string | null
          id?: string
          key_name?: string
          language_code?: string
          translated_text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_rtl: boolean | null
          name: string
          native_name: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_rtl?: boolean | null
          name: string
          native_name: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_rtl?: boolean | null
          name?: string
          native_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id: string
          notes?: string | null
          order_id: string
          price: number
          product_id: string
          product_name: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          price?: number
          product_id?: string
          product_name?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address_id: string
          created_at: string | null
          customer_id: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_fee: number | null
          id: string
          payment_method: string
          status: string
          store_id: string
          store_name: string
          total_amount: number
          updated_at: string | null
          vat_amount: number | null
        }
        Insert: {
          address_id: string
          created_at?: string | null
          customer_id: string
          customer_name: string
          customer_phone: string
          delivery_address: string
          delivery_fee?: number | null
          id: string
          payment_method: string
          status: string
          store_id: string
          store_name: string
          total_amount: number
          updated_at?: string | null
          vat_amount?: number | null
        }
        Update: {
          address_id?: string
          created_at?: string | null
          customer_id?: string
          customer_name?: string
          customer_phone?: string
          delivery_address?: string
          delivery_fee?: number | null
          id?: string
          payment_method?: string
          status?: string
          store_id?: string
          store_name?: string
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          icon: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          icon: string
          id: string
          name: string
        }
        Update: {
          created_at?: string | null
          icon?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category_id: string
          created_at: string | null
          description: string
          id: string
          image: string | null
          name: string
          price: number
        }
        Insert: {
          category_id: string
          created_at?: string | null
          description: string
          id: string
          image?: string | null
          name: string
          price: number
        }
        Update: {
          category_id?: string
          created_at?: string | null
          description?: string
          id?: string
          image?: string | null
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      region_setup: {
        Row: {
          created_at: string | null
          delivery_value: number | null
          id: string
          region_ar_name: string
          region_code: string
          region_eng_name: string
        }
        Insert: {
          created_at?: string | null
          delivery_value?: number | null
          id?: string
          region_ar_name: string
          region_code: string
          region_eng_name: string
        }
        Update: {
          created_at?: string | null
          delivery_value?: number | null
          id?: string
          region_ar_name?: string
          region_code?: string
          region_eng_name?: string
        }
        Relationships: []
      }
      store_region_links: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          region_id: string
          store_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          region_id: string
          store_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          region_id?: string
          store_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_region_links_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "region_setup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_region_links_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store_setup"
            referencedColumns: ["id"]
          },
        ]
      }
      store_setup: {
        Row: {
          brand_id: string | null
          created_at: string | null
          id: string
          store_ar_name: string
          store_code: string
          store_eng_name: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          id?: string
          store_ar_name: string
          store_code: string
          store_eng_name: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          id?: string
          store_ar_name?: string
          store_code?: string
          store_eng_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "store_setup_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          address: string
          created_at?: string | null
          id: string
          name: string
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      system_users: {
        Row: {
          created_at: string | null
          id: string
          is_admin: boolean | null
          password: string
          user_code: string
          user_name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          password: string
          user_code: string
          user_name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_admin?: boolean | null
          password?: string
          user_code?: string
          user_name?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          allow_item_groups_setup: boolean | null
          allow_new_customer: boolean | null
          allow_region_setup: boolean | null
          allow_store_setup: boolean | null
          allow_user_setup: boolean | null
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          allow_item_groups_setup?: boolean | null
          allow_new_customer?: boolean | null
          allow_region_setup?: boolean | null
          allow_store_setup?: boolean | null
          allow_user_setup?: boolean | null
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          allow_item_groups_setup?: boolean | null
          allow_new_customer?: boolean | null
          allow_region_setup?: boolean | null
          allow_store_setup?: boolean | null
          allow_user_setup?: boolean | null
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "system_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      difficulty_level: "beginner" | "intermediate" | "advanced"
      muscle_group:
        | "chest"
        | "back"
        | "shoulders"
        | "biceps"
        | "triceps"
        | "legs"
        | "abs"
        | "cardio"
        | "full_body"
      workout_day:
        | "push"
        | "pull"
        | "chest_back"
        | "shoulders_arms"
        | "legs"
        | "rest"
        | "custom"
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
    Enums: {
      difficulty_level: ["beginner", "intermediate", "advanced"],
      muscle_group: [
        "chest",
        "back",
        "shoulders",
        "biceps",
        "triceps",
        "legs",
        "abs",
        "cardio",
        "full_body",
      ],
      workout_day: [
        "push",
        "pull",
        "chest_back",
        "shoulders_arms",
        "legs",
        "rest",
        "custom",
      ],
    },
  },
} as const
