// v0.1 schema contract. Regenerate from Supabase after coordinated migrations.
export type Role = "student" | "researcher" | "admin";
export type PublicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "changes_requested"
  | "published"
  | "rejected";
type Stamps = { id: string; created_at: string; updated_at: string };
export type Publication = Stamps & {
  title: string;
  slug: string;
  abstract: string;
  doi: string | null;
  year: number | null;
  submitted_by: string | null;
  status: PublicationStatus;
  published_at: string | null;
  is_demo: boolean;
};
export type Area = Stamps & {
  name: string;
  slug: string;
  description: string;
  is_demo: boolean;
};
export type Researcher = Stamps & {
  user_id: string | null;
  name: string;
  slug: string;
  bio: string;
  position: string;
  is_demo: boolean;
};
export type Project = Stamps & {
  title: string;
  slug: string;
  summary: string;
  status: "proposed" | "ongoing" | "completed" | "archived";
  is_demo: boolean;
};
export type Profile = Stamps & { display_name: string; role: Role };
export type PublicationReview = {
  id: string;
  publication_id: string;
  reviewer_id: string | null;
  decision: PublicationStatus;
  note: string;
  created_at: string;
};
export type ProjectInterest = {
  id: string;
  project_id: string;
  student_id: string;
  contact_email: string;
  message: string;
  is_demo: boolean;
  created_at: string;
};
type Table<Row, Required extends keyof Row = never> = {
  Row: Row;
  Insert: Partial<Row> & Pick<Row, Required>;
  Update: Partial<Row>;
  Relationships: [];
};
export type Database = {
  public: {
    Tables: {
      profiles: Table<Profile, "id">;
      research_areas: Table<Area, "name" | "slug" | "description">;
      researchers: Table<Researcher, "name" | "slug" | "bio" | "position">;
      projects: Table<Project, "title" | "slug" | "summary">;
      publications: Table<Publication, "title" | "slug" | "abstract">;
      publication_reviews: Table<
        PublicationReview,
        "publication_id" | "decision"
      >;
      project_interests: Table<
        ProjectInterest,
        "project_id" | "student_id" | "contact_email" | "message"
      >;
      researcher_research_areas: Table<
        { researcher_id: string; research_area_id: string },
        "researcher_id" | "research_area_id"
      >;
      researcher_projects: Table<
        { researcher_id: string; project_id: string },
        "researcher_id" | "project_id"
      >;
      project_research_areas: Table<
        { project_id: string; research_area_id: string },
        "project_id" | "research_area_id"
      >;
      publication_researchers: Table<
        { publication_id: string; researcher_id: string },
        "publication_id" | "researcher_id"
      >;
      publication_projects: Table<
        { publication_id: string; project_id: string },
        "publication_id" | "project_id"
      >;
    };
    Views: Record<string, never>;
    Functions: {
      current_app_role: { Args: Record<string, never>; Returns: Role | null };
      review_publication: {
        Args: { p_id: string; p_decision: PublicationStatus; p_note?: string };
        Returns: string;
      };
    };
    Enums: {
      app_role: Role;
      publication_status: PublicationStatus;
      project_status: Project["status"];
    };
    CompositeTypes: Record<string, never>;
  };
};
