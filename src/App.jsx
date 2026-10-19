import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import { fetchMe, selectIsLoggedIn } from './store/authSlice';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import GuestRoute from './routes/GuestRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketsList from './pages/TicketsList';
import TicketDetails from './pages/TicketDetails';
import NewTicket from './pages/NewTicket';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // With a saved token - refresh the user details from the server
  useEffect(() => {
    if (isLoggedIn) dispatch(fetchMe());
  }, [isLoggedIn, dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketsList />} />
          <Route element={<RoleRoute allowedRoles={['customer']} />}>
            <Route path="/tickets/new" element={<NewTicket />} />
          </Route>
          <Route path="/tickets/:id" element={<TicketDetails />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
