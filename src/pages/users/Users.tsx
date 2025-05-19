/**
 * Users.tsx
 * @description Users management page component for the admin dashboard
 * @author VB Entreprise
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/apiClient';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

interface Role {
  id: string;
  name: string;
}

const initialForm = { name: '', email: '', phone: '', password: '', role_id: '' };

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState<any>(initialForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          role_user (
            role:roles(name)
          )
        `);
      if (error) throw error;
      
      const formattedUsers = data?.map(user => ({
        ...user,
        role: user.role_user?.[0]?.role?.name
      })) || [];
      
      setUsers(formattedUsers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase.from('roles').select('*');
      if (error) throw error;
      setRoles(data || []);
    } catch (err: any) {
      console.error('Error fetching roles:', err.message);
    }
  };

  useEffect(() => { fetchUsers(); fetchRoles(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name || !form.email || !form.phone || !form.password || !form.role_id) {
      setFormError('All fields are required');
      return;
    }
    try {
      // Create user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([{
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password // Note: In a real app, password should be hashed
        }])
        .select()
        .single();
      
      if (userError) throw userError;

      // Assign role
      const { error: roleError } = await supabase
        .from('role_user')
        .insert([{
          user_id: userData.id,
          role_id: form.role_id
        }]);
      
      if (roleError) throw roleError;

      setShowCreate(false);
      setForm(initialForm);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleEdit = (user: User) => {
    setEditId(user.id);
    setForm({ ...user, password: '', role_id: '' });
    setShowEdit(true);
    setFormError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name || !form.email || !form.phone || !form.role_id) {
      setFormError('All fields are required');
      return;
    }
    try {
      // Update user
      const { error: userError } = await supabase
        .from('users')
        .update({
          name: form.name,
          email: form.email,
          phone: form.phone,
        })
        .eq('id', editId);
      
      if (userError) throw userError;

      // Update role
      const { error: roleDeleteError } = await supabase
        .from('role_user')
        .delete()
        .eq('user_id', editId);
      
      if (roleDeleteError) throw roleDeleteError;

      const { error: roleInsertError } = await supabase
        .from('role_user')
        .insert([{
          user_id: editId,
          role_id: form.role_id
        }]);
      
      if (roleInsertError) throw roleInsertError;

      setShowEdit(false);
      setEditId(null);
      setForm(initialForm);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);
      if (error) throw error;
      fetchUsers();
    } catch (err: any) {
      alert('Failed to delete user');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Users Management</h1>
      <div className="mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => { setShowCreate(true); setForm(initialForm); setFormError(null); }}
        >
          + Create User
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.role || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => handleEdit(user)}
                    >Edit</button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteUser(user.id)}
                    >Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Create User Modal */}
      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create User</h2>
            <form onSubmit={handleCreate}>
              <input
                className="w-full mb-2 p-2 border rounded"
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full mb-2 p-2 border rounded"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="w-full mb-2 p-2 border rounded"
                placeholder="Phone"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
              <input
                className="w-full mb-2 p-2 border rounded"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
              />
              <select
                className="w-full mb-2 p-2 border rounded"
                value={form.role_id}
                onChange={e => setForm({ ...form, role_id: e.target.value })}
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {formError && <p className="text-red-500 mb-2">{formError}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowCreate(false)}
                >Cancel</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleUpdate}>
              <input
                className="w-full mb-2 p-2 border rounded"
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="w-full mb-2 p-2 border rounded"
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="w-full mb-2 p-2 border rounded"
                placeholder="Phone"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
              />
              <select
                className="w-full mb-2 p-2 border rounded"
                value={form.role_id}
                onChange={e => setForm({ ...form, role_id: e.target.value })}
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {formError && <p className="text-red-500 mb-2">{formError}</p>}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowEdit(false)}
                >Cancel</button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;