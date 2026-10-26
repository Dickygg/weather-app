import "./style.css";
import { getWeatherNow, getWeatherDaily, getLocation } from "./API";

// weather code
function getWeatherDescription(code) {
  const weatherCodes = {
    0: {
      description: "Cerah",
      icon: "fa-solid fa-sun",
    },
    1: {
      description: "Cerah Sebagian",
      icon: "fa-solid fa-cloud-sun",
    },
    2: {
      description: "Berawan Sebagian",
      icon: "fa-solid fa-cloud-sun",
    },
    3: {
      description: "Mendung",
      icon: "fa-solid fa-cloud",
    },
    45: {
      description: "Berkabut",
      icon: "fa-solid fa-smog",
    },
    48: {
      description: "Kabut Tebal",
      icon: "fa-solid fa-smog",
    },
    51: {
      description: "Gerimis Ringan",
      icon: "fa-solid fa-cloud-rain",
    },
    53: {
      description: "Gerimis Sedang",
      icon: "fa-solid fa-cloud-rain",
    },
    55: {
      description: "Gerimis Lebat",
      icon: "fa-solid fa-cloud-showers-heavy",
    },
    56: {
      description: "Gerimis Beku Ringan",
      icon: "fa-solid fa-cloud-rain",
    },
    57: {
      description: "Gerimis Beku Lebat",
      icon: "fa-solid fa-cloud-showers-heavy",
    },
    61: {
      description: "Hujan Ringan",
      icon: "fa-solid fa-cloud-rain",
    },
    63: {
      description: "Hujan Sedang",
      icon: "fa-solid fa-cloud-rain",
    },
    65: {
      description: "Hujan Lebat",
      icon: "fa-solid fa-cloud-showers-heavy",
    },
    66: {
      description: "Hujan Beku Ringan",
      icon: "fa-solid fa-cloud-rain",
    },
    67: {
      description: "Hujan Beku Lebat",
      icon: "fa-solid fa-cloud-showers-heavy",
    },
    71: {
      description: "Salju Ringan",
      icon: "fa-solid fa-snowflake",
    },
    73: {
      description: "Salju Sedang",
      icon: "fa-solid fa-snowflake",
    },
    75: {
      description: "Salju Lebat",
      icon: "fa-solid fa-snowflake",
    },
    77: {
      description: "Butiran Salju",
      icon: "fa-solid fa-snowflake",
    },
    80: {
      description: "Hujan Lokal Ringan",
      icon: "fa-solid fa-cloud-sun-rain",
    },
    81: {
      description: "Hujan Lokal Sedang",
      icon: "fa-solid fa-cloud-showers-heavy",
    },
    82: {
      description: "Hujan Lokal Lebat",
      icon: "fa-solid fa-cloud-showers-heavy",
    },
    85: {
      description: "Hujan Salju Ringan",
      icon: "fa-solid fa-snowflake",
    },
    86: {
      description: "Hujan Salju Lebat",
      icon: "fa-solid fa-snowflake",
    },
    95: {
      description: "Badai Petir",
      icon: "fa-solid fa-cloud-bolt",
    },
    96: {
      description: "Badai Petir dengan Hujan Es",
      icon: "fa-solid fa-cloud-bolt",
    },
    97: {
      description: "Badai Petir Lebat",
      icon: "fa-solid fa-cloud-bolt",
    },
    99: {
      description: "Badai Petir dengan Hujan Es Lebat",
      icon: "fa-solid fa-cloud-bolt",
    },
  };

  return weatherCodes[code] ?? "Cuaca tidak diketahui";
}
const location = await getLocation();
const select = document.querySelector("#location-select");
select.innerHTML = location
  .map((item) => {
    return `<option value="${item.name}">${item.name}, ${item.provinsi}</option>`;
  })
  .join("");
let locationSelect = select.value;
console.log(locationSelect);
select.addEventListener("change", (e) => {
  const value = e.target.value;
  locationSelect = value;
  renderWeather(value);
  renderWeatherDaily(value);
});

const refreshIcon = document.querySelector("#refresh-icon");
const refreshText = document.querySelector("#refresh-text");
const refresh = document.querySelector("#refresh-button");
refresh.addEventListener("click", async () => {
  refresh.disabled = true;
  // Tampilkan indikator loading
  refreshIcon.classList.add("animate-spin");
  refreshText.textContent = "Memuat...";

  try {
    await renderWeather(locationSelect);
    await renderWeatherDaily(locationSelect);
    console.log("berhasil");
  } catch (error) {
    console.error("Gagal memperbarui cuaca:", error);
  } finally {
    // Kembalikan tombol seperti semula
    refresh.disabled = false;
    refreshIcon.classList.remove("animate-spin");
    refreshText.textContent = "Refresh";
  }
});

async function renderWeather(selectLocation) {
  try {
    const filter = location.find((item) => item.name === selectLocation);
    const WeatherNow = await getWeatherNow(filter.latitude, filter.longitude);
    const weather_desc = getWeatherDescription(WeatherNow.weather_code);
    const weather = document.querySelector("#weather");
    weather.innerHTML = ` <!-- Main Weather -->
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0">
              <h2 class="text-5xl font-semibold tracking-tight sm:text-6xl">
                ${WeatherNow.temperature_2m}<span class="text-3xl">°C</span>
              </h2>

              <p class="mt-3 text-lg font-medium sm:text-xl">
               ${weather_desc.description}
              </p>

              <p class="mt-1 mb-2 text-sm text-white/65">Kondisi cuaca saat ini</p>
            </div>

            <div class="shrink-0 text-5xl text-amber-200 sm:text-7xl">
              <i class="${weather_desc.icon}"></i>
            </div>
          </div>

          <!-- Weather Details -->
          <div
            class="grid grid-cols-3 divide-x divide-white/20 border-t border-white/20 pt-5"
          >
            <div class="flex flex-col items-center gap-2 px-1 text-center">
              <i class="fa-solid fa-droplet text-lg text-sky-200"></i>
              <span class="text-xs text-white/65 sm:text-sm">Kelembapan</span>
              <p id="humidity" class="text-sm font-semibold sm:text-base">
                ${WeatherNow.relative_humidity_2m}%
              </p>
            </div>

            <div class="flex flex-col items-center gap-2 px-1 text-center">
              <i class="fa-solid fa-wind text-lg text-sky-200"></i>
              <span class="text-xs text-white/65 sm:text-sm"
                >Kecepatan Angin</span
              >
              <p id="wind-speed" class="text-sm font-semibold sm:text-base">
                ${WeatherNow.wind_speed_10m} km/jam
              </p>
            </div>

            <div class="flex flex-col items-center gap-2 px-1 text-center">
              <i
                class="fa-solid fa-temperature-half text-lg text-amber-200"
              ></i>
              <span class="text-xs text-white/65 sm:text-sm"
                >Terasa Seperti</span
              >
              <p id="feels-like" class="text-sm font-semibold sm:text-base">
                ${WeatherNow.apparent_temperature}°C
              </p>
            </div>
          </div>`;
  } catch (error) {
    console.error("Gagal memperbarui cuaca:", error);
    weather.innerHTML = "<p>Oops..., Something Error Now</p>";
  }
}

async function renderWeatherDaily(selectLocation) {
  try {
    const filter = location.find((item) => item.name === selectLocation);
    const WeatherDaily = await getWeatherDaily(
      filter.latitude,
      filter.longitude,
    );
    const dailyWeather = document.querySelector("#dailyWeather");
    const daily = WeatherDaily.time.map((tanggal, i) => ({
      tanggal,
      max: WeatherDaily.temperature_2m_max[i],
      min: WeatherDaily.temperature_2m_min[i],
      peluang_hujan: WeatherDaily.precipitation_probability_max[i],
      kode: getWeatherDescription(WeatherDaily.weather_code[i]),
      hari: new Date(tanggal).toLocaleDateString("id-ID", { weekday: "long" }),
    }));
    dailyWeather.innerHTML = daily
      .map((item) => {
        return `        <div
          class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-4 first:pt-0"
        >
          <div>
            <p class="font-medium">${item.hari}</p>
            <p class="mt-1 text-xs text-white/60">${item.tanggal}</p>
          </div>

          <div class="flex items-center gap-3">
            <i class="${item.kode.icon} text-amber-200"></i>
            <div>
              <p class="text-sm font-medium">${item.kode.description}</p>
              <p class="text-xs text-white/60">Peluang presipitasi Hujan</p>
              <p class="text-xs text-sky-200">${item.peluang_hujan}</p>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 text-sm">
            <span class="font-semibold">${item.max}°</span>
            <span class="text-white/50">${item.min}°</span>
          </div>
        </div>`;
      })
      .join("");
  } catch (error) {
    console.error("Gagal memperbarui cuaca:", error);
    dailyWeather.innerHTML = "<p>Oops..., Something Error Now</p>";
  }
}
renderWeather(locationSelect);
renderWeatherDaily(locationSelect);
