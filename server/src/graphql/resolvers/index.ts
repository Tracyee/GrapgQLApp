import authResolver from './auth';
import eventResolver from './event';
import bookingResolver from './booking';

export default {
  ...authResolver,
  ...eventResolver,
  ...bookingResolver,
};
