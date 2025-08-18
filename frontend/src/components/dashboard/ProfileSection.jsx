import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Lock,
  FileEdit,
  EyeOff,
  Eye as EyeIcon,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ProfileSection({
  profileData,
  isEditingProfile,
  isSavingProfile,
  showPasswordChange,
  passwordData,
  showPasswords,
  isChangingPassword,
  onProfileInputChange,
  onSaveProfile,
  onCancelEdit,
  onPasswordInputChange,
  onTogglePasswordVisibility,
  onChangePassword,
  onCancelPasswordChange
}) {
  return (
    <div className="space-y-8">
      <Card className="bg-white shadow-xl border-0 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-black to-gray-900 text-white p-8">
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="w-10 h-10 bg-[#f7e833] rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-black" />
            </div>
            <span>Profile Management</span>
          </CardTitle>
          <p className="text-gray-300 mt-2">
            Manage your account information and preferences
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="text-center space-y-4">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-[#f7e833] ring-opacity-30 mx-auto">
                    <img
                      src={profileData.avatar}
                      alt={profileData.fullname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditingProfile && (
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#f7e833] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                      <FileEdit className="w-5 h-5 text-black" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{profileData.fullname}</h3>
                  <p className="text-gray-500">{profileData.company}</p>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                  {isEditingProfile ? (
                    <Input
                      value={profileData.fullname}
                      onChange={(e) => onProfileInputChange('fullname', e.target.value)}
                      className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#f7e833] focus:outline-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                      {profileData.fullname}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Email Address</Label>
                  {isEditingProfile ? (
                    <Input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => onProfileInputChange('email', e.target.value)}
                      className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#f7e833] focus:outline-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                      {profileData.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Phone Number</Label>
                  {isEditingProfile ? (
                    <Input
                      type="tel"
                      value={profileData.phone_number}
                      onChange={(e) => onProfileInputChange('phone_number', e.target.value)}
                      className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#f7e833] focus:outline-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                      {profileData.phone_number || 'Not provided'}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Company</Label>
                  {isEditingProfile ? (
                    <Input
                      value={profileData.company}
                      onChange={(e) => onProfileInputChange('company', e.target.value)}
                      className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#f7e833] focus:outline-none"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                      {profileData.company}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Address</Label>
                {isEditingProfile ? (
                  <Input
                    value={profileData.address}
                    onChange={(e) => onProfileInputChange('address', e.target.value)}
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-[#f7e833] focus:outline-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                    {profileData.address || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Password Change Section - Inline Expandable */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  onClick={() => onProfileInputChange('showPasswordChange', !showPasswordChange)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                      <Lock className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-500">Update your account password for enhanced security</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {showPasswordChange && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                        Active
                      </span>
                    )}
                    {showPasswordChange ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                    )}
                  </div>
                </button>

                {/* Password Change Form - Expandable */}
                {showPasswordChange && (
                  <div className="mt-4 p-6 bg-red-50 border border-red-200 rounded-2xl space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Current Password</Label>
                        <div className="relative">
                          <Input
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => onPasswordInputChange('currentPassword', e.target.value)}
                            className="border-2 border-red-200 rounded-xl px-4 py-3 pr-12 focus:border-red-400 focus:outline-none bg-white"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => onTogglePasswordVisibility('current')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">New Password</Label>
                        <div className="relative">
                          <Input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => onPasswordInputChange('newPassword', e.target.value)}
                            className="border-2 border-red-200 rounded-xl px-4 py-3 pr-12 focus:border-red-400 focus:outline-none bg-white"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => onTogglePasswordVisibility('new')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) => onPasswordInputChange('confirmPassword', e.target.value)}
                          className="border-2 border-red-200 rounded-xl px-4 py-3 pr-12 focus:border-red-400 focus:outline-none bg-white"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => onTogglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        onClick={onChangePassword}
                        disabled={isChangingPassword}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        {isChangingPassword ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Updating...
                          </div>
                        ) : (
                          'Update Password'
                        )}
                      </Button>
                      <Button
                        onClick={onCancelPasswordChange}
                        variant="outline"
                        className="border-2 border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!isEditingProfile && (
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    onClick={() => onProfileInputChange('isEditingProfile', true)}
                    className="flex-1 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-200"
                  >
                    Edit Profile
                  </Button>
                </div>
              )}

              {isEditingProfile && (
                <div className="flex space-x-4 pt-6 border-t border-gray-200">
                  <Button
                    onClick={onSaveProfile}
                    disabled={isSavingProfile}
                    className="flex-1 bg-[#f7e833] hover:bg-yellow-400 text-black px-6 py-3 rounded-2xl font-semibold transition-all duration-200"
                  >
                    {isSavingProfile ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button
                    onClick={onCancelEdit}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-2xl font-semibold transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
