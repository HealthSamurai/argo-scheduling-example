import { site_url } from '../config';
import { history } from '../';

const defaultState = {
  appointments: {
    loading: false,
    error: null,
    list: []
  },
  create: {
    loading: true,
    error: null,
    specialtyList: [],
    start: null,
    end: null,
    specialty: null,
    visitType: null,
    list: []
  }
};

const appointment = store => {
  store.on('@init', () => defaultState);
  // Create new appointment
  store.on('appointment/get-specialty', async ({ create }) => {
    store.dispatch('appointment/new-error-create', null);
    const { token } = store.get();
    const res = await fetch(`${site_url}/PractitionerRole`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    if (res.status !== 200) {
      store.dispatch('appointment/new-error-create', 'Error getting specialty');
      return;
    }
    store.dispatch(
      'appointment/new-specialty',
      data.entry.map(v => v.resource)
    );
  });

  store.on('appointment/new-loading', ({ create }) => ({
    create: { ...create, loading: !create.loading }
  }));

  store.on('appointment/new-error-create', ({ create }, error) => {
    return { create: { ...create, error } };
  });

  store.on('appointment/new-specialty', ({ create }, specialtyList) => {
    return { create: { ...create, specialtyList, loading: false } };
  });

  store.on('appointment/$find', async (state, params) => {
    store.dispatch('appointment/new-loading');
    const { token } = store.get();
    const q = `start=${params.start}&end=${params.end}&specialty=${
      params.specialty
    }&visit-type=${params['visit-type']}`;
    const res = await fetch(`${site_url}/fhir/Appointment/$find?${q}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await res.json();
    if (res.status !== 200 || data.error) {
      store.dispatch(
        'appointment/new-error-create',
        'Error search appointments'
      );
      return;
    }
    store.dispatch('appointment/new-setList', data.entry.map(v => v.resource));
    store.dispatch('appointment/new-loading');
  });

  store.on('appointment/new-setList', ({ create }, list) => ({
    create: { ...create, list }
  }));

  store.on('appointment/$hold', async (state, params) => {
    store.dispatch('appointment/new-loading');
    const { token } = store.get();
    const res = await fetch(`${site_url}/fhir/Appointment/$hold`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    if (res.status !== 200) {
      store.dispatch(
        'appointment/new-error-create',
        'Error on Appointment/$hold'
      );
      return;
    }
    store.dispatch('appointment/new-setList', []);
    store.dispatch('appointment/new-loading');
    history.push('/');
  });

  // Get appointment list
  store.on('appointment/get', async () => {
    store.dispatch('appointment/error', null);
    store.dispatch('appointment/loading');
    const { token, user } = store.get();
    if (!user.data || !user.data.patient_id) {
      store.dispatch('appointment/error', "Patient isn't linked");
      store.dispatch('appointment/loading');
      return;
    }
    const res = await fetch(
      `${site_url}/fhir/Patient/${user.data.patient_id}/Appointment?_sort=-.start`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json'
        }
      }
    );
    const data = await res.json();
    store.dispatch('appointment/loading');
    if (res.status !== 200) {
      store.dispatch('appointment/error', data.error);
    } else {
      store.dispatch('appointment/set', data.entry.map(v => v.resource));
    }
  });

  store.on('appointment/set', ({ appointments }, list) => ({
    appointments: { ...appointments, list }
  }));

  store.on('appointment/loading', ({ appointments }) => ({
    appointments: { ...appointments, loading: !appointments.loading }
  }));

  store.on('appointment/error', ({ appointments }, error) => ({
    appointments: { ...appointments, error }
  }));
};

export default appointment;
