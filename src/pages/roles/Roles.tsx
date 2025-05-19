/**
 * Roles.tsx
 * @description Manages user roles and permissions in the system
 * @author VB Entreprise
 */

import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/apiClient';

interface Role {
  id: string;
  name: string;
}

interface Permission {
  id: string;
  name: string;
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase.from('roles').select('*');
      if (error) throw error;
      setRoles(data || []);
    } catch (err: any) {
      console.error('Error fetching roles:', err.message);
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase.from('permissions').select('*');
      if (error) throw error;
      setPermissions(data || []);
    } catch (err: any) {
      console.error('Error fetching permissions:', err.message);
    }
  };

  const fetchRolePermissions = async (roleId: string) => {
    try {
      const { data, error } = await supabase
        .from('permission_role')
        .select('permission_id')
        .eq('role_id', roleId);
      if (error) throw error;
      setRolePermissions(data?.map(p => p.permission_id) || []);
    } catch (err: any) {
      console.error('Error fetching role permissions:', err.message);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!roleName) {
      setError('Role name is required');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('roles')
        .insert([{ name: roleName, guard_name: 'web' }])
        .select()
        .single();
      if (error) throw error;
      setRoleName('');
      setShowCreate(false);
      setSuccess('Role created successfully');
      fetchRoles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    fetchRolePermissions(role.id);
    setSuccess(null);
    setError(null);
  };

  const handlePermissionChange = (permId: string) => {
    setRolePermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    setError(null);
    setSuccess(null);
    try {
      // Delete existing permissions
      const { error: deleteError } = await supabase
        .from('permission_role')
        .delete()
        .eq('role_id', selectedRole.id);
      if (deleteError) throw deleteError;

      // Insert new permissions
      if (rolePermissions.length > 0) {
        const { error: insertError } = await supabase
          .from('permission_role')
          .insert(
            rolePermissions.map(permId => ({
              role_id: selectedRole.id,
              permission_id: permId
            }))
          );
        if (insertError) throw insertError;
      }
      
      setSuccess('Permissions updated successfully');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteRole = async (role: Role) => {
    if (!window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) return;
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase
        .from('roles')
        .delete()
        .eq('id', role.id);
      if (error) throw error;
      setSuccess('Role deleted successfully');
      if (selectedRole?.id === role.id) setSelectedRole(null);
      fetchRoles();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Role Management</h1>
      <div className="mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => setShowCreate(true)}
        >
          + Create Role
        </button>
      </div>
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Roles</h2>
        <ul>
          {roles.map((role) => (
            <li key={role.id} className="mb-2 flex items-center">
              <button
                className={`px-3 py-1 rounded ${selectedRole?.id === role.id ? 'bg-green-200' : 'bg-gray-200'} hover:bg-green-100`}
                onClick={() => handleSelectRole(role)}
              >
                {role.name}
              </button>
              {role.name !== 'admin' && (
                <button
                  className="ml-2 px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs"
                  onClick={() => handleDeleteRole(role)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {selectedRole && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-2">Permissions for: {selectedRole.name}</h2>
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {permissions.map((perm) => (
              <label key={perm.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rolePermissions.includes(perm.id)}
                  onChange={() => handlePermissionChange(perm.id)}
                />
                <span>{perm.name}</span>
              </label>
            ))}
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSavePermissions}
          >
            Save Permissions
          </button>
          {success && <p className="text-green-600 mt-2">{success}</p>}
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      )}

      {/* Create Role Modal */}
      {showCreate && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Role</h2>
            <form onSubmit={handleCreateRole}>
              <input
                className="w-full mb-2 p-2 border rounded"
                placeholder="Role Name"
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
              />
              {error && <p className="text-red-500 mb-2">{error}</p>}
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
    </div>
  );
};

export default Roles;