// 天气数据类型
export interface WeatherData {
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  description: string
  icon?: string
  location?: string
  timestamp?: Date
}

// 温度单位
export type TemperatureUnit = 'celsius' | 'fahrenheit'

// 风向类型
export interface WindData {
  speed: number
  direction: number
  gust?: number
}

// 组件主题类型
export type Theme = 'light' | 'dark'

// 组件尺寸类型
export type Size = 'small' | 'medium' | 'large'

// 天气状态类型
export type WeatherCondition =
  | 'sunny'
  | 'cloudy'
  | 'rainy'
  | 'snowy'
  | 'stormy'
  | 'foggy'
  | 'windy'
