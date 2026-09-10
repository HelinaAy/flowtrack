// Calculates current phase and key dates based on cycle info
function getCycleInfo(lastPeriodDate, cycleLength = 28, periodLength = 5) {
  const today = new Date();
  const lastPeriod = new Date(lastPeriodDate);

  // Days since last period started
  const msPerDay = 1000 * 60 * 60 * 24;
  let daysSinceLastPeriod = Math.floor((today - lastPeriod) / msPerDay);

  // Current day within the cycle (handles multiple cycles having passed)
  let currentCycleDay = daysSinceLastPeriod % cycleLength;
  if (currentCycleDay < 0) currentCycleDay = 0; // safety check for future dates

  // Ovulation is typically 14 days before the next period
  const ovulationDay = cycleLength - 14;

  // Fertile window: 5 days before ovulation through 1 day after
  const fertileStart = ovulationDay - 5;
  const fertileEnd = ovulationDay + 1;

  // Determine phase
  let phase;
  if (currentCycleDay < periodLength) {
    phase = 'menstrual';
  } else if (currentCycleDay < fertileStart) {
    phase = 'follicular';
  } else if (currentCycleDay <= fertileEnd) {
    phase = 'ovulation';
  } else {
    phase = 'luteal';
  }

  // Next period date
  const daysUntilNextPeriod = cycleLength - currentCycleDay;
  const nextPeriodDate = new Date(today);
  nextPeriodDate.setDate(today.getDate() + daysUntilNextPeriod);

  // Fertile window dates
  const daysUntilFertileStart = fertileStart - currentCycleDay;
  const fertileWindowStart = new Date(today);
  fertileWindowStart.setDate(today.getDate() + daysUntilFertileStart);

  const fertileWindowEnd = new Date(fertileWindowStart);
  fertileWindowEnd.setDate(fertileWindowStart.getDate() + (fertileEnd - fertileStart));

  return {
    currentCycleDay: currentCycleDay + 1, // human-friendly (Day 1, not Day 0)
    phase,
    daysUntilNextPeriod,
    nextPeriodDate: nextPeriodDate.toISOString().split('T')[0],
    fertileWindowStart: fertileWindowStart.toISOString().split('T')[0],
    fertileWindowEnd: fertileWindowEnd.toISOString().split('T')[0]
  };
}

module.exports = getCycleInfo;