<template>
  <div class="weather" v-if="weatherData.adCode.city && weatherData.weather.weather">
    <span>{{ weatherData.adCode.city }}</span>
    <span>&nbsp;{{ weatherData.weather.weather }}</span>
    <span>&nbsp;{{ weatherData.weather.temperature }}℃</span>
    <span class="sm-hidden">&nbsp;{{ weatherData.weather.winddirection }}风</span>
    <span class="sm-hidden">&nbsp;{{ weatherData.weather.windpower }}级</span>
  </div>
  <div class="weather" v-else>
    <span>天气数据获取失败</span>
  </div>
</template>

<script setup>
import { getWttrWeather } from "@/api";
import { Error } from "@icon-park/vue-next";

// 天气数据
const weatherData = reactive({
  adCode: {
    city: null, // 城市
  },
  weather: {
    weather: null, // 天气现象
    temperature: null, // 实时气温
    winddirection: null, // 风向描述
    windpower: null, // 风力级别
  },
});

// 风向转换 (16方位 → 中文)
const windDirToChinese = (dir) => {
  const map = {
    N: "北", NNE: "北北东", NE: "东北", ENE: "东东北",
    E: "东", ESE: "东东南", SE: "东南", SSE: "南东南",
    S: "南", SSW: "南南西", SW: "西南", WSW: "西西南",
    W: "西", WNW: "西西北", NW: "西北", NNW: "北西北",
  };
  return (map[dir] || dir) + "风";
};

// 风速转换 (km/h → 风力等级)
const windSpeedToLevel = (kmph) => {
  // km/h 对应风力等级近似值
  const levels = [1, 6, 12, 20, 29, 39, 50, 62, 75, 89, 103, 117];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (kmph >= levels[i]) return i + 1;
  }
  return 0;
};

// 获取天气数据
const getWeatherData = async () => {
  try {
    const result = await getWttrWeather();
    console.log("天气结果:", result);
    if (result && result.current_condition) {
      const current = result.current_condition[0];
      const area = result.nearest_area?.[0];
      weatherData.adCode = {
        city: area?.areaName?.[0]?.value || "未知",
      };
      weatherData.weather = {
        weather: current.weatherDesc?.[0]?.value || "",
        temperature: current.temp_C,
        winddirection: windDirToChinese(current.winddir16Point || "N"),
        windpower: windSpeedToLevel(current.windspeedKmph || 0) + "级",
      };
    } else {
      throw "天气数据获取失败";
    }
  } catch (error) {
    console.error("天气信息获取失败:", error);
    onError("天气信息获取失败");
  }
};

// 报错信息
const onError = (message) => {
  ElMessage({
    message,
    icon: h(Error, {
      theme: "filled",
      fill: "#efefef",
    }),
  });
  console.error(message);
};

onMounted(() => {
  // 调用获取天气
  getWeatherData();
});
</script>
