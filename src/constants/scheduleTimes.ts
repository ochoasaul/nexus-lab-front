export interface ScheduleTime {
  id: string
  label: string
  startTime: string
  endTime: string
}

export const SCHEDULE_TIMES: ScheduleTime[] = [
  {
    id: '7:15-10:00',
    label: '7:15 - 10:00',
    startTime: '07:15',
    endTime: '10:00',
  },
  {
    id: '10:15-13:00',
    label: '10:15 - 13:00',
    startTime: '10:15',
    endTime: '13:00',
  },
  {
    id: '13:00-16:00',
    label: '13:00 - 16:00',
    startTime: '13:00',
    endTime: '16:00',
  },
  {
    id: '16:00-19:00',
    label: '16:00 - 19:00',
    startTime: '16:00',
    endTime: '19:00',
  },
  {
    id: '19:15-21:45',
    label: '19:15 - 21:45',
    startTime: '19:15',
    endTime: '21:45',
  },
]

