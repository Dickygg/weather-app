export async function getWeatherNow(lat, long) {
  const params = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=Asia%2FJakarta`;
  try {
    const respone = await fetch(params);

    if (!respone.ok) {
      throw new Error(`HTTP Error:${respone.status}`);
    }

    const { current } = await respone.json();
    return current;
  } catch (error) {
    console.error("gagal Mengambil data:", error);
    throw error;
  }
}

export async function getWeatherDaily(lat, long) {
  const params = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&timezone=Asia%2FJakarta&forecast_days=5`;
  try {
    const respone = await fetch(params);
    if (!respone.ok) {
      throw new Error("HTTP Error:", respone.status);
    }
    const { daily } = await respone.json();
    return daily;
  } catch (error) {
    console.error("gagal Mengambil data:", error);
    throw error;
  }
}

export async function getLocation() {
  const respone = await fetch("src/assets/json/location.json");
  const data = respone.json();
  return data;
}
