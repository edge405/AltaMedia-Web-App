import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  Plus,
  UserPlus,
  UserMinus,
  Shield,
  Crown,
  User,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

const CompanyUserManagement = ({ company, onUpdate }) => {
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const [userFormData, setUserFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member'
  });

  const availableRoles = [
    { value: 'owner', label: 'Owner', icon: Crown, color: 'bg-purple-500', description: 'Full access to everything' },
    { value: 'admin', label: 'Admin', icon: Shield, color: 'bg-blue-500', description: 'Manage company' },
    // { value: 'manager', label: 'Manager', icon: Users, color: 'bg-green-500', description: 'Manage products and projects' },
    // { value: 'member', label: 'Member', icon: User, color: 'bg-gray-500', description: 'View and basic access' }
  ];

  useEffect(() => {
    loadCompanyUsers();
  }, [company]);

  const loadCompanyUsers = () => {
    const savedUsers = localStorage.getItem(`company_users_${company.id}`);
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with owner (current user)
      const ownerUser = {
        id: Date.now(),
        name: 'You',
        email: 'your-email@example.com',
        phone: '',
        role: 'owner',
        joinedAt: new Date().toISOString(),
        isActive: true
      };
      setUsers([ownerUser]);
      localStorage.setItem(`company_users_${company.id}`, JSON.stringify([ownerUser]));
    }
  };

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUserFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddUser = () => {
    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    const newUser = {
      id: Date.now(),
      ...userFormData,
      joinedAt: new Date().toISOString(),
      isActive: true
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem(`company_users_${company.id}`, JSON.stringify(updatedUsers));

    setUserFormData({
      name: '',
      email: '',
      phone: '',
      role: 'member'
    });
    setShowAddUserModal(false);
    toast.success('User added successfully!');
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
    });
    setShowAddUserModal(true);
  };

  const handleUpdateUser = () => {
    if (!userFormData.name.trim() || !userFormData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    const updatedUsers = users.map(user =>
      user.id === editingUser.id
        ? { ...user, ...userFormData }
        : user
    );

    setUsers(updatedUsers);
    localStorage.setItem(`company_users_${company.id}`, JSON.stringify(updatedUsers));

    setUserFormData({
      name: '',
      email: '',
      phone: '',
      role: 'member'
    });
    setEditingUser(null);
    setShowAddUserModal(false);
    toast.success('User updated successfully!');
  };

  const handleRemoveUser = (userId) => {
    const userToRemove = users.find(u => u.id === userId);
    if (userToRemove.role === 'owner') {
      toast.error('Cannot remove the owner from the company');
      return;
    }

    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem(`company_users_${company.id}`, JSON.stringify(updatedUsers));
    toast.success('User removed successfully!');
  };

  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem(`company_users_${company.id}`, JSON.stringify(updatedUsers));
    toast.success('User role updated!');
  };

  const getRoleInfo = (role) => {
    return availableRoles.find(r => r.value === role) || availableRoles[3];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Company Users
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage who has access to {company.name}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setUserFormData({
              name: '',
              email: '',
              phone: '',
              role: 'member'
            });
            setShowAddUserModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Users List */}
      <div className="grid gap-4">
        {users.map((user) => {
          const roleInfo = getRoleInfo(user.role);
          const RoleIcon = roleInfo.icon;

          return (
            <Card key={user.id} className="bg-white dark:bg-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 ${roleInfo.color} rounded-lg flex items-center justify-center`}>
                      <RoleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {user.name}
                        </h3>
                        <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                          {roleInfo.label}
                        </Badge>
                        {user.role === 'owner' && (
                          <Badge variant="outline" className="text-purple-600 border-purple-600">
                            Owner
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {user.phone}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Joined {new Date(user.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {user.role !== 'owner' && (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleRemoveUser(user.id)}
                              className="text-red-600"
                            >
                              <UserMinus className="w-4 h-4 mr-2" />
                              Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {editingUser ? 'Edit User' : 'Add New User'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={userFormData.name}
                    onChange={handleUserInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userFormData.email}
                    onChange={handleUserInputChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={userFormData.phone}
                    onChange={handleUserInputChange}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    name="role"
                    value={userFormData.role}
                    onChange={handleUserInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    {availableRoles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label} - {role.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setEditingUser(null);
                    setUserFormData({
                      name: '',
                      email: '',
                      phone: '',
                      role: 'member'
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={editingUser ? handleUpdateUser : handleAddUser}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CompanyUserManagement;
