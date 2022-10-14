import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const ProjectedRoutes = ({ auth, component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (auth) return <Component {...props} />;
        if (!auth) return <Redirect to={{ path: '/AlladinUI/' }} />;
      }}
    />
  );
};

export default ProjectedRoutes;
