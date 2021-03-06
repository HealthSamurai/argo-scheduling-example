import React, { useEffect, useState } from 'react';
import useStoreon from 'storeon/react';

import { parse } from 'qs';

import { history } from '../';

import { site_url, client_id } from '../config';

export const Logout = () => {
  const [error, setError] = useState(null);
  const { dispatch, token } = useStoreon('token');
  useEffect(() => {
    const getData = async () => {
      const res = await fetch(`${site_url}/Session`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/json'
        }
      });
      const data = await res.json();
      dispatch('user/set-user-token', { token: null, user: null });
      if (res.status !== 200) {
        setError(data.message);
      } else {
        history.push('/');
      }
    };
    getData();
    return () => {};
  }, [token, dispatch]);

  if (error) {
    return <div>Logout error: {error}</div>;
  }
  return <div>Logout in process</div>;
};

export default ({ location: { search } }) => {
  const [error, setError] = useState(null);
  const { dispatch, user } = useStoreon('user');
  useEffect(() => {
    const { code } = parse(search.slice(1));
    const getData = async () => {
      const res = await fetch(`${site_url}/auth/token`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          client_id,
          code,
          grant_type: 'authorization_code',
          audience: site_url
        })
      });
      const data = await res.json();
      if (res.status !== 200) {
        console.log(data);
        setError(data.error_description);
      } else {
        dispatch('user/set-user-token', {
          token: data.access_token,
          user: data.userinfo
        });
        history.push('/');
      }
    };
    getData();
    return () => {};
  }, [search, dispatch]);
  if (user) {
    const {
      name: { formatted: name }
    } = user;
    return <div>Welcome {name}</div>;
  }
  if (error) {
    return <div>Auth error: {error}</div>;
  }
  return <div>Auth in process</div>;
};
