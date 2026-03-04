/**
 * University semester logic for KR Mangalam University
 *
 * Odd semesters  (1,3,5,7) → July – November
 * Even semesters (2,4,6,8) → January – June
 *
 * Example: Enrolled 2024
 *   Sem 1 → Jul–Nov 2024
 *   Sem 2 → Jan–Jun 2025
 *   Sem 3 → Jul–Nov 2025
 *   Sem 4 → Jan–Jun 2026  ← you are here (Feb 2026)
 */
function getCurrentSemester(enrollmentYear) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1–12

  // Years since enrollment (0-based)
  const yearsDiff = currentYear - enrollmentYear;

  // Which half of year?
  // Jan–Jun = even semester of that year
  // Jul–Dec = odd semester of that year
  const isEvenHalf = currentMonth >= 1 && currentMonth <= 6;

  // Each full year = 2 semesters
  // First year odd half  → sem 1
  // First year even half → sem 2
  // Second year odd half → sem 3 ... etc
  let semester;
  if (isEvenHalf) {
    semester = yearsDiff * 2; // e.g. 2024 enrolled, 2026 even → (2)*2 = 4
  } else {
    semester = yearsDiff * 2 + 1; // odd half
  }

  // Clamp between 1 and 8
  semester = Math.max(1, Math.min(8, semester));
  return semester;
}

function getSemesterLabel(semester) {
  const labels = {
    1: '1st Semester', 2: '2nd Semester',
    3: '3rd Semester', 4: '4th Semester',
    5: '5th Semester', 6: '6th Semester',
    7: '7th Semester', 8: '8th Semester',
  };
  return labels[semester] || `Semester ${semester}`;
}

function getSemesterType(semester) {
  return semester % 2 === 0 ? 'even' : 'odd';
}

function getAcademicYear(enrollmentYear, semester) {
  // Sem 1,2 → year1 – year1+1, Sem 3,4 → year1+1 – year1+2, etc
  const offset = Math.floor((semester - 1) / 2);
  const startYear = enrollmentYear + offset;
  return `${startYear}-${String(startYear + 1).slice(2)}`;
}

module.exports = {
  getCurrentSemester,
  getSemesterLabel,
  getSemesterType,
  getAcademicYear
};