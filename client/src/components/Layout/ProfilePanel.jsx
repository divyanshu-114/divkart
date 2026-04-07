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
      <div
        className="fixed inset-0 bg-background/80 z-40 backdrop-blur-sm"
        onClick={() => dispatch(toggleAuthPopup())}
      />

      {/* panel */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 bg-background border-l border-border animate-slide-in-right overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border h-20">
          <h2 className="text-xl font-bold tracking-[0.2em] uppercase text-foreground">Profile</h2>
          <button onClick={() => dispatch(toggleAuthPopup())} className="p-2 text-foreground hover:opacity-60 transition-opacity">
            <X className="w-6 h-6" strokeWidth={1} />
          </button>
        </div>

        <div className="p-6">
          {/* user info */}
          <div className="text-center mb-10 mt-4">
            <img
              src={authUser.avatar?.url || "/avatar-holder.avif"}
              className="w-24 h-24 rounded-full mx-auto mb-4 border border-border object-cover"
            />
            <h3 className="font-bold text-sm tracking-widest uppercase mb-1">{authUser.name}</h3>
            <p className="text-xs tracking-widest uppercase text-muted-foreground">
              {authUser.email}
            </p>
          </div>

          {/* profile update */}
          <div className="space-y-4 mb-10 border-b border-border pb-8">
            <h3 className="font-bold text-xs tracking-widest uppercase mb-4 text-foreground/80">Update Info</h3>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="FULL NAME"
              className="w-full p-3 bg-secondary border border-transparent focus:border-foreground transition-colors text-xs tracking-widest font-semibold uppercase focus:outline-none"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL"
              className="w-full p-3 bg-secondary border border-transparent focus:border-foreground transition-colors text-xs tracking-widest font-semibold uppercase focus:outline-none"
            />

            <label className="flex items-center justify-center gap-2 p-3 border border-border hover:bg-secondary cursor-pointer transition-colors text-xs tracking-widest font-bold uppercase mt-2">
              <Upload size={14} strokeWidth={2} />
              Upload Avatar
              <input
                type="file"
                hidden
                onChange={(e) => setAvatar(e.target.files[0])}
              />
            </label>

            <button
              onClick={handleUpdateProfile}
              className="w-full p-4 bg-foreground text-background font-bold text-xs tracking-widest uppercase hover:opacity-80 transition-opacity mt-4"
            >
              {isUpdatingProfile ? "Updating..." : "Save Changes"}
            </button>
          </div>

          {/* password update */}
          <div className="space-y-4 mb-10 border-b border-border pb-8">
            <h3 className="font-bold text-xs tracking-widest uppercase mb-4 text-foreground/80">Security</h3>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="CURRENT PASSWORD"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 bg-secondary border border-transparent focus:border-foreground transition-colors text-xs tracking-widest font-semibold uppercase focus:outline-none"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="NEW PASSWORD"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-secondary border border-transparent focus:border-foreground transition-colors text-xs tracking-widest font-semibold uppercase focus:outline-none"
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="CONFIRM NEW PASSWORD"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="w-full p-3 bg-secondary border border-transparent focus:border-foreground transition-colors text-xs tracking-widest font-semibold uppercase focus:outline-none"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs uppercase tracking-widest font-bold text-foreground/60 flex items-center justify-end w-full gap-2 mt-2 hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
              {showPassword ? "Hide" : "Show"}
            </button>

            <button
              onClick={handleUpdatePassword}
              className="w-full p-4 border border-foreground font-bold text-xs tracking-widest uppercase hover:bg-foreground hover:text-background transition-colors mt-4"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </div>

          {/* logout */}
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center justify-center p-4 border border-red-500/30 text-red-500 font-bold text-xs tracking-widest uppercase hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut size={16} className="mr-2" strokeWidth={2} /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;
