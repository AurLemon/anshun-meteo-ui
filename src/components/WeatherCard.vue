<template>
  <div
    class="weather-card"
    :class="[`weather-card--${theme}`, `weather-card--${size}`]"
  >
    <div class="weather-card__header">
      <h3 class="weather-card__location">{{ location || '未知位置' }}</h3>
      <span class="weather-card__time">{{ formattedTime }}</span>
    </div>

    <div class="weather-card__main">
      <div class="weather-card__temperature">
        <span class="weather-card__temp-value">{{ displayTemperature }}</span>
        <span class="weather-card__temp-unit"
          >°{{ temperatureUnit === 'celsius' ? 'C' : 'F' }}</span
        >
      </div>

      <div class="weather-card__description">{{ description }}</div>
    </div>

    <div class="weather-card__details">
      <div class="weather-card__detail-item">
        <span class="weather-card__detail-label">湿度</span>
        <span class="weather-card__detail-value">{{ humidity }}%</span>
      </div>

      <div class="weather-card__detail-item">
        <span class="weather-card__detail-label">气压</span>
        <span class="weather-card__detail-value">{{ pressure }} hPa</span>
      </div>

      <div class="weather-card__detail-item">
        <span class="weather-card__detail-label">风速</span>
        <span class="weather-card__detail-value">{{ windSpeed }} m/s</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { WeatherData, TemperatureUnit, Theme, Size } from '../types'

interface Props {
  weatherData: WeatherData
  temperatureUnit?: TemperatureUnit
  theme?: Theme
  size?: Size
}

const props = withDefaults(defineProps<Props>(), {
  temperatureUnit: 'celsius',
  theme: 'light',
  size: 'medium',
})

// 计算属性
const displayTemperature = computed(() => {
  if (props.temperatureUnit === 'fahrenheit') {
    return Math.round((props.weatherData.temperature * 9) / 5 + 32)
  }
  return Math.round(props.weatherData.temperature)
})

const formattedTime = computed(() => {
  if (props.weatherData.timestamp) {
    return props.weatherData.timestamp.toLocaleTimeString()
  }
  return new Date().toLocaleTimeString()
})

// 解构天气数据
const { humidity, pressure, windSpeed, description, location } =
  props.weatherData
</script>

<style scoped>
.weather-card {
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.weather-card--light {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  color: white;
}

.weather-card--dark {
  background: linear-gradient(135deg, #2d3436 0%, #636e72 100%);
  color: white;
}

.weather-card--small {
  padding: 12px;
  font-size: 0.9em;
}

.weather-card--medium {
  padding: 20px;
}

.weather-card--large {
  padding: 28px;
  font-size: 1.1em;
}

.weather-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.weather-card__location {
  margin: 0;
  font-size: 1.2em;
  font-weight: 600;
}

.weather-card__time {
  opacity: 0.8;
  font-size: 0.9em;
}

.weather-card__main {
  text-align: center;
  margin-bottom: 20px;
}

.weather-card__temperature {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 8px;
}

.weather-card__temp-value {
  font-size: 3em;
  font-weight: 300;
  line-height: 1;
}

.weather-card__temp-unit {
  font-size: 1.2em;
  margin-left: 4px;
  opacity: 0.8;
}

.weather-card__description {
  font-size: 1.1em;
  opacity: 0.9;
  text-transform: capitalize;
}

.weather-card__details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 16px;
}

.weather-card__detail-item {
  text-align: center;
}

.weather-card__detail-label {
  display: block;
  font-size: 0.8em;
  opacity: 0.7;
  margin-bottom: 4px;
}

.weather-card__detail-value {
  display: block;
  font-weight: 600;
}

.weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}
</style>
