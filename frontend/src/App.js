import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import io from 'socket.io-client';

import MainNavigation from './shared/components/Navigation/MainNavigation';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import './shared/util/cssHelpers.css'

const Reviews = React.lazy(() => import('./reviews/pages/Reviews'));
const AddReview = React.lazy(() => import('./user/pages/AddReview'));
const UserReviews = React.lazy(() => import('./user/pages/UserReviews'));
const UpdateUserReview = React.lazy(() => import('./user/pages/UpdateUserReview'));
const Auth = React.lazy(() => import('./user/pages/Auth'));


// ENDPOINT=https://reviewsapp-production.up.railway.app/ ? >

const socket = io.connect('https://reviewsapp-production.up.railway.app');
socket.emit("join_room", 'main_chat');
socket.emit("join_room", 'reviews_room');

const App = () => {
  const { token, login, logout, userId, userName, userImage } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Reviews socket={socket} />
        </Route>
        <Route path="/:userId/reviews" exact>
          <UserReviews socket={socket} />
        </Route>
        <Route path="/addreview" exact>
          <AddReview socket={socket} />
        </Route>
        <Route path="/reviews/:reviewId">
          <UpdateUserReview socket={socket} />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Reviews socket={socket} />
        </Route>
        <Route path="/addreview" exact>
          <AddReview socket={socket} />
        </Route>
        <Route path="/:userId/reviews" exact>
          <UserReviews socket={socket} />
        </Route>
        <Route path="/auth" exact>
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userName: userName,
        userImage: userImage,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={
            <div className='center'>
              <LoadingSpinner />
            </div>
          }>
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
