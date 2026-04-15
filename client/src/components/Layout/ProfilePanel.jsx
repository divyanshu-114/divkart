import { useEffect, useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout, updateProfile, updatePassword } from "../../store/slices/authSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const { isAuthPopupOpen } = useSelector((state) => state.popup);
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector((state) => state.auth);

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

  if (!authUser) {
    return (
      <>
        <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
        <div className="fixed right-0 top-0 h-full w-96 z-50 bg-card border-l border-border flex items-center justify-center shadow-panel">
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

  const inputClass = "w-full px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 text-sm font-medium text-foreground placeholder-muted-foreground transition-all";

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={() => dispatch(toggleAuthPopup())}
      />

      {/* panel */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 bg-card border-l border-border animate-slide-in-right overflow-y-auto shadow-panel flex flex-col">

        {/* Header */}
        <div className="bg-brand-green px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-white" strokeWidth={2} />
            <h2 className="text-white font-bold text-base">My Profile</h2>
          </div>
          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Avatar */}
          <div className="text-center pt-2">
            <div className="relative inline-block">
              <img
                src={authUser.avatar?.url || "/avatar-holder.avif"}
                className="w-20 h-20 rounded-full mx-auto border-4 border-accent object-cover shadow-card"
                alt="avatar"
              />
            </div>
            <h3 className="font-bold text-base mt-3 text-foreground">{authUser.name}</h3>
            <p className="text-sm text-muted-foreground">{authUser.email}</p>
          </div>

          {/* Update Info */}
          <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-foreground mb-3">Update Info</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className={inputClass}
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className={inputClass}
            />
            <label className="flex items-center justify-center gap-2 px-4 py-3 border border-dashed border-border rounded-xl hover:border-primary/50 cursor-pointer transition-colors text-sm font-semibold text-muted-foreground hover:text-foreground">
              <Upload size={15} strokeWidth={2} />
              Upload Avatar
              <input type="file" hidden onChange={(e) => setAvatar(e.target.files[0])} />
            </label>
            <button
              onClick={handleUpdateProfile}
              className="w-full py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:bg-primary/90 transition-colors"
            >
              {isUpdatingProfile ? "Saving…" : "Save Changes"}
            </button>
          </div>

          {/* Security */}
          <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-foreground mb-3">Security</h3>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className={inputClass}
            />
            <div className="flex items-center justify-end">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <button
              onClick={handleUpdatePassword}
              className="w-full py-3 border-2 border-primary text-primary rounded-full font-bold text-sm hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {isUpdatingPassword ? "Updating…" : "Update Password"}
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center justify-center gap-2 py-3 border border-red-300 text-red-500 rounded-full font-bold text-sm hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
          >
            <LogOut size={15} strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
