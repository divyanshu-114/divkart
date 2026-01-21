import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../../store/slices/authSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    authUser,
    isSigningUp,
    isLoggingIn,
    isRequestingForToken,
    isUpdatingPassword,
  } = useSelector((state) => state.auth);

  const { isAuthPopupOpen } = useSelector((state) => state.popup);

  const [mode, setMode] = useState("signin"); 
  // signin | signup | forgot | reset

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* ================= RESET PASSWORD URL ================= */
  useEffect(() => {
    if (location.pathname.startsWith("/password/reset")) {
      setMode("reset");
      dispatch(toggleAuthPopup());
    }
  }, [location.pathname, dispatch]);

  /* ================= CLEAR FORM AFTER LOGIN ================= */
  useEffect(() => {
    if (authUser) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [authUser]);

  /* ================= SUBMIT HANDLER ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "forgot") {
      dispatch(forgotPassword({ email: formData.email }));
      return;
    }

    if (mode === "reset") {
      const token = location.pathname.split("/").pop();
      dispatch(
        resetPassword({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        })
      );
      return;
    }

    const data = new FormData();
    data.append("email", formData.email);
    data.append("password", formData.password);

    if (mode === "signup") {
      data.append("name", formData.name);
      dispatch(register(data));
    } else {
      dispatch(login(data));
    }
  };

  if (!isAuthPopupOpen || authUser) return null;

  const isLoading =
    isLoggingIn || isSigningUp || isRequestingForToken || isUpdatingPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/50" />

      <div className="relative z-10 glass-panel w-full max-w-md mx-4 p-6">
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-primary">
            {mode === "signup"
              ? "Create Account"
              : mode === "forgot"
              ? "Forgot Password"
              : mode === "reset"
              ? "Reset Password"
              : "Welcome Back"}
          </h2>

          <button
            onClick={() => dispatch(toggleAuthPopup())}
            className="p-2 rounded-lg glass-card"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 bg-transparent border border-border rounded"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          )}

          {mode !== "reset" && (
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 bg-transparent border border-border rounded"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          )}

          {mode !== "forgot" && (
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 bg-transparent border border-border rounded"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          )}

          {mode === "reset" && (
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full p-2 bg-transparent border border-border rounded"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              required
            />
          )}

          {mode === "signin" && (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-sm text-primary text-right block w-full"
            >
              Forgot password?
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg gradient-primary"
          >
            {isLoading
              ? "Processing..."
              : mode === "signup"
              ? "Create Account"
              : mode === "forgot"
              ? "Send Reset Link"
              : mode === "reset"
              ? "Reset Password"
              : "Sign In"}
          </button>
        </form>

        {(mode === "signin" || mode === "signup") && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() =>
                setMode((prev) => (prev === "signin" ? "signup" : "signin"))
              }
              className="text-primary"
            >
              {mode === "signin"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;











// import { useState, useEffect } from "react";
// import { X, Mail, Lock, User } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation } from "react-router-dom";
// import { toggleAuthPopup } from "../../store/slices/popupSlice";
// import { forgotPassword, login, register, resetPassword } from "../../store/slices/authSlice";

// const LoginModal = () => {
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const {authUser, isSigningUp, isLoggingIn, isRequestingForToken} = useSelector((state) => state.auth);
//   const {isAuthPopupOpen} = useSelector((state) => state.popup);

//   const [mode, setMode] = useState('signin');  // signin | signup | reset-password | forgot-password

//   const [formData , setFormData] = useState({
//     name : '',
//     email : '',
//     password : '',
//     confirmPassword : '',
    
//   })

//   // Detect reset password URL and open popup with reset mode

//   useEffect(() => {
//     if(location.pathname.startsWith("/password/reset")){
//       setMode("reset");
//       dispatch(toggleAuthPopup());
//     }
//   }, [location.pathname ,dispatch]);

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const data = new FormData();

//     data.append('email', formData.email);
//     data.append('password', formData.password);
//     if(mode === "signup"){
//       data.append('name', formData.name);
//     }
//     if(mode === 'forgot'){
//       dispatch(forgotPassword({email: formData.email})).then(() => {
//         dispatch(toggleAuthPopup());
//         setMode('signin');
//       });
//       return;
//     }
//     if(mode === 'reset'){
//       const token = location.pathname.split("/").pop();
//       dispatch(resetPassword({token, password: formData.password, confirmPassword: formData.confirmPassword}))

//       return;
//     }

//     if(mode==='signup'){
//       dispatch(register(data))
//     }else{
//       dispatch(login(data))
//     }

//   }

//   if(authUser){
//     setFormData({name : "", email: "", password: "", confirmPassword: ""})
//   }

//   if(!isAuthPopupOpen || authUser) return null;

//   let isLoading = isLoggingIn || isSigningUp || isRequestingForToken;



//   return <>
//   <div className="fixed inset-0 z-50 flex items-center justify-center ">
//     {/* overlay */}
//     <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]"/>
//     <div className="relative z-10 glass-panel w-full max-w-md mx-4 animate-fade-in-up">
//       {/* header */}
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2l font-bold text-primary ">
//           {
//             mode === "reset" ? "Reset Password" : mode === "signup" ? "Create Account" : mode === "forgot" ? "Forgot Password" : "Welcome back"
//           }
//         </h2>
//         <button onClick={()=>dispatch(toggleAuthPopup())} className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"><X className="w-5 h-5 text-primary"/></button>
//       </div>
//       {/* authentication form */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Full name only for signup  */}
//         {
//           mode === 'reset' && (
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
//               <input type='text' placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pr-4 pl-10 py-3 rounded-lg border border-border bg-secondary focus:outline-none" required/>
//             </div>
//           )
//         }
//         {/* email always visible except reset mode */}
//         {
//           mode !== 'reset' && (
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
//               <input type='email' placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pr-4 pl-10 py-3 rounded-lg border border-border bg-secondary focus:outline-none" required/>
//             </div>
//           )
//         }

//         {/* Password always visisble except for forgot mode */}
//         {
//           mode !== 'forgot' && (
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
//               <input type='password' placeholder="Password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full pr-4 pl-10 py-3 rounded-lg border border-border bg-secondary focus:outline-none" required/>
//             </div>
//           )
//         }
//         {/* confirm password only visible for reset mode */}
//         {
//           mode === 'reset' && (
//             <div className="relative">
//               <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
//               <input type='password' placeholder="Confirm Password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} className="w-full pr-4 pl-10 py-3 rounded-lg border border-border bg-secondary focus:outline-none" required/>
//             </div>
//           )
//         }
//         {/* forgot password toggle button */}
//         {
//           mode ==='signin' && (
//             <div className="text-right-text-sm">
//               <button type = "button" onClick={()=>setMode('forgot')} className="pl-60 text-primary hover:text-accent animate-smooth">Forgot Password ?</button>
//             </div>
//           )
//         }
//         {/* sbumit button */}
//         <button type='submit' disabled={isLoading} className={`w-full py-3 gradient-primary flex 
//           justify-center items-center gap-2 text-pirmary-foreground rounded-lg font-semibold animate-smooth 
//           ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:glow-on-hover'}`}>
//             {
//               isLoading ? (
//                 <>
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin "/>
//                 <span>
//                   {
//                     mode === 'reset' 
//                     ? 'Resetting Password...' 
//                     : mode === 'signup' 
//                     ? 'Signing Up...' 
//                     : mode === 'forgot' 
//                     ? 'Requesting for email...' 
//                     : 'Signing In...'
//                   }
//                 </span>
//                 </>
//               ) : mode ==='reset' 
//                 ? ('Reset Password') 
//                 : mode === 'signup'
//                 ? ('Create Account')
//                 : mode === 'forgot' 
//                 ? ('Send request mail')
//                 : ('Sign In'
//             )}
//         </button>

//        </form>
//       {/* mode toggle */}
//       {["signin","signup"].includes(mode)&& (
//         <div className="mt-6 text-center">
//           <button type="button" onClick={()=>setMode(prev => prev === 'signup' ? 'signin' : 'signup')} className="text-primary hover:text-accent animate-smooth">
//             {mode === 'signup' ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
//           </button>
//         </div>
//       )}

//     </div>
//   </div>
  
//   </>;
// };



// export default LoginModal;

