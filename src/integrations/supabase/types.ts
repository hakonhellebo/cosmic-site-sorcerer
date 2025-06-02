export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      Bedrifter: {
        Row: {
          Ansatte: string | null
          Beskrivelse: string | null
          "Driftsinntekter (MNOK)": string | null
          Geografi: string | null
          Hovedbransje: string | null
          Karriereportal: string | null
          Linker: string | null
          Lokasjon: string | null
          Selskap: string | null
        }
        Insert: {
          Ansatte?: string | null
          Beskrivelse?: string | null
          "Driftsinntekter (MNOK)"?: string | null
          Geografi?: string | null
          Hovedbransje?: string | null
          Karriereportal?: string | null
          Linker?: string | null
          Lokasjon?: string | null
          Selskap?: string | null
        }
        Update: {
          Ansatte?: string | null
          Beskrivelse?: string | null
          "Driftsinntekter (MNOK)"?: string | null
          Geografi?: string | null
          Hovedbransje?: string | null
          Karriereportal?: string | null
          Linker?: string | null
          Lokasjon?: string | null
          Selskap?: string | null
        }
        Relationships: []
      }
      Clean_11418: {
        Row: {
          AvtaltVanlig: string | null
          ContentsCode: string | null
          Kjonn: string | null
          MaaleMetode: string
          Sektor: string | null
          Tid: number | null
          value: number | null
          Yrke: string
        }
        Insert: {
          AvtaltVanlig?: string | null
          ContentsCode?: string | null
          Kjonn?: string | null
          MaaleMetode: string
          Sektor?: string | null
          Tid?: number | null
          value?: number | null
          Yrke: string
        }
        Update: {
          AvtaltVanlig?: string | null
          ContentsCode?: string | null
          Kjonn?: string | null
          MaaleMetode?: string
          Sektor?: string | null
          Tid?: number | null
          value?: number | null
          Yrke?: string
        }
        Relationships: []
      }
      Clean_11421: {
        Row: {
          Alder: string | null
          ArbeidsTid: string | null
          ContentsCode: string | null
          Kjonn: string | null
          MaaleMetode: string
          NACE2007: string | null
          Sektor: string
          Tid: number | null
          value: number | null
        }
        Insert: {
          Alder?: string | null
          ArbeidsTid?: string | null
          ContentsCode?: string | null
          Kjonn?: string | null
          MaaleMetode: string
          NACE2007?: string | null
          Sektor: string
          Tid?: number | null
          value?: number | null
        }
        Update: {
          Alder?: string | null
          ArbeidsTid?: string | null
          ContentsCode?: string | null
          Kjonn?: string | null
          MaaleMetode?: string
          NACE2007?: string | null
          Sektor?: string
          Tid?: number | null
          value?: number | null
        }
        Relationships: []
      }
      Clean_11658: {
        Row: {
          Alder: string
          ContentsCode: string | null
          Kjonn: string
          Tid: string | null
          value: number | null
          Yrke: string | null
        }
        Insert: {
          Alder: string
          ContentsCode?: string | null
          Kjonn: string
          Tid?: string | null
          value?: number | null
          Yrke?: string | null
        }
        Update: {
          Alder?: string
          ContentsCode?: string | null
          Kjonn?: string
          Tid?: string | null
          value?: number | null
          Yrke?: string | null
        }
        Relationships: []
      }
      Clean_14378: {
        Row: {
          AntAarEtterUtd: string | null
          AvtaltArbTid: string | null
          ContentsCode: string | null
          Fagfelt: string | null
          MaaleMetode: string
          Tid: number | null
          UtdNivaa: string
          value: number | null
        }
        Insert: {
          AntAarEtterUtd?: string | null
          AvtaltArbTid?: string | null
          ContentsCode?: string | null
          Fagfelt?: string | null
          MaaleMetode: string
          Tid?: number | null
          UtdNivaa: string
          value?: number | null
        }
        Update: {
          AntAarEtterUtd?: string | null
          AvtaltArbTid?: string | null
          ContentsCode?: string | null
          Fagfelt?: string | null
          MaaleMetode?: string
          Tid?: number | null
          UtdNivaa?: string
          value?: number | null
        }
        Relationships: []
      }
      high_school_responses: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          responses: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      Universitetsdata: {
        Row: {
          Årstall: string | null
          Avdelingskode: string | null
          Avdelingskode_SSB: string | null
          Avdelingsnavn: string | null
          Institusjonskode: string | null
          Institusjonsnavn: string | null
          Kvalifikasjonskode: string | null
          Kvalifikasjonsnavn: string | null
          Nivåkode: string | null
          Nivånavn: string | null
          Semester: string | null
          Semesternavn: string | null
          "SSBs NUS-kode": string | null
          Studiumkode: string | null
          Studnavn: string | null
          "Vitnemålsgivende/ikke-vitnemålsgivende": string | null
        }
        Insert: {
          Årstall?: string | null
          Avdelingskode?: string | null
          Avdelingskode_SSB?: string | null
          Avdelingsnavn?: string | null
          Institusjonskode?: string | null
          Institusjonsnavn?: string | null
          Kvalifikasjonskode?: string | null
          Kvalifikasjonsnavn?: string | null
          Nivåkode?: string | null
          Nivånavn?: string | null
          Semester?: string | null
          Semesternavn?: string | null
          "SSBs NUS-kode"?: string | null
          Studiumkode?: string | null
          Studnavn?: string | null
          "Vitnemålsgivende/ikke-vitnemålsgivende"?: string | null
        }
        Update: {
          Årstall?: string | null
          Avdelingskode?: string | null
          Avdelingskode_SSB?: string | null
          Avdelingsnavn?: string | null
          Institusjonskode?: string | null
          Institusjonsnavn?: string | null
          Kvalifikasjonskode?: string | null
          Kvalifikasjonsnavn?: string | null
          Nivåkode?: string | null
          Nivånavn?: string | null
          Semester?: string | null
          Semesternavn?: string | null
          "SSBs NUS-kode"?: string | null
          Studiumkode?: string | null
          Studnavn?: string | null
          "Vitnemålsgivende/ikke-vitnemålsgivende"?: string | null
        }
        Relationships: []
      }
      "Universitetsdata 2": {
        Row: {
          År: number | null
          Arbeidsstil: string | null
          Fagfelt: string | null
          "Faglig prestasjon": string | null
          Ferdighetsprofil: string | null
          Geografi: string | null
          Karriereintensjon: string | null
          Lærested: string | null
          Poenggrense: string | null
          "Praktisk erfaring": string | null
          "Studienavn - clean": string | null
          Studiested: string | null
          Teknologibruk: string | null
          Trygghet: string | null
          Verdiprofil: string | null
        }
        Insert: {
          År?: number | null
          Arbeidsstil?: string | null
          Fagfelt?: string | null
          "Faglig prestasjon"?: string | null
          Ferdighetsprofil?: string | null
          Geografi?: string | null
          Karriereintensjon?: string | null
          Lærested?: string | null
          Poenggrense?: string | null
          "Praktisk erfaring"?: string | null
          "Studienavn - clean"?: string | null
          Studiested?: string | null
          Teknologibruk?: string | null
          Trygghet?: string | null
          Verdiprofil?: string | null
        }
        Update: {
          År?: number | null
          Arbeidsstil?: string | null
          Fagfelt?: string | null
          "Faglig prestasjon"?: string | null
          Ferdighetsprofil?: string | null
          Geografi?: string | null
          Karriereintensjon?: string | null
          Lærested?: string | null
          Poenggrense?: string | null
          "Praktisk erfaring"?: string | null
          "Studienavn - clean"?: string | null
          Studiested?: string | null
          Teknologibruk?: string | null
          Trygghet?: string | null
          Verdiprofil?: string | null
        }
        Relationships: []
      }
      university_responses: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          responses: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          favorite_data: Json | null
          favorite_id: string
          favorite_name: string
          favorite_type: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          favorite_data?: Json | null
          favorite_id: string
          favorite_name: string
          favorite_type: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          favorite_data?: Json | null
          favorite_id?: string
          favorite_name?: string
          favorite_type?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      "Utdanning til yrke": {
        Row: {
          antall_personer: number | null
          groupValue: string | null
          styrk08_navn: string | null
        }
        Insert: {
          antall_personer?: number | null
          groupValue?: string | null
          styrk08_navn?: string | null
        }
        Update: {
          antall_personer?: number | null
          groupValue?: string | null
          styrk08_navn?: string | null
        }
        Relationships: []
      }
      Utdanningsnivå: {
        Row: {
          andel_13: string | null
          andel_710: string | null
          andel_personer: number | null
          antall_13: string | null
          antall_40: string | null
          antall_710: string | null
          antall_kvinner: number | null
          antall_menn: number | null
          antall_offentlig: number | null
          antall_personer: number | null
          antall_privat: number | null
          id: string | null
          kildedato: string | null
          nus: number | null
          nus_kortnavn: string | null
          nus_kortnavn_id: string | null
          nus_navn: string | null
          uno_ids: string | null
          uno_ids_titler: string | null
        }
        Insert: {
          andel_13?: string | null
          andel_710?: string | null
          andel_personer?: number | null
          antall_13?: string | null
          antall_40?: string | null
          antall_710?: string | null
          antall_kvinner?: number | null
          antall_menn?: number | null
          antall_offentlig?: number | null
          antall_personer?: number | null
          antall_privat?: number | null
          id?: string | null
          kildedato?: string | null
          nus?: number | null
          nus_kortnavn?: string | null
          nus_kortnavn_id?: string | null
          nus_navn?: string | null
          uno_ids?: string | null
          uno_ids_titler?: string | null
        }
        Update: {
          andel_13?: string | null
          andel_710?: string | null
          andel_personer?: number | null
          antall_13?: string | null
          antall_40?: string | null
          antall_710?: string | null
          antall_kvinner?: number | null
          antall_menn?: number | null
          antall_offentlig?: number | null
          antall_personer?: number | null
          antall_privat?: number | null
          id?: string | null
          kildedato?: string | null
          nus?: number | null
          nus_kortnavn?: string | null
          nus_kortnavn_id?: string | null
          nus_navn?: string | null
          uno_ids?: string | null
          uno_ids_titler?: string | null
        }
        Relationships: []
      }
      worker_responses: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          responses: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      Yrke_statistikk: {
        Row: {
          andel_13: number | null
          andel_710: number | null
          andel_personer: number | null
          antall_13: number | null
          antall_40: number | null
          antall_710: number | null
          antall_kvinner: number | null
          antall_menn: number | null
          antall_personer: number | null
          id: string | null
          kildedato: string | null
          styrk08: string | null
          styrk08_kortnavn: string | null
          styrk08_navn: string
          uno_ids: string | null
          uno_ids_titler: string | null
        }
        Insert: {
          andel_13?: number | null
          andel_710?: number | null
          andel_personer?: number | null
          antall_13?: number | null
          antall_40?: number | null
          antall_710?: number | null
          antall_kvinner?: number | null
          antall_menn?: number | null
          antall_personer?: number | null
          id?: string | null
          kildedato?: string | null
          styrk08?: string | null
          styrk08_kortnavn?: string | null
          styrk08_navn: string
          uno_ids?: string | null
          uno_ids_titler?: string | null
        }
        Update: {
          andel_13?: number | null
          andel_710?: number | null
          andel_personer?: number | null
          antall_13?: number | null
          antall_40?: number | null
          antall_710?: number | null
          antall_kvinner?: number | null
          antall_menn?: number | null
          antall_personer?: number | null
          id?: string | null
          kildedato?: string | null
          styrk08?: string | null
          styrk08_kortnavn?: string | null
          styrk08_navn?: string
          uno_ids?: string | null
          uno_ids_titler?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
