import { useState } from "react";
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Camera, Save } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    position: "Senior Developer",
    joinDate: "January 2022"
  });

  const [formData, setFormData] = useState({ ...profileData });

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setProfileData({ ...formData });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <button
          onClick={handleEditToggle}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md text-sm font-medium transition-colors"
        >
          {isEditing ? (
            <>
              <Save size={16} />
              <span>Save Changes</span>
            </>
          ) : (
            <>
              <Edit2 size={16} />
              <span>Edit Profile</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-card rounded-lg border border-secondary/20 p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center text-white text-2xl font-medium">
              JD
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                <Camera size={16} />
              </button>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1">{profileData.name}</h2>
          <p className="text-gray-400 text-sm mb-4">{profileData.position}</p>
          
          <div className="w-full border-t border-secondary/20 pt-4 mt-2">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-300">{profileData.email}</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-300">{profileData.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-300">{profileData.location}</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-secondary/20 p-6">
          <h2 className="text-lg font-bold text-white mb-6">Personal Information</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-secondary/30 border border-secondary text-sm text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : (
                  <p className="text-white">{profileData.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-secondary/30 border border-secondary text-sm text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : (
                  <p className="text-white">{profileData.email}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-secondary/30 border border-secondary text-sm text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : (
                  <p className="text-white">{profileData.phone}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-secondary/30 border border-secondary text-sm text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : (
                  <p className="text-white">{profileData.location}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full bg-secondary/30 border border-secondary text-sm text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : (
                  <p className="text-white">{profileData.position}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Join Date</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="w-full bg-secondary/30 border border-secondary text-sm text-white rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : (
                  <p className="text-white">{profileData.joinDate}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-secondary/20">
            <h2 className="text-lg font-bold text-white mb-4">Activity</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-white">Completed monthly sales report</p>
                  <p className="text-xs text-gray-400">2 days ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-white">Started new project "E-commerce Dashboard"</p>
                  <p className="text-xs text-gray-400">1 week ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-white">Updated profile information</p>
                  <p className="text-xs text-gray-400">2 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 