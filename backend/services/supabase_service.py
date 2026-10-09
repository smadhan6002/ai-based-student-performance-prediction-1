"""
supabase_service.py
-------------------
Handles all Supabase database operations for the student performance prediction system.

Verified schema (from live Supabase tables):
  students:   id (uuid PK), student_name, student_id (text, unique),
              department, year (int), semester (int), created_at, updated_at
  predictions: id (uuid PK), student_id (uuid FK → students.id),
              attendance, internal_marks, assignment_average, previous_semester_marks,
              study_hours, assignment_completion, class_participation, failed_subjects,
              prediction, excellent_probability, good_probability,
              average_probability, at_risk_probability, created_at

Architecture:
  - Uses the Supabase anon key + RLS policies.
  - No service_role key used or stored.
  - Credentials loaded from backend/.env via python-dotenv.
  - All DB logic isolated here — main.py stays clean.
"""

import os
import logging
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Load backend/.env before any client creation
_env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path=_env_path)

_supabase_client = None


def get_supabase_client():
    """
    Returns an initialised Supabase client (singleton).
    Reads SUPABASE_URL and SUPABASE_ANON_KEY from backend/.env.
    """
    global _supabase_client

    if _supabase_client is not None:
        return _supabase_client

    url = os.environ.get("SUPABASE_URL", "").strip()
    key = os.environ.get("SUPABASE_ANON_KEY", "").strip()

    if not url or not key:
        raise RuntimeError(
            "SUPABASE_URL and SUPABASE_ANON_KEY must be set in backend/.env"
        )

    try:
        from supabase import create_client
        _supabase_client = create_client(url, key)
        logger.info("Supabase client initialised successfully.")
        return _supabase_client
    except Exception as exc:
        logger.error(f"Failed to initialise Supabase client: {exc}")
        raise


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _parse_year(year: str) -> int:
    """
    Convert React year string to integer for the students table.
    Examples: '3rd Year' -> 3,  '1st Year' -> 1,  '4th Year' -> 4
    Falls back to extracting the first digit, then defaults to 1.
    """
    import re
    match = re.search(r'\d+', str(year))
    return int(match.group()) if match else 1


def _parse_semester(semester: str) -> int:
    """
    Convert React semester string to integer.
    Examples: 'Semester 5' -> 5, 'Semester 1' -> 1
    Falls back to extracting the first digit, then defaults to 1.
    """
    import re
    match = re.search(r'\d+', str(semester))
    return int(match.group()) if match else 1


# ---------------------------------------------------------------------------
# Student operations
# ---------------------------------------------------------------------------

def upsert_student(
    student_id: str,
    student_name: str,
    department: str,
    year: str,
    semester: str,
) -> dict:
    """
    Insert a new student or update their record if student_id already exists.
    Uses Supabase upsert on_conflict='student_id' — guarantees no duplicate rows.

    Column mapping (verified against live schema):
      student_name → students.student_name
      student_id   → students.student_id  (text, unique constraint)
      year         → students.year        (integer)
      semester     → students.semester    (integer)

    Returns the full upserted row dict (including students.id UUID).
    Raises RuntimeError on database failure.
    """
    client = get_supabase_client()

    payload = {
        "student_id":   student_id,
        "student_name": student_name,
        "department":   department,
        "year":         _parse_year(year),
        "semester":     _parse_semester(semester),
    }

    try:
        response = (
            client.table("students")
            .upsert(payload, on_conflict="student_id")
            .execute()
        )

        if not response.data:
            raise RuntimeError(
                "Upsert returned no data. Check RLS INSERT + SELECT policies on 'students'."
            )

        row = response.data[0]
        logger.info(
            f"Student upserted — student_id={student_id}, "
            f"db_uuid={row.get('id')}, name={student_name}"
        )
        return row

    except RuntimeError:
        raise
    except Exception as exc:
        logger.error(f"Supabase student upsert failed: {exc}")
        raise RuntimeError(f"Database error during student upsert: {exc}") from exc


# ---------------------------------------------------------------------------
# Prediction operations
# ---------------------------------------------------------------------------

def save_prediction(
    student_db_uuid: str,   # students.id (UUID) — NOT the text student_id
    attendance: float,
    internal_marks: float,
    assignment_average: float,
    previous_semester_marks: float,
    study_hours: float,
    assignment_completion: float,
    class_participation: float,
    failed_subjects: int,
    prediction: str,
    probabilities: dict,
) -> dict:
    """
    Insert a new prediction row linked to the student's UUID primary key.

    predictions.student_id is a UUID FK referencing students.id — it is NOT
    the text student_id from the form.

    Each call always creates a new row; a student may have many prediction records.

    Probability keys normalised to handle 'At_Risk'/'At Risk' ML model inconsistency.

    Returns the inserted row dict.
    Raises RuntimeError on database failure.
    """
    client = get_supabase_client()

    # Normalise probability keys: "At_Risk" → "At Risk"
    normalised = {k.replace("_", " "): float(v) for k, v in probabilities.items()}

    payload = {
        "student_id":               student_db_uuid,    # UUID FK
        "attendance":               float(attendance),
        "internal_marks":           float(internal_marks),
        "assignment_average":       float(assignment_average),
        "previous_semester_marks":  float(previous_semester_marks),
        "study_hours":              float(study_hours),
        "assignment_completion":    float(assignment_completion),
        "class_participation":      float(class_participation),
        "failed_subjects":          int(failed_subjects),
        "prediction":               str(prediction),
        "excellent_probability":    normalised.get("Excellent", 0.0),
        "good_probability":         normalised.get("Good", 0.0),
        "average_probability":      normalised.get("Average", 0.0),
        "at_risk_probability":      normalised.get("At Risk", 0.0),
    }

    try:
        response = (
            client.table("predictions")
            .insert(payload)
            .execute()
        )

        if not response.data:
            raise RuntimeError(
                "Insert returned no data. Check RLS INSERT + SELECT policies on 'predictions'."
            )

        row = response.data[0]
        logger.info(
            f"Prediction saved — student_uuid={student_db_uuid}, "
            f"prediction={prediction}, row_id={row.get('id')}"
        )
        return row

    except RuntimeError:
        raise
    except Exception as exc:
        logger.error(f"Supabase prediction insert failed: {exc}")
        raise RuntimeError(f"Database error during prediction save: {exc}") from exc


def get_student_with_predictions(student_uuid: str) -> dict:
    """
    Fetch a student and their prediction history by the UUID (students.id).
    """
    client = get_supabase_client()
    try:
        response = (
            client.table("students")
            .select("*, predictions(*)")
            .eq("id", student_uuid)
            .order("created_at", foreign_table="predictions", desc=True)
            .execute()
        )
        if response.data:
            return response.data[0]
        return None
    except Exception as exc:
        logger.error(f"Error fetching student {student_uuid}: {exc}")
        return None

def get_all_students() -> list:
    """
    Fetch all students with their latest prediction history.
    """
    client = get_supabase_client()
    try:
        # Fetch all students and their predictions, ordered by prediction created_at DESC
        response = (
            client.table("students")
            .select("*, predictions(*)")
            .order("created_at", foreign_table="predictions", desc=True)
            .execute()
        )
        return response.data or []
    except Exception as exc:
        logger.error(f"Error fetching all students: {exc}")
        return []
