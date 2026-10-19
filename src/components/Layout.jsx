import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// Shared frame for all pages of a logged in user
function Layout() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
