import dayjs, { type Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import type { TimeValue, TimeRange, TimeMark, ValidationResult } from '../types/timeline'

// 扩展 dayjs 插件
dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * 时间工具类
 */
export class TimeUtils {
  /**
   * 将任意时间值转换为 Dayjs 对象
   */
  static toDayjs(value: TimeValue): Dayjs {
    if (dayjs.isDayjs(value)) {
      return value
    }

    // 检查是否为 TimeRange 对象（错误传入）
    if (typeof value === 'object' && value !== null && 'start' in value && 'end' in value) {
      console.warn('TimeRange object passed to toDayjs, using current time as fallback:', value)
      return dayjs()
    }

    // 检查是否为无效值（如 "M2" 等）
    if (value === null || value === undefined || value === '' ||
        (typeof value === 'string' && (value.trim() === '' || value === 'M2' || !/^[\d\-T:\s\.Z]+/.test(value)))) {
      console.warn('Invalid time value detected, using current time as fallback:', value)
      return dayjs()
    }

    if (typeof value === 'number') {
      // 判断是否为 Unix 时间戳（秒）
      if (value < 1e10) {
        return dayjs.unix(value)
      }
      // 毫秒时间戳
      return dayjs(value)
    }

    const result = dayjs(value)
    // 如果解析结果无效，返回当前时间
    if (!result.isValid()) {
      console.warn('Failed to parse time value, using current time as fallback:', value)
      return dayjs()
    }

    return result
  }

  /**
   * 验证时间值是否有效
   */
  static validateTimeValue(value: TimeValue): ValidationResult {
    try {
      const dayjsValue = this.toDayjs(value)
      if (!dayjsValue.isValid()) {
        return { valid: false, error: 'Invalid date format' }
      }
      return { valid: true }
    } catch (error) {
      return { valid: false, error: 'Failed to parse date' }
    }
  }

  /**
   * 验证时间范围是否有效
   */
  static validateTimeRange(range: TimeRange): ValidationResult {
    const startResult = this.validateTimeValue(range.start)
    if (!startResult.valid) {
      return { valid: false, error: `Invalid start time: ${startResult.error}` }
    }

    const endResult = this.validateTimeValue(range.end)
    if (!endResult.valid) {
      return { valid: false, error: `Invalid end time: ${endResult.error}` }
    }

    const start = this.toDayjs(range.start)
    const end = this.toDayjs(range.end)

    if (start.isAfter(end)) {
      return { valid: false, error: 'Start time must be before end time' }
    }

    return { valid: true }
  }

  /**
   * 格式化时间值
   */
  static formatTime(value: TimeValue, format = 'YYYY-MM-DD HH:mm:ss'): string {
    return this.toDayjs(value).format(format)
  }

  /**
   * 获取时间的日期类型
   */
  static getDateType(time: TimeValue): 'yesterday' | 'today' | 'tomorrow' | 'other' {
    const target = this.toDayjs(time)
    const today = dayjs()
    
    if (target.isSame(today, 'day')) {
      return 'today'
    } else if (target.isSame(today.subtract(1, 'day'), 'day')) {
      return 'yesterday'
    } else if (target.isSame(today.add(1, 'day'), 'day')) {
      return 'tomorrow'
    } else {
      return 'other'
    }
  }

  /**
   * 生成时间刻度标记
   */
  static generateTimeMarks(
    start: TimeValue,
    end: TimeValue,
    step: number
  ): TimeMark[] {
    const startTime = this.toDayjs(start)
    const endTime = this.toDayjs(end)
    const marks: TimeMark[] = []

    const totalMinutes = endTime.diff(startTime, 'minute')
    let current = startTime

    while (current.isBefore(endTime) || current.isSame(endTime)) {
      const position = (current.diff(startTime, 'minute') / totalMinutes) * 100
      const dateType = this.getDateType(current)

      marks.push({
        time: current,
        label: this.getTimeLabel(current, step),
        position,
        major: this.isMajorMark(current, step),
        isToday: dateType === 'today',
        dateType
      })

      current = current.add(step, 'minute')
    }

    return marks
  }

  /**
   * 获取时间标签
   */
  private static getTimeLabel(time: Dayjs, step: number): string {
    // 根据步长决定显示格式
    if (step >= 60) {
      // 大于等于1小时，显示小时
      return time.format('HH:mm')
    } else if (step >= 1) {
      // 大于等于1分钟，显示分钟
      return time.format('HH:mm')
    } else {
      // 小于1分钟，显示秒
      return time.format('HH:mm:ss')
    }
  }

  /**
   * 判断是否为主要刻度
   */
  private static isMajorMark(time: Dayjs, step: number): boolean {
    if (step >= 60) {
      // 步长大于等于1小时，整点为主要刻度
      return time.minute() === 0
    } else if (step >= 15) {
      // 步长大于等于15分钟，每小时的0、15、30、45分为主要刻度
      return time.minute() % 15 === 0
    } else {
      // 其他情况，每10分钟为主要刻度
      return time.minute() % 10 === 0
    }
  }

  /**
   * 计算时间在时间轴上的位置百分比
   */
  static calculatePosition(
    time: TimeValue,
    start: TimeValue,
    end: TimeValue
  ): number {
    const targetTime = this.toDayjs(time)
    const startTime = this.toDayjs(start)
    const endTime = this.toDayjs(end)
    
    const totalDuration = endTime.diff(startTime)
    const currentDuration = targetTime.diff(startTime)
    
    return Math.max(0, Math.min(100, (currentDuration / totalDuration) * 100))
  }

  /**
   * 根据位置百分比计算时间
   */
  static calculateTimeFromPosition(
    position: number,
    start: TimeValue,
    end: TimeValue
  ): Dayjs {
    try {
      const startTime = this.toDayjs(start)
      const endTime = this.toDayjs(end)

      // 验证时间范围是否有效
      if (!startTime.isValid() || !endTime.isValid()) {
        throw new Error('Invalid start or end time')
      }

      const totalDuration = endTime.diff(startTime)
      if (totalDuration <= 0) {
        throw new Error('Invalid time range: end time must be after start time')
      }

      const targetDuration = (position / 100) * totalDuration
      return startTime.add(targetDuration, 'millisecond')
    } catch (error) {
      console.warn('Error in calculateTimeFromPosition, using current time:', error)
      return dayjs()
    }
  }

  /**
   * 对齐时间到指定步长
   */
  static alignToStep(time: TimeValue, step: number): Dayjs {
    const target = this.toDayjs(time)

    // 将时间转换为从当天开始的总分钟数
    const totalMinutes = target.hour() * 60 + target.minute()

    // 按步长对齐
    const alignedMinutes = Math.round(totalMinutes / step) * step

    // 转换回小时和分钟
    const alignedHours = Math.floor(alignedMinutes / 60)
    const remainingMinutes = alignedMinutes % 60

    // 返回对齐后的时间
    return target.startOf('day').add(alignedHours, 'hour').add(remainingMinutes, 'minute')
  }

  /**
   * 获取时间范围的显示范围
   */
  static getDisplayRange(
    center: TimeValue,
    totalHours = 24
  ): { start: Dayjs; end: Dayjs } {
    try {
      const centerTime = this.toDayjs(center)
      const halfHours = totalHours / 2

      return {
        start: centerTime.subtract(halfHours, 'hour').startOf('hour'),
        end: centerTime.add(halfHours, 'hour').startOf('hour')
      }
    } catch (error) {
      console.warn('Error in getDisplayRange, using current time:', error)
      const now = dayjs()
      const halfHours = totalHours / 2

      return {
        start: now.subtract(halfHours, 'hour').startOf('hour'),
        end: now.add(halfHours, 'hour').startOf('hour')
      }
    }
  }

  /**
   * 检查是否跨日期
   */
  static isCrossDate(start: TimeValue, end: TimeValue): boolean {
    const startTime = this.toDayjs(start)
    const endTime = this.toDayjs(end)
    
    return !startTime.isSame(endTime, 'day')
  }

  /**
   * 获取日期过渡点
   */
  static getDateTransitions(
    start: TimeValue,
    end: TimeValue
  ): Array<{ time: Dayjs; type: 'day-start' | 'day-end' }> {
    const startTime = this.toDayjs(start)
    const endTime = this.toDayjs(end)
    const transitions: Array<{ time: Dayjs; type: 'day-start' | 'day-end' }> = []
    
    let current = startTime.startOf('day')
    
    while (current.isBefore(endTime)) {
      if (current.isAfter(startTime)) {
        transitions.push({ time: current, type: 'day-start' })
      }
      
      const dayEnd = current.endOf('day')
      if (dayEnd.isBefore(endTime) && dayEnd.isAfter(startTime)) {
        transitions.push({ time: dayEnd, type: 'day-end' })
      }
      
      current = current.add(1, 'day').startOf('day')
    }
    
    return transitions
  }

  /**
   * 标准化时间范围
   */
  static normalizeTimeRange(range: TimeRange): TimeRange {
    const start = this.toDayjs(range.start)
    const end = this.toDayjs(range.end)
    
    // 确保开始时间在结束时间之前
    if (start.isAfter(end)) {
      return { start: end, end: start }
    }
    
    return { start, end }
  }

  /**
   * 获取当前时间
   */
  static now(): Dayjs {
    return dayjs()
  }

  /**
   * 获取今天的开始时间
   */
  static startOfToday(): Dayjs {
    return dayjs().startOf('day')
  }

  /**
   * 获取今天的结束时间
   */
  static endOfToday(): Dayjs {
    return dayjs().endOf('day')
  }
}
