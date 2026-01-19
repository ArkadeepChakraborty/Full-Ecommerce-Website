// import React, { useState } from 'react';
// import './Loginlogout.css';
// import crossIcon from '../../assets/cross-23.png';
// import { Userapi } from '../../utils/datauri.js';
// import ForgetPassword from '../ForgetPassword/ForgetPassword.jsx';


// const Login = ({ setShowLogin, setUser }) => {
//   const [mode, setMode] = useState('login'); // login | signup
//   const [showForget, setShowForget] = useState(false); // New state
//   const [formData, setFormData] = useState({
//     fullname: '',
//     email: '',
//     password: '',
//     phoneNumber: '',
//     role: 'food_provider'
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (mode === 'signup') {
//         const res = await fetch('http://localhost:8000/api/v1/user/register', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(formData),
//         });

//         const data = await res.json();
//         if (res.ok && data.success) {
//           alert('Account created! Please log in.');
//           setMode('login');
//         } else {
//           alert(data.message || 'Registration failed.');
//         }
//       } else {
//         const { email, password, role } = formData;

//         const res = await fetch(`${Userapi}/login`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           credentials: 'include',
//           body: JSON.stringify({ email, password, role }),
//         });

//         const data = await res.json();
//         if (res.ok && data.success) {
//           setUser(data.user);
//           localStorage.setItem('userName', data.user.fullname);
//           setShowLogin(false);
//           alert(`Welcome back ${data.user.fullname}`);
//           window.location.href = "/"
//         } else {
//           alert(data.message || 'Login failed.');
//         }
//       }
//     } catch (err) {
//       console.error('Auth Error:', err);
//       alert('Something went wrong. Please try again.');
//     }
//   };

//   // 🔄 Render Forget Password if active
//   if (showForget) {
//     return <ForgetPassword setShowForget={setShowForget} />;
//   }

//   return (
//     <div className="login-container">
//       <form className="login-box" onSubmit={handleSubmit}>
//         <div className="login-header">
//           <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
//           <img
//             className="login-close-icon"
//             src={crossIcon}
//             alt="Close"
//             onClick={() => setShowLogin(false)}
//           />
//         </div>

//         {mode === 'signup' && (
//           <>
//             <input
//               name="fullname"
//               value={formData.fullname}
//               onChange={handleChange}
//               placeholder="Full Name"
//               required
//             />
//             <input
//               name="phoneNumber"
//               value={formData.phoneNumber}
//               onChange={handleChange}
//               placeholder="Phone Number"
//               required
//             />
//             <select
//               name="role"
//               value={formData.role}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Select Role</option>
//               <option value="user">User</option>
//               <option value="food_provider">Food Counter Owner</option>
//             </select>
//           </>
//         )}

//         <input
//           type="email"
//           name="email"
//           value={formData.email}
//           onChange={handleChange}
//           placeholder="Email"
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           value={formData.password}
//           onChange={handleChange}
//           placeholder="Password"
//           required
//         />

//         <button type="submit">
//           {mode === 'signup' ? 'Sign Up' : 'Login'}
//         </button>

//         <p className="toggle-mode">
//           {mode === 'login' ? (
//             <>
//               Don't have an account?{' '}
//               <span onClick={() => setMode('signup')}>Sign up</span><br />
//               Forgot Password?{' '}
//               <span onClick={() => setShowForget(true)}>Click here</span>
//             </>
//           ) : (
//             <>
//               Already have an account?{' '}
//               <span onClick={() => setMode('login')}>Login</span>
//             </>
//           )}
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from 'react';
import './Loginlogout.css';
import crossIcon from '../../assets/cross-23.png';
import { Userapi } from '../../utils/datauri.js';
import ForgetPassword from '../ForgetPassword/ForgetPassword.jsx';

const Login = ({ setShowLogin, setUser }) => {
  const [mode, setMode] = useState('login');
  const [showForget, setShowForget] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'food_provider'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (mode === 'signup') {
        const res = await fetch('http://localhost:8000/api/v1/user/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          alert('Account created! Please log in.');
          setMode('login');
        } else {
          alert(data.message || 'Registration failed.');
        }
      } else {
        const { email, password, role } = formData;

        const res = await fetch(`${Userapi}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password, role }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setUser(data.user);

          // Store userName and login timestamp
          localStorage.setItem('userName', data.user.fullname);
          localStorage.setItem('loginTime', new Date().getTime());

          setShowLogin(false);
          alert(`Welcome back ${data.user.fullname}`);
          window.location.href = "/";
        } else {
          alert(data.message || 'Login failed.');
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  if (showForget) {
    return <ForgetPassword setShowForget={setShowForget} />;
  }

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <div className="login-header">
          <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
          <img
            className="login-close-icon"
            src={crossIcon}
            alt="Close"
            onClick={() => setShowLogin(false)}
          />
        </div>

        {mode === 'signup' && (
          <>
            <input
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
            <input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="food_provider">Food Counter Owner</option>
            </select>
          </>
        )}

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />

        <button type="submit">
          {mode === 'signup' ? 'Sign Up' : 'Login'}
        </button>

        <p className="toggle-mode">
          {mode === 'login' ? (
            <>
              Don't have an account? <span onClick={() => setMode('signup')}>Sign up</span><br />
              Forgot Password? <span onClick={() => setShowForget(true)}>Click here</span>
            </>
          ) : (
            <>
              Already have an account? <span onClick={() => setMode('login')}>Login</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;

