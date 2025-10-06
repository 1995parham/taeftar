import zekr from '../lib/zekr';

export default {
  state() {
    // FIXME: This calculates days since May 17, 2018 (Ramadan 1439 AH start date).
    // Ramadan dates change yearly based on the Islamic lunar calendar.
    // This approach will not work correctly for future Ramadan months.
    // TODO: Implement proper Hijri calendar calculation to determine current Ramadan day.
    const today = String(Math.ceil(Math.abs(Date.now() - new Date('5/17/2018')) / (1000 * 3600 * 24)));
    return zekr[today];
  }
}
