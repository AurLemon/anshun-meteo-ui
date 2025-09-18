// 温度转换工具函数
export const convertTemperature = (
  temp: number,
  from: 'celsius' | 'fahrenheit',
  to: 'celsius' | 'fahrenheit',
): number => {
  if (from === to) return temp

  if (from === 'celsius' && to === 'fahrenheit') {
    return (temp * 9) / 5 + 32
  }

  if (from === 'fahrenheit' && to === 'celsius') {
    return ((temp - 32) * 5) / 9
  }

  return temp
}

// 风向角度转换为文字描述
export const getWindDirection = (degrees: number): string => {
  const directions = [
    '北',
    '北北东',
    '东北',
    '东北东',
    '东',
    '东南东',
    '东南',
    '南南东',
    '南',
    '南南西',
    '西南',
    '西南西',
    '西',
    '西北西',
    '西北',
    '北北西',
  ]

  const index = Math.round(degrees / 22.5) % 16
  return directions[index] || '北'
}

// 格式化时间
export const formatTime = (
  date: Date,
  format: 'time' | 'date' | 'datetime' = 'time',
): string => {
  switch (format) {
    case 'time':
      return date.toLocaleTimeString()
    case 'date':
      return date.toLocaleDateString()
    case 'datetime':
      return date.toLocaleString()
    default:
      return date.toLocaleTimeString()
  }
}

// 天气状态映射
export const getWeatherIcon = (condition: string): string => {
  const iconMap: Record<string, string> = {
    sunny: '☀️',
    cloudy: '☁️',
    rainy: '🌧️',
    snowy: '❄️',
    stormy: '⛈️',
    foggy: '🌫️',
    windy: '💨',
  }

  return iconMap[condition.toLowerCase()] || '🌤️'
}
