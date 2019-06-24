import React from 'react';
import { withRouter, Link, matchPath } from 'react-router-dom';
import useStoreon from 'storeon/react';
import { Layout, Menu, Avatar } from 'antd';

const { Header } = Layout;

const menu = [{ url: '/', title: 'Appointment' }, { url: '/appointment/new', title: 'New Appointment' }];

const hasMatchRoute = (path, url) => {
  const m = matchPath(path, {
    path: url,
    exact: true,
    strict: false
  });
  return m && 'path' in m;
};

export default withRouter(({ history: { location: { pathname: path } } }) => {
  const { user } = useStoreon('user');
  return (
    <Header>
      <Menu
        theme="dark"
        mode="horizontal"
        selectable={false}
        style={{ lineHeight: '64px', display: 'flex' }}
      >
        {!user ? (
          <Menu.Item
            key="1"
            className={hasMatchRoute(path, '/') ? 'ant-menu-item-selected' : ''}
          >
            <Link to="/">Login</Link>
          </Menu.Item>
        ) : (
          menu.map((v, i) => (
            <Menu.Item
              key={i.toString()}
              className={
                hasMatchRoute(path, v.url) ? 'ant-menu-item-selected' : ''
              }
            >
              <Link to={v.url} />
              {v.title}
            </Menu.Item>
          ))
        )}
        {user && [
          <Menu.Item key="98" style={{ marginLeft: 'auto' }}>
            {user.photo && user.photo.length > 0 ? (
              <Avatar style={{ marginRight: 8 }} src={user.photo} />
            ) : (
              <Avatar style={{ marginRight: 8 }} icon="user" />
            )}
            {user.name && user.name.formatted}
          </Menu.Item>,
          <Menu.Item key="99">
            <Link to="/logout">Logout</Link>
          </Menu.Item>
        ]}
      </Menu>
    </Header>
  );
});
