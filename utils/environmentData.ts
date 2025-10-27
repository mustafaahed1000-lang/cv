
export interface WeatherInfo {
  city: string;
  description: string;
  tempC: number;
}

export interface PrayerInfo {
  city: string;
  nextPrayerName: string;
  nextPrayerTime: string;
}

// Placeholder لفلسطين كاملة
export function getWeatherForLocation(cityName: string): WeatherInfo {
  return {
    city: cityName,
    description: "طقس حالي غير فعلي (placeholder)",
    tempC: 25
  };
}

export function getPrayerTimesForLocation(cityName: string): PrayerInfo {
  return {
    city: cityName,
    nextPrayerName: "المغرب",
    nextPrayerTime: "17:42"
  };
}
