import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiBell, FiSave, FiEdit2, FiX, FiUpload } from 'react-icons/fi';

const ProfilePage = () => {
  // Sample user data - in a real app, this would come from your auth context or API
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'Admin',
    avatar: '',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [preview, setPreview] = useState('');

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('userProfile');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setFormData(JSON.parse(savedUser));
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle profile image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Save profile changes
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    const updatedUser = { ...formData };
    setUser(updatedUser);
    localStorage.setItem('userProfile', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  // Toggle edit mode
  const toggleEdit = () => {
    if (isEditing) {
      setFormData({ ...user }); // Reset form if canceling edit
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] w-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Profile Settings</h1>
              <p className="text-blue-100">Manage your account information and preferences</p>
            </div>
            <button
              onClick={toggleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              {isEditing ? (
                <>
                  <FiX size={18} />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <FiEdit2 size={18} />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Avatar */}
              <div className="md:col-span-1">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="w-40 h-40 mx-auto rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {preview || user.avatar ? (
                        <img 
                          src={preview || user.avatar} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiUser size={64} />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <FiUpload size={20} />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                  
                  {isEditing && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Click on the icon to upload a new profile picture
                    </p>
                  )}

                  {/* Notification Preferences */}
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FiBell className="text-blue-600" />
                      <span>Notification Preferences</span>
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(user.notifications || {}).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <label 
                            htmlFor={key}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize"
                          >
                            {key} notifications
                          </label>
                          <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input
                              type="checkbox"
                              id={key}
                              name={key}
                              checked={formData.notifications?.[key] || false}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                            />
                            <label 
                              htmlFor={key}
                              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.notifications?.[key] ? 'bg-blue-600' : 'bg-gray-300'}`}
                            ></label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="md:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white text-base">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Role
                    </label>
                    {isEditing ? (
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        disabled={!isEditing}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Technician">Technician</option>
                        <option value="Viewer">Viewer</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white text-base">{user.role}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        required
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white text-base">
                        <FiMail className="text-blue-600" />
                        <span>{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-900 dark:text-white text-base">
                        <FiPhone className="text-blue-600" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Fields */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Timezone
                      </label>
                      <select
                        id="timezone"
                        name="timezone"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        disabled={!isEditing}
                      >
                        <option value="UTC-05:00">(UTC-05:00) Eastern Time (US & Canada)</option>
                        <option value="UTC-06:00">(UTC-06:00) Central Time (US & Canada)</option>
                        <option value="UTC-07:00">(UTC-07:00) Mountain Time (US & Canada)</option>
                        <option value="UTC-08:00">(UTC-08:00) Pacific Time (US & Canada)</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preferred Language
                      </label>
                      <select
                        id="language"
                        name="language"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        disabled={!isEditing}
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="submit"
                      className="inline-flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium text-sm leading-tight rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      <FiSave className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
