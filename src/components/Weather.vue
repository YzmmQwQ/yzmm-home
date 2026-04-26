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
import { getUapiWeather } from "@/api";
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

// 获取天气数据
const getWeatherData = async () => {
  try {
    const result = await getUapiWeather();
    console.log("天气结果:", result);
    if (result && result.city) {
      weatherData.adCode = {
        city: result.city,
      };
      weatherData.weather = {
        weather: result.weather,
        temperature: result.temperature,
        winddirection: result.wind_direction?.replace("风", "") || "",
        windpower: result.wind_power?.replace("级", "") || "",
      };
    } else {
      throw "天气数据获取失败";
    }
  } catch (error) {
    console.error("天气信息获取失败:" + error);
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
