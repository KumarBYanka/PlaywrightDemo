import environment  from '../config/environment';

export const loginData = {
  validUser: {
    username: environment.user.username,
    password: environment.user.password
  },

  invalidUser: {
    username: 'invalid-user@trivium-esolutions.com',
    password: 'Wrong@1234'
  }
};