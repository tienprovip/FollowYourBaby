-- Add OCR-extracted fields to prenatal_visits
alter table prenatal_visits
  add column if not exists doctor_name     text,
  add column if not exists next_visit_date timestamptz;
