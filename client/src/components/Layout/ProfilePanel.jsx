import { useEffect, useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  updateProfile,
  updatePassword,
} from "../../store/slices/authSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();

  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (state) => state.auth
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  useEffect(() => {
    if (authUser) {
      setName(authUser.name || "");
      setEmail(authUser.email || "");
      setAvatar(null);
    }
  }, [authUser]);


  if (!isAuthPopupOpen) return null;

  // ✅ loader instead of blank screen
  if (!authUser) {
    return (
      <>
        <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" />
        <div className="fixed right-0 top-0 h-full w-96 z-50 glass-panel flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full" />
        </div>
      </>
    );
  }

  const handleUpdateProfile = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);
    dispatch(updateProfile(formData));
  };

  const handleUpdatePassword = () => {
    const formData = new FormData();
    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", newPassword);
    formData.append("confirmNewPassword", confirmNewPassword);
    dispatch(updatePassword(formData));
  };

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
        onClick={() => dispatch(toggleAuthPopup())}
      />

      {/* panel */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 glass-panel overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Profile</h2>
          <button onClick={() => dispatch(toggleAuthPopup())}>
            <X />
          </button>
        </div>

        <div className="p-6">
          {/* user info */}
          <div className="text-center mb-6">
            <img
              src={authUser.avatar?.url || "/avatar-holder.avif"}
              className="w-20 h-20 rounded-full mx-auto mb-3"
            />
            <h3 className="font-semibold">{authUser.name}</h3>
            <p className="text-sm text-muted-foreground">
              {authUser.email}
            </p>
          </div>

          {/* profile update */}
          <div className="space-y-3 mb-8">
            <h3 className="font-semibold">Update Profile</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full p-2 rounded bg-secondary"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 rounded bg-secondary"
            />

            <label className="flex gap-2 text-sm cursor-pointer">
              <Upload size={16} />
              Upload Avatar
              <input
                type="file"
                hidden
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </label>

            <button
              onClick={handleUpdateProfile}
              className="w-full p-3 rounded glass-card"
            >
              {isUpdatingProfile ? "Updating..." : "Save Changes"}
            </button>
          </div>

          {/* password update */}
          <div className="space-y-3 mb-8">
            <h3 className="font-semibold">Update Password</h3>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 rounded bg-secondary"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 rounded bg-secondary"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-2 rounded bg-secondary"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs flex items-center gap-1"
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              {showPassword ? "Hide" : "Show"} Password
            </button>

            <button
              onClick={handleUpdatePassword}
              className="w-full p-3 rounded glass-card"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>

          {/* logout */}
          <button
            onClick={() => dispatch(logout())}
            className="w-full p-3 rounded glass-card text-red-500"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
