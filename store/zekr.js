import zekr from '../lib/zekr';

function getRamadanDay() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  }).formatToParts(now);

  const month = parseInt(parts.find(p => p.type === 'month').value);
  const day = parseInt(parts.find(p => p.type === 'day').value);

  // Ramadan is the 9th month of the Islamic calendar
  if (month === 9 && day >= 1 && day <= 30) {
    return String(day);
  }

  return null;
}

export default {
  state() {
    const day = getRamadanDay();
    return day ? zekr[day] : null;
  }
}
