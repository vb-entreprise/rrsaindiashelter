import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CasePapers from './pages/case-papers/CasePapers';
import CasePaperDetails from './pages/case-papers/CasePaperDetails';
import CreateCasePaper from './pages/case-papers/CreateCasePaper';
import EditCasePaper from './pages/case-papers/EditCasePaper';
import Feeding from './pages/feeding/Feeding';
import Cleaning from './pages/cleaning/Cleaning';
import Inventory from './pages/inventory/Inventory';
import Users from './pages/users/Users';
import Roles from './pages/roles/Roles';
import NotFound from './pages/NotFound';
import FeedingRecords from './pages/feeding/FeedingRecords';
import AddFeedingRecord from './pages/feeding/AddFeedingRecord';

// Protected route component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/case-papers" element={<CasePapers />} />
            <Route path="/case-papers/create" element={<CreateCasePaper />} />
            <Route path="/case-papers/:id" element={<CasePaperDetails />} />
            <Route path="/case-papers/:id/edit" element={<EditCasePaper />} />
            <Route path="/feeding" element={<Feeding />} />
            <Route path="/feeding/records" element={<FeedingRecords />} />
            <Route path="/feeding/add" element={<AddFeedingRecord />} />
            <Route path="/feeding/menu" element={<Feeding menuOnly={true} />} />
            <Route path="/cleaning" element={<Cleaning />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/users" element={<Users />} />
            <Route path="/roles" element={<Roles />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;