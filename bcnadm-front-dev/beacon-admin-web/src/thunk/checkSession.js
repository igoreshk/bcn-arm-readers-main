import PingService from 'src/service/PingService';

export function checkSession() {
  if (process.env.NODE_ENV === 'development') {
    return Promise.resolve();
  }

  return PingService.ping();
}
