import React, { useState, useEffect, useMemo } from 'react';
import { Search, Shield, User as UserIcon, Trash2, Loader2, RefreshCw, Users } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array.from({ length: 5 }).map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-stone-200 rounded" />
      </td>
    ))}
  </tr>
);

const AdminUsers = () => {
  const [users, setUsers]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState('');
  const [updatingUserId, setUpdatingUserId] = useState(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers();
      const data = res.data?.data || res.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load registered users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = useMemo(() =>
    users.filter(u => {
      const name  = u.fullName || u.name || '';
      const email = u.email || '';
      const q     = searchTerm.toLowerCase();
      return name.toLowerCase().includes(q) || email.toLowerCase().includes(q);
    }),
    [users, searchTerm]
  );

  const handleToggleRole = async (user) => {
    try {
      setUpdatingUserId(user._id);
      setUsers(prev => prev.map(u =>
        u._id === user._id ? { ...u, role: u.role === 'admin' ? 'customer' : 'admin', isAdmin: u.role !== 'admin' } : u
      ));
      await adminAPI.toggleUserRole(user._id);
      const newRole = user.role === 'admin' ? 'Customer' : 'Admin';
      toast.success(`${user.fullName || user.name}'s role changed to ${newRole}`);
    } catch (error) {
      toast.error('Role update failed. Reverting…');
      fetchUsers();
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.fullName || user.name}'s account permanently?`)) return;
    try {
      setUpdatingUserId(user._id);
      await adminAPI.deleteUser(user._id);
      setUsers(prev => prev.filter(u => u._id !== user._id));
      toast.success('User account deleted');
    } catch {
      toast.error('Could not delete user account');
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeInUp">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-black">Users</h1>
          <p className="text-sm text-stone-500 mt-1">
            {users.length} registered users · Manage roles and accounts
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-black font-semibold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-black">Registered Users</h2>
            <p className="text-xs text-stone-400 mt-0.5">Manage permissions and account statuses</p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs text-black focus:outline-none focus:ring-2 focus:ring-[#C68B45] bg-stone-50 placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                <th className="p-4 pl-6">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center text-stone-400">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>No users found.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isAdmin   = user.role === 'admin' || user.isAdmin === true;
                  const userName  = user.fullName || user.name || 'Anonymous';
                  const joinedDate = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'N/A';

                  return (
                    <tr key={user._id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-amber-100 text-[#3D2817] flex items-center justify-center font-bold text-sm border border-amber-200 flex-shrink-0">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-black text-sm">{userName}</p>
                            <p className="text-xs text-stone-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Shield className="w-3 h-3 text-amber-600" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
                            <UserIcon className="w-3 h-3 text-stone-400" />
                            Customer
                          </span>
                        )}
                      </td>

                      <td className="p-4 font-bold text-black text-sm">
                        {user.orderCount ?? 0} {user.orderCount === 1 ? 'order' : 'orders'}
                      </td>

                      <td className="p-4 text-xs font-medium text-stone-500">
                        {joinedDate}
                      </td>

                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleRole(user)}
                            disabled={updatingUserId === user._id}
                            className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                          >
                            {updatingUserId === user._id ? 'Updating…' : 'Toggle Role'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            disabled={updatingUserId === user._id}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;