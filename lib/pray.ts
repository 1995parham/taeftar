import { prayTimes } from "./praytimes";

prayTimes.setMethod("Tehran");

interface RawPrayTimes {
  imsak: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  midnight: string;
}

export class PrayTimes {
  imsak: Date;
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  sunset: Date;
  maghrib: Date;
  isha: Date;
  midnight: Date;

  imsako: string;
  fajro: string;
  sunriseo: string;
  dhuhro: string;
  asro: string;
  sunseto: string;
  maghribo: string;
  ishao: string;
  midnighto: string;

  constructor(times: RawPrayTimes, date: Date) {
    this.imsak = PrayTimes.parse(times.imsak, date);
    this.imsako = times.imsak;

    this.fajr = PrayTimes.parse(times.fajr, date);
    this.fajro = times.fajr;

    this.sunrise = PrayTimes.parse(times.sunrise, date);
    this.sunriseo = times.sunrise;

    this.dhuhr = PrayTimes.parse(times.dhuhr, date);
    this.dhuhro = times.dhuhr;

    this.asr = PrayTimes.parse(times.asr, date);
    this.asro = times.asr;

    this.sunset = PrayTimes.parse(times.sunset, date);
    this.sunseto = times.sunset;

    this.maghrib = PrayTimes.parse(times.maghrib, date);
    this.maghribo = times.maghrib;

    this.isha = PrayTimes.parse(times.isha, date);
    this.ishao = times.isha;

    this.midnight = PrayTimes.parse(times.midnight, date);
    this.midnighto = times.midnight;
  }

  // parse parses the time string into a date.
  // it needs a base to consider the pray time on that date.
  static parse(d: string, base: Date): Date {
    if (!d) {
      return new Date();
    }

    let s = d.split(":");
    let r = new Date(base);
    r.setHours(parseInt(s[0]));
    r.setMinutes(parseInt(s[1]));
    r.setSeconds(0);
    return r;
  }
}

export function getTimes(date: Date, loc: [number, number]): PrayTimes {
  let rawTimes: RawPrayTimes = prayTimes.getTimes(date, loc);

  return new PrayTimes(rawTimes, date);
}
