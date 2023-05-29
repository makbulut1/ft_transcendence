import dayjs from 'dayjs';

// ----------------------------------------------------------------------

export function fDate(date: Date, newFormat = 'DD MMM YYYY') {
  return date ? dayjs(date).format(newFormat) : '';
}

export function fDateTime(date: Date, newFormat = 'DD MMM YYYY HH:mm:ss') {
  return date ? dayjs(date).format(newFormat) : '';
}

export function fTime(date: Date) {
  return date ? dayjs(date).format('HH:mm:ss') : '';
}
