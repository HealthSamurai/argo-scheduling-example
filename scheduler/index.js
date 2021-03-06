const aidbox = require('aidbox');

const { findAppointments, holdAppointment } = require('./appointment');
const { userSub } = require('./user');

var APP_ID = 'scheduler';

var ctx = {
  debug: true,
  env: {
    init_url: process.env.APP_INIT_URL,
    init_client_id: process.env.APP_CLIENT_ID,
    init_client_secret: process.env.APP_CLIENT_SECRET,

    app_id: APP_ID,
    app_url: process.env.APP_URL,
    app_port: process.env.APP_PORT,
    app_secret: process.env.APP_SECRET
  },
  manifest: {
    id: APP_ID,
    type: 'app',
    subscriptions: {
      User: {
        handler: userSub
      }
    },
    operations: {
      appointment_find: {
        method: 'GET',
        path: ['fhir', 'Appointment', '$find'],
        handler: findAppointments
      },
      appointment_hold: {
        method: 'POST',
        path: ['fhir', 'Appointment', '$hold'],
        handler: holdAppointment
      }
    }
  }
};

async function start() {
  console.log('try to register aidbox app');
  try {
    await aidbox.start(ctx);
    console.log('connected to aidbox');
  } catch (err) {
    aidbox.stop();
    console.log('Error:', err.body);
    setTimeout(() => {
      start();
    }, 5000);
  }
}

start();
