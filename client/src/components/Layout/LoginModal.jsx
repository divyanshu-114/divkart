import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { forgotPassword, login, register, resetPassword } from "../../store/slices/authSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {authUser, isSigningUp, isLoggingIn, isRequestingForToken} = useSelector((state) => state.auth);
  const {isAuthPopupOpen} = useSelector((state) => state.popup);

  const [mode, setMode] = useState('signin');  // signin | signup | reset-password | forgot-password

  const [formData , setFormData] = useState({
    name : '',
    email : '',
    password : '',
    confirmPassword : '',
    
  })

  // Detect reset password URL and open popup with reset mode

  useEffect(() => {
    if(location.pathname.startsWith("/password/reset")){
      setMode("reset");
      dispatch(toggleAuthPopup());
    }
  }, [location.pathname ,dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append('email', formData.email);
    data.append('password', formData.password);
    if(mode === "signup"){
      data.append('name', formData.name);
    }
    if(mode === 'forgot'){
      dispatch(forgotPassword({email: formData.email})).then(() => {
        dispatch(toggleAuthPopup());
        setMode('signin');
      });
      return;
    }
    if(mode === 'reset'){
      const token = location.pathname.split("/").pop();
      dispatch(resetPassword({token, password: formData.password, confirmPassword: formData.confirmPassword}))

      return;
    }

    if(mode==='signup'){
      dispatch(register(data))
    }else{
      dispatch(login(data))
    }

  }

  if(authUser){
    setFormData({name : "", email: "", password: "", confirmPassword: ""})
  }

  if(!isAuthPopupOpen || authUser) return null;

  let isLoading = isLoggingIn || isSigningUp || isRequestingForToken;



  return <>
  <div className="fixed inset-0 z-50 flex items-center justify-center ">
    {/* overlay */}
    <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]"/>
    <div className="relative z-10 glass-panel w-full max-w-md mx-4 animate-fade-in-up">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2l font-bold text-primary ">
          {
            mode === "reset" ? "Reset Password" : mode === "signup" ? "Create Account" : mode === "forgot" ? "Forgot Password" : "Welcome back"
          }
        </h2>
        <button onClick={()=>dispatch(toggleAuthPopup())} className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"><X className="w-5 h-5 text-primary"/></button>
      </div>
    </div>
  </div>
  
  </>;
};



export default LoginModal;

