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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      Bedrifter_ny: {
        Row: {
          aarsresultat: number | null
          ai_beskrivelse: string | null
          Ansatte: string | null
          ansetter_fra_studier: string | null
          ansetter_til_yrker: string | null
          antall_ansatte_tall: number | null
          Beskrivelse: string | null
          brreg_hentet: boolean | null
          brreg_oppdatert: string | null
          driftsinntekter: number | null
          "Driftsinntekter (MNOK)": string | null
          driftsresultat: number | null
          driftsresultat_mnok: number | null
          Geografi: string | null
          Karriereportal: string | null
          Linker: string | null
          Lokasjon: string | null
          nace_beskrivelse: string | null
          nace_kode: string | null
          noekkelord: string | null
          organisasjonsnummer: string | null
          regnskapsaar: number | null
          Sektor: string | null
          Selskap: string | null
          sist_oppdatert: string | null
          stiftelsesaar: number | null
          sub_sektor: string | null
          sum_egenkapital: number | null
          sum_eiendeler: number | null
          sum_gjeld: number | null
          valuta: string | null
        }
        Insert: {
          aarsresultat?: number | null
          ai_beskrivelse?: string | null
          Ansatte?: string | null
          ansetter_fra_studier?: string | null
          ansetter_til_yrker?: string | null
          antall_ansatte_tall?: number | null
          Beskrivelse?: string | null
          brreg_hentet?: boolean | null
          brreg_oppdatert?: string | null
          driftsinntekter?: number | null
          "Driftsinntekter (MNOK)"?: string | null
          driftsresultat?: number | null
          driftsresultat_mnok?: number | null
          Geografi?: string | null
          Karriereportal?: string | null
          Linker?: string | null
          Lokasjon?: string | null
          nace_beskrivelse?: string | null
          nace_kode?: string | null
          noekkelord?: string | null
          organisasjonsnummer?: string | null
          regnskapsaar?: number | null
          Sektor?: string | null
          Selskap?: string | null
          sist_oppdatert?: string | null
          stiftelsesaar?: number | null
          sub_sektor?: string | null
          sum_egenkapital?: number | null
          sum_eiendeler?: number | null
          sum_gjeld?: number | null
          valuta?: string | null
        }
        Update: {
          aarsresultat?: number | null
          ai_beskrivelse?: string | null
          Ansatte?: string | null
          ansetter_fra_studier?: string | null
          ansetter_til_yrker?: string | null
          antall_ansatte_tall?: number | null
          Beskrivelse?: string | null
          brreg_hentet?: boolean | null
          brreg_oppdatert?: string | null
          driftsinntekter?: number | null
          "Driftsinntekter (MNOK)"?: string | null
          driftsresultat?: number | null
          driftsresultat_mnok?: number | null
          Geografi?: string | null
          Karriereportal?: string | null
          Linker?: string | null
          Lokasjon?: string | null
          nace_beskrivelse?: string | null
          nace_kode?: string | null
          noekkelord?: string | null
          organisasjonsnummer?: string | null
          regnskapsaar?: number | null
          Sektor?: string | null
          Selskap?: string | null
          sist_oppdatert?: string | null
          stiftelsesaar?: number | null
          sub_sektor?: string | null
          sum_egenkapital?: number | null
          sum_eiendeler?: number | null
          sum_gjeld?: number | null
          valuta?: string | null
        }
        Relationships: []
      }
      class_groups: {
        Row: {
          created_at: string
          created_by: string | null
          grade_level: string | null
          id: string
          join_code: string
          name: string
          program_area: string | null
          school_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          grade_level?: string | null
          id?: string
          join_code?: string
          name: string
          program_area?: string | null
          school_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          grade_level?: string | null
          id?: string
          join_code?: string
          name?: string
          program_area?: string | null
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_groups_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      class_survey_responses: {
        Row: {
          class_group_id: string
          completed_at: string | null
          completion_status: string
          created_at: string
          id: string
          respondent_id: string
          responses: Json | null
          scores: Json | null
          started_at: string
          survey_type: string
          user_id: string | null
        }
        Insert: {
          class_group_id: string
          completed_at?: string | null
          completion_status?: string
          created_at?: string
          id?: string
          respondent_id?: string
          responses?: Json | null
          scores?: Json | null
          started_at?: string
          survey_type: string
          user_id?: string | null
        }
        Update: {
          class_group_id?: string
          completed_at?: string | null
          completion_status?: string
          created_at?: string
          id?: string
          respondent_id?: string
          responses?: Json | null
          scores?: Json | null
          started_at?: string
          survey_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_survey_responses_class_group_id_fkey"
            columns: ["class_group_id"]
            isOneToOne: false
            referencedRelation: "class_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      Clean_11418: {
        Row: {
          AvtaltVanlig: string | null
          ContentsCode: string | null
          id: string
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
          id?: string
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
          id?: string
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
      feedback_reports: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_label: string | null
          id: number
          kategori: string | null
          melding: string | null
          status: string | null
          type: string
          url: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_label?: string | null
          id?: never
          kategori?: string | null
          melding?: string | null
          status?: string | null
          type: string
          url?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_label?: string | null
          id?: never
          kategori?: string | null
          melding?: string | null
          status?: string | null
          type?: string
          url?: string | null
        }
        Relationships: []
      }
      high_school_responses: {
        Row: {
          api_results: Json | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          responses: Json | null
          user_id: string
        }
        Insert: {
          api_results?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id: string
        }
        Update: {
          api_results?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      nus_koder: {
        Row: {
          fagfelt_kode: string | null
          fagfelt_navn: string | null
          faggruppe_kode: string | null
          faggruppe_navn: string | null
          kode: string
          navn: string | null
          nivaa: number | null
          nivaa_navn: string | null
          parent_kode: string | null
        }
        Insert: {
          fagfelt_kode?: string | null
          fagfelt_navn?: string | null
          faggruppe_kode?: string | null
          faggruppe_navn?: string | null
          kode: string
          navn?: string | null
          nivaa?: number | null
          nivaa_navn?: string | null
          parent_kode?: string | null
        }
        Update: {
          fagfelt_kode?: string | null
          fagfelt_navn?: string | null
          faggruppe_kode?: string | null
          faggruppe_navn?: string | null
          kode?: string
          navn?: string | null
          nivaa?: number | null
          nivaa_navn?: string | null
          parent_kode?: string | null
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
      schools: {
        Row: {
          address: string | null
          contact_email: string | null
          created_at: string
          created_by: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_email?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_email?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      shared_results: {
        Row: {
          class_group_id: string
          display_name: string | null
          id: string
          response_id: string
          result_data: Json | null
          shared_at: string
          shared_by: string | null
        }
        Insert: {
          class_group_id: string
          display_name?: string | null
          id?: string
          response_id: string
          result_data?: Json | null
          shared_at?: string
          shared_by?: string | null
        }
        Update: {
          class_group_id?: string
          display_name?: string | null
          id?: string
          response_id?: string
          result_data?: Json | null
          shared_at?: string
          shared_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_results_class_group_id_fkey"
            columns: ["class_group_id"]
            isOneToOne: false
            referencedRelation: "class_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_results_response_id_fkey"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "class_survey_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      ssb_til_yrker: {
        Row: {
          "Connections-yrke": string | null
          "SSB-yrke_1": string | null
          "SSB-yrke_2": string | null
          "SSB-yrke_3": string | null
        }
        Insert: {
          "Connections-yrke"?: string | null
          "SSB-yrke_1"?: string | null
          "SSB-yrke_2"?: string | null
          "SSB-yrke_3"?: string | null
        }
        Update: {
          "Connections-yrke"?: string | null
          "SSB-yrke_1"?: string | null
          "SSB-yrke_2"?: string | null
          "SSB-yrke_3"?: string | null
        }
        Relationships: []
      }
      Student_data: {
        Row: {
          Lærestednavn: string | null
          "Measure Names": string | null
          "Measure Values": string | null
          Studiekode: string | null
          Studienavn: string | null
          Studiested: string | null
          "Utdanningsområde- og type": string | null
        }
        Insert: {
          Lærestednavn?: string | null
          "Measure Names"?: string | null
          "Measure Values"?: string | null
          Studiekode?: string | null
          Studienavn?: string | null
          Studiested?: string | null
          "Utdanningsområde- og type"?: string | null
        }
        Update: {
          Lærestednavn?: string | null
          "Measure Names"?: string | null
          "Measure Values"?: string | null
          Studiekode?: string | null
          Studienavn?: string | null
          Studiested?: string | null
          "Utdanningsområde- og type"?: string | null
        }
        Relationships: []
      }
      Student_data_ny: {
        Row: {
          Lærestednavn: string | null
          "Measure Names": string | null
          "Measure Values": string | null
          Sektor: string | null
          Studiekode: string | null
          Studienavn: string | null
          Studiested: string | null
          undersektor: string | null
          "Utdanningsområde- og type": string | null
        }
        Insert: {
          Lærestednavn?: string | null
          "Measure Names"?: string | null
          "Measure Values"?: string | null
          Sektor?: string | null
          Studiekode?: string | null
          Studienavn?: string | null
          Studiested?: string | null
          undersektor?: string | null
          "Utdanningsområde- og type"?: string | null
        }
        Update: {
          Lærestednavn?: string | null
          "Measure Names"?: string | null
          "Measure Values"?: string | null
          Sektor?: string | null
          Studiekode?: string | null
          Studienavn?: string | null
          Studiested?: string | null
          undersektor?: string | null
          "Utdanningsområde- og type"?: string | null
        }
        Relationships: []
      }
      studie_institusjoner: {
        Row: {
          årstall: number | null
          id: number
          institusjon: string
          opptakspoeng: number | null
          sist_oppdatert: string | null
          sokere_akseptert: number | null
          sokere_kvalifisert: number | null
          sokere_mott: number | null
          sokere_tilbud: number | null
          sokere_totalt: number | null
          studie_navn: string
          studiekode: string | null
          studieplasser: number | null
          studiested: string | null
        }
        Insert: {
          årstall?: number | null
          id?: never
          institusjon: string
          opptakspoeng?: number | null
          sist_oppdatert?: string | null
          sokere_akseptert?: number | null
          sokere_kvalifisert?: number | null
          sokere_mott?: number | null
          sokere_tilbud?: number | null
          sokere_totalt?: number | null
          studie_navn: string
          studiekode?: string | null
          studieplasser?: number | null
          studiested?: string | null
        }
        Update: {
          årstall?: number | null
          id?: never
          institusjon?: string
          opptakspoeng?: number | null
          sist_oppdatert?: string | null
          sokere_akseptert?: number | null
          sokere_kvalifisert?: number | null
          sokere_mott?: number | null
          sokere_tilbud?: number | null
          sokere_totalt?: number | null
          studie_navn?: string
          studiekode?: string | null
          studieplasser?: number | null
          studiested?: string | null
        }
        Relationships: []
      }
      studier: {
        Row: {
          ai_generert: boolean | null
          antall_inst: number | null
          beskrivelse: string | null
          id: number
          institusjoner: string | null
          nus_koder: string | null
          opptakspoeng: number | null
          sektor: string | null
          sist_oppdatert: string | null
          sokere_kvalifisert: number | null
          sokere_mott: number | null
          studie_navn: string
          studiekoder: string | null
          studieplasser: number | null
          under_sektor: string | null
        }
        Insert: {
          ai_generert?: boolean | null
          antall_inst?: number | null
          beskrivelse?: string | null
          id?: number
          institusjoner?: string | null
          nus_koder?: string | null
          opptakspoeng?: number | null
          sektor?: string | null
          sist_oppdatert?: string | null
          sokere_kvalifisert?: number | null
          sokere_mott?: number | null
          studie_navn: string
          studiekoder?: string | null
          studieplasser?: number | null
          under_sektor?: string | null
        }
        Update: {
          ai_generert?: boolean | null
          antall_inst?: number | null
          beskrivelse?: string | null
          id?: number
          institusjoner?: string | null
          nus_koder?: string | null
          opptakspoeng?: number | null
          sektor?: string | null
          sist_oppdatert?: string | null
          sokere_kvalifisert?: number | null
          sokere_mott?: number | null
          studie_navn?: string
          studiekoder?: string | null
          studieplasser?: number | null
          under_sektor?: string | null
        }
        Relationships: []
      }
      studier_v2: {
        Row: {
          id: number
          laerestednavn: string | null
          nus_koder: string | null
          opptakspoeng: number | null
          sektor: string | null
          sist_oppdatert: string | null
          sokere_ja_svar: number | null
          sokere_kvalifisert: number | null
          sokere_moett: number | null
          sokere_moett_per_plass: number | null
          sokere_per_plass: number | null
          sokere_tilbud: number | null
          sokere_totalt: number | null
          studie_navn: string
          studiekode: string | null
          studieplasser: number | null
          studiested: string | null
          under_sektor: string | null
          utdanningsomraade: string | null
        }
        Insert: {
          id?: never
          laerestednavn?: string | null
          nus_koder?: string | null
          opptakspoeng?: number | null
          sektor?: string | null
          sist_oppdatert?: string | null
          sokere_ja_svar?: number | null
          sokere_kvalifisert?: number | null
          sokere_moett?: number | null
          sokere_moett_per_plass?: number | null
          sokere_per_plass?: number | null
          sokere_tilbud?: number | null
          sokere_totalt?: number | null
          studie_navn: string
          studiekode?: string | null
          studieplasser?: number | null
          studiested?: string | null
          under_sektor?: string | null
          utdanningsomraade?: string | null
        }
        Update: {
          id?: never
          laerestednavn?: string | null
          nus_koder?: string | null
          opptakspoeng?: number | null
          sektor?: string | null
          sist_oppdatert?: string | null
          sokere_ja_svar?: number | null
          sokere_kvalifisert?: number | null
          sokere_moett?: number | null
          sokere_moett_per_plass?: number | null
          sokere_per_plass?: number | null
          sokere_tilbud?: number | null
          sokere_totalt?: number | null
          studie_navn?: string
          studiekode?: string | null
          studieplasser?: number | null
          studiested?: string | null
          under_sektor?: string | null
          utdanningsomraade?: string | null
        }
        Relationships: []
      }
      survey_options: {
        Row: {
          depends_on_option_value: string | null
          depends_on_question_id: string | null
          id: number
          is_exclusive: boolean | null
          is_open_text: boolean | null
          is_unknown: boolean | null
          legacy_id: string | null
          option_label: string | null
          option_order: number | null
          option_value: string
          question_id: string
          survey_id: string
          target_group: string
        }
        Insert: {
          depends_on_option_value?: string | null
          depends_on_question_id?: string | null
          id?: number
          is_exclusive?: boolean | null
          is_open_text?: boolean | null
          is_unknown?: boolean | null
          legacy_id?: string | null
          option_label?: string | null
          option_order?: number | null
          option_value: string
          question_id: string
          survey_id: string
          target_group: string
        }
        Update: {
          depends_on_option_value?: string | null
          depends_on_question_id?: string | null
          id?: number
          is_exclusive?: boolean | null
          is_open_text?: boolean | null
          is_unknown?: boolean | null
          legacy_id?: string | null
          option_label?: string | null
          option_order?: number | null
          option_value?: string
          question_id?: string
          survey_id?: string
          target_group?: string
        }
        Relationships: []
      }
      survey_questions: {
        Row: {
          collect_for_scoring: boolean | null
          depends_on_option_value: string | null
          depends_on_question_id: string | null
          help_text: string | null
          id: number
          is_filter: boolean | null
          is_metadata: boolean | null
          legacy_id: string | null
          max_select: number | null
          max_value: number | null
          min_select: number | null
          min_value: number | null
          page_id: string | null
          page_label: string | null
          page_order: number | null
          placeholder: string | null
          question_id: string
          question_order: number | null
          required: boolean | null
          survey_id: string
          target_group: string
          text: string | null
          type: string | null
          version: string | null
        }
        Insert: {
          collect_for_scoring?: boolean | null
          depends_on_option_value?: string | null
          depends_on_question_id?: string | null
          help_text?: string | null
          id?: number
          is_filter?: boolean | null
          is_metadata?: boolean | null
          legacy_id?: string | null
          max_select?: number | null
          max_value?: number | null
          min_select?: number | null
          min_value?: number | null
          page_id?: string | null
          page_label?: string | null
          page_order?: number | null
          placeholder?: string | null
          question_id: string
          question_order?: number | null
          required?: boolean | null
          survey_id: string
          target_group: string
          text?: string | null
          type?: string | null
          version?: string | null
        }
        Update: {
          collect_for_scoring?: boolean | null
          depends_on_option_value?: string | null
          depends_on_question_id?: string | null
          help_text?: string | null
          id?: number
          is_filter?: boolean | null
          is_metadata?: boolean | null
          legacy_id?: string | null
          max_select?: number | null
          max_value?: number | null
          min_select?: number | null
          min_value?: number | null
          page_id?: string | null
          page_label?: string | null
          page_order?: number | null
          placeholder?: string | null
          question_id?: string
          question_order?: number | null
          required?: boolean | null
          survey_id?: string
          target_group?: string
          text?: string | null
          type?: string | null
          version?: string | null
        }
        Relationships: []
      }
      survey_sections: {
        Row: {
          id: number
          page_id: string
          section_label: string | null
          section_order: number | null
          survey_id: string
          target_group: string
        }
        Insert: {
          id?: number
          page_id: string
          section_label?: string | null
          section_order?: number | null
          survey_id: string
          target_group: string
        }
        Update: {
          id?: number
          page_id?: string
          section_label?: string | null
          section_order?: number | null
          survey_id?: string
          target_group?: string
        }
        Relationships: []
      }
      universitet_statistikk: {
        Row: {
          "2019": string | null
          "2020": string | null
          "2021": string | null
          "2022": string | null
          "2023": string | null
          "2024": string | null
          Indikator: string | null
          Kategori: string | null
          Skole: string | null
        }
        Insert: {
          "2019"?: string | null
          "2020"?: string | null
          "2021"?: string | null
          "2022"?: string | null
          "2023"?: string | null
          "2024"?: string | null
          Indikator?: string | null
          Kategori?: string | null
          Skole?: string | null
        }
        Update: {
          "2019"?: string | null
          "2020"?: string | null
          "2021"?: string | null
          "2022"?: string | null
          "2023"?: string | null
          "2024"?: string | null
          Indikator?: string | null
          Kategori?: string | null
          Skole?: string | null
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
          api_results: Json | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          responses: Json | null
          user_id: string
        }
        Insert: {
          api_results?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id: string
        }
        Update: {
          api_results?: Json | null
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
      worker_responses: {
        Row: {
          api_results: Json | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          responses: Json | null
          user_id: string
        }
        Insert: {
          api_results?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id: string
        }
        Update: {
          api_results?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          responses?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      yrke_bedrifter: {
        Row: {
          bedrift: string
          fylke: string | null
          id: number
          kommune: string | null
          rang: number | null
          stillinger: number | null
          uno_id: string
        }
        Insert: {
          bedrift: string
          fylke?: string | null
          id?: number
          kommune?: string | null
          rang?: number | null
          stillinger?: number | null
          uno_id: string
        }
        Update: {
          bedrift?: string
          fylke?: string | null
          id?: number
          kommune?: string | null
          rang?: number | null
          stillinger?: number | null
          uno_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "yrke_bedrifter_uno_id_fkey"
            columns: ["uno_id"]
            isOneToOne: false
            referencedRelation: "yrker"
            referencedColumns: ["uno_id"]
          },
        ]
      }
      yrke_nus_map: {
        Row: {
          fagfelt_kode: string | null
          fagfelt_navn: string | null
          id: number
          nivaa_navn: string | null
          nus_kode: string
          nus_navn: string | null
          uno_id: string
        }
        Insert: {
          fagfelt_kode?: string | null
          fagfelt_navn?: string | null
          id?: number
          nivaa_navn?: string | null
          nus_kode: string
          nus_navn?: string | null
          uno_id: string
        }
        Update: {
          fagfelt_kode?: string | null
          fagfelt_navn?: string | null
          id?: number
          nivaa_navn?: string | null
          nus_kode?: string
          nus_navn?: string | null
          uno_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "yrke_nus_map_uno_id_fkey"
            columns: ["uno_id"]
            isOneToOne: false
            referencedRelation: "yrker"
            referencedColumns: ["uno_id"]
          },
        ]
      }
      yrke_studier: {
        Row: {
          andel_personer: number | null
          antall_personer: number | null
          id: number
          rang: number | null
          studie_navn: string
          uno_id: string
        }
        Insert: {
          andel_personer?: number | null
          antall_personer?: number | null
          id?: never
          rang?: number | null
          studie_navn: string
          uno_id: string
        }
        Update: {
          andel_personer?: number | null
          antall_personer?: number | null
          id?: never
          rang?: number | null
          studie_navn?: string
          uno_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "yrke_studier_uno_id_fkey"
            columns: ["uno_id"]
            isOneToOne: false
            referencedRelation: "yrker"
            referencedColumns: ["uno_id"]
          },
        ]
      }
      yrke_utdanning: {
        Row: {
          antall: number | null
          id: number
          prosent: number | null
          rang: number | null
          uno_id: string
          utdanning: string
        }
        Insert: {
          antall?: number | null
          id?: number
          prosent?: number | null
          rang?: number | null
          uno_id: string
          utdanning: string
        }
        Update: {
          antall?: number | null
          id?: number
          prosent?: number | null
          rang?: number | null
          uno_id?: string
          utdanning?: string
        }
        Relationships: [
          {
            foreignKeyName: "yrke_utdanning_uno_id_fkey"
            columns: ["uno_id"]
            isOneToOne: false
            referencedRelation: "yrker"
            referencedColumns: ["uno_id"]
          },
        ]
      }
      yrker: {
        Row: {
          ai_generert: boolean | null
          antall_ledige: number | null
          antall_sysselsatte: number | null
          beskrivelse: string | null
          er_utvidet: boolean | null
          gjennomsnitt_lonn: number | null
          kilde_dato: string | null
          ledighetsrate: number | null
          linked_uno_id: string | null
          lonn_kvinner: number | null
          lonn_menn: number | null
          sektor: string | null
          sist_oppdatert: string | null
          tittel: string
          under_sektor: string | null
          uno_id: string
        }
        Insert: {
          ai_generert?: boolean | null
          antall_ledige?: number | null
          antall_sysselsatte?: number | null
          beskrivelse?: string | null
          er_utvidet?: boolean | null
          gjennomsnitt_lonn?: number | null
          kilde_dato?: string | null
          ledighetsrate?: number | null
          linked_uno_id?: string | null
          lonn_kvinner?: number | null
          lonn_menn?: number | null
          sektor?: string | null
          sist_oppdatert?: string | null
          tittel: string
          under_sektor?: string | null
          uno_id: string
        }
        Update: {
          ai_generert?: boolean | null
          antall_ledige?: number | null
          antall_sysselsatte?: number | null
          beskrivelse?: string | null
          er_utvidet?: boolean | null
          gjennomsnitt_lonn?: number | null
          kilde_dato?: string | null
          ledighetsrate?: number | null
          linked_uno_id?: string | null
          lonn_kvinner?: number | null
          lonn_menn?: number | null
          sektor?: string | null
          sist_oppdatert?: string | null
          tittel?: string
          under_sektor?: string | null
          uno_id?: string
        }
        Relationships: []
      }
      Yrker_database: {
        Row: {
          "Detaljert beskrivelse": string | null
          "Kort beskrivelse": string | null
          Nøkkelkompetanser: string | null
          "Relaterte yrker": string | null
          Sektor: string | null
          "Spesifikk sektor": string | null
          Yrkesnavn: string | null
        }
        Insert: {
          "Detaljert beskrivelse"?: string | null
          "Kort beskrivelse"?: string | null
          Nøkkelkompetanser?: string | null
          "Relaterte yrker"?: string | null
          Sektor?: string | null
          "Spesifikk sektor"?: string | null
          Yrkesnavn?: string | null
        }
        Update: {
          "Detaljert beskrivelse"?: string | null
          "Kort beskrivelse"?: string | null
          Nøkkelkompetanser?: string | null
          "Relaterte yrker"?: string | null
          Sektor?: string | null
          "Spesifikk sektor"?: string | null
          Yrkesnavn?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: { Args: { user_id: string }; Returns: string }
      is_class_creator: {
        Args: { _class_group_id: string; _user_id: string }
        Returns: boolean
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
