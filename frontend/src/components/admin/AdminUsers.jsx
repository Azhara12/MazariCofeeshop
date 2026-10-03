import React, { useState } from 'react';
import { Search, Shield, User } from 'lucide-react';

const INITIAL_USERS = [
  { id: '1', name: 'Azhar Mahmood', email: 'azharmahmoodmazari@gmail.com', role: 'Admin', orders: 14, joined: 'May 2026' },
  { id: '2', name: 'John Doe', email: 'john@example.com', role: 'Customer', orders: 3, joined: 'Jun 2026' },
  { id: '3', name: 'Sarah Smith', email: 'sarah@example.com', role: 'Customer', orders: 8, joined: 'Jul 2026' }
];

const AdminUsers = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');

  const toggleRole = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, role: u.role === 'Admin' ? 'Customer' : 'Admin' };
      }
      return u;
    }));
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#3D2817]">Registered Users</h2>
        <p className="text-xs text-stone-500">Manage user permissions and account statuses</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-stone-400" />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-sm outline-none bg-transparent"
        />
      </div>

      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-100">
            <tr>
              <th className="p-4">USER</th>
              <th className="p-4">ROLE</th>
              <th className="p-4">ORDERS</th>
              <th className="p-4">JOINED</th>
              <th className="p-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-stone-50/50">
                <td className="p-4">
                  <p className="font-bold text-[#3D2817]">{user.name}</p>
                  <p className="text-xs text-stone-400">{user.email}</p>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${user.role === 'Admin' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'}`}>
                    {user.role === 'Admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="p-4 font-semibold text-[#3D2817]">{user.orders} orders</td>
                <td className="p-4 text-stone-500 text-xs">{user.joined}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => toggleRole(user.id)}
                    className="text-xs font-bold text-[#C68B45] hover:underline"
                  >
                    Toggle Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;