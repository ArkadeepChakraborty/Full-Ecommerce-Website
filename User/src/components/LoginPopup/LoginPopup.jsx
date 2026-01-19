import React, { useState } from 'react';
import './LoginPopup.css';
import cross_icon from '../../assets/cross_icon.png';
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from 'react-toastify';
import ForgetPassword from '../ForgetPassword/ForgetPassword';


const LoginPopup = ({ setShowLogin }) => {
    const [currentState, setCurrentState] = useState('Login'); // Login | Sign Up
    const [showForget, setShowForget] = useState(false);
    const [data, setData] = useState({
        fullname: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();

        if (currentState === 'Sign Up') {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/user/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fullname: data.fullname,
                        email: data.email,
                        password: data.password,
                        phoneNumber: Number(data.phoneNumber),
                        role: "user"
                    })
                });

                const data1 = await response.json();
                toast.success(data1.message);
                setCurrentState('Login');
            } catch (error) {
                console.error("Registration Error:", error);
                toast.error("Something went wrong!");
            }

        } else {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/user/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                        role: 'user'
                    })
                });

                const result = await response.json();
                if (response.ok) {
                    toast.success("Login successful!");
                    localStorage.setItem("userName", result.user._id);
                    setShowLogin(false);
                    window.location.href = "/";
                } else {
                    toast.error(result.message || "Invalid email or password!");
                }
            } catch (error) {
                console.error("Login Error:", error);
                toast.error("Something went wrong!");
            }
        }
    };

    if (showForget) {
        return <ForgetPassword setShowForget={setShowForget} />;
    }

    return (
        <>
            <ToastContainer />
            <div className='login-popup'>
                <form onSubmit={onLogin} className="login-popup-container">
                    <div className="login-popup-title">
                        <h2>{currentState}</h2>
                        <img onClick={() => setShowLogin(false)} src={cross_icon} alt="Close" />
                    </div>
                    <div className="login-popup-inputs">
                        {currentState === 'Sign Up' && (
                            <div className='login-popup-user-info'>
                                <input name='fullname' onChange={onChangeHandler} value={data.fullname} type="text" placeholder='Your name' required />
                                <input name='phoneNumber' onChange={onChangeHandler} value={data.phoneNumber} type="text" placeholder='Mobile No' required />
                            </div>
                        )}
                        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                        <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                    </div>
                    <button type='submit'>{currentState === 'Sign Up' ? 'Create account' : 'Login'}</button>
                    <div className="login-popup-conditions">
                        <input type="checkbox" required />
                        <p>By continuing, I agree to the terms of use & privacy policy</p>
                    </div>
                    {currentState === 'Login' ? (
                        <>
                            <p>Create a new account? <span onClick={() => setCurrentState('Sign Up')}>Click here</span></p>
                            <p style={{ marginTop: '-16px' }}>Forget Password? <span onClick={() => setShowForget(true)}>Click here</span></p>
                        </>
                    ) : (
                        <p>Already have an account? <span onClick={() => setCurrentState('Login')}>Login here</span></p>
                    )}
                </form>
            </div>
        </>
    );
};

export default LoginPopup;





// LoginPopup.jsx

// import React, { useState } from 'react';
// import './LoginPopup.css';
// import cross_icon from '../../assets/cross_icon.png';
// import "react-toastify/dist/ReactToastify.css";
// import { toast, ToastContainer } from 'react-toastify';
// import ForgetPassword from '../ForgetPassword/ForgetPassword';

// const LoginPopup = ({ setShowLogin }) => {
//     const [currentState, setCurrentState] = useState('Login');
//     const [showForget, setShowForget] = useState(false);
//     const [data, setData] = useState({
//         fullname: "",
//         email: "",
//         password: "",
//         phoneNumber: "",
//         role: ""
//     });

//     const onChangeHandler = (event) => {
//         const { name, value } = event.target;
//         setData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     const onLogin = async (event) => {
//         event.preventDefault();

//         if (currentState === 'Sign Up') {
//             try {
//                 const response = await fetch(`http://localhost:8000/api/v1/user/register`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({
//                         fullname: data.fullname,
//                         email: data.email,
//                         password: data.password,
//                         phoneNumber: Number(data.phoneNumber),
//                         role: "user"
//                     })
//                 });

//                 const data1 = await response.json();
//                 toast.success(data1.message);
//                 setCurrentState('Login');
//             } catch (error) {
//                 console.error("Registration Error:", error);
//                 toast.error("Something went wrong!");
//             }

//         } else {
//             try {
//                 const response = await fetch(`http://localhost:8000/api/v1/user/login`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     credentials: 'include',
//                     body: JSON.stringify({
//                         email: data.email,
//                         password: data.password,
//                         role: 'user'
//                     })
//                 });

//                 const result = await response.json();
//                 if (response.ok) {
//                     toast.success("Login successful!");
//                     localStorage.setItem("userName", result.user._id);
//                     localStorage.setItem("loginTime", new Date().getTime());
//                     setShowLogin(false);
//                     window.location.href = "/";
//                 } else {
//                     toast.error(result.message || "Invalid email or password!");
//                 }
//             } catch (error) {
//                 console.error("Login Error:", error);
//                 toast.error("Something went wrong!");
//             }
//         }
//     };

//     if (showForget) {
//         return <ForgetPassword setShowForget={setShowForget} />;
//     }

//     return (
//         <>
//             <ToastContainer />
//             <div className='login-popup'>
//                 <form onSubmit={onLogin} className="login-popup-container">
//                     <div className="login-popup-title">
//                         <h2>{currentState}</h2>
//                         <img onClick={() => setShowLogin(false)} src={cross_icon} alt="Close" />
//                     </div>
//                     <div className="login-popup-inputs">
//                         {currentState === 'Sign Up' && (
//                             <div className='login-popup-user-info'>
//                                 <input name='fullname' onChange={onChangeHandler} value={data.fullname} type="text" placeholder='Your name' required />
//                                 <input name='phoneNumber' onChange={onChangeHandler} value={data.phoneNumber} type="text" placeholder='Mobile No' required />
//                             </div>
//                         )}
//                         <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
//                         <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
//                     </div>
//                     <button type='submit'>{currentState === 'Sign Up' ? 'Create account' : 'Login'}</button>
//                     <div className="login-popup-conditions">
//                         <input type="checkbox" required />
//                         <p>By continuing, I agree to the terms of use & privacy policy</p>
//                     </div>
//                     {currentState === 'Login' ? (
//                         <>
//                             <p>Create a new account? <span onClick={() => setCurrentState('Sign Up')}>Click here</span></p>
//                             <p style={{ marginTop: '-16px' }}>Forget Password? <span onClick={() => setShowForget(true)}>Click here</span></p>
//                         </>
//                     ) : (
//                         <p>Already have an account? <span onClick={() => setCurrentState('Login')}>Login here</span></p>
//                     )}
//                 </form>
//             </div>
//         </>
//     );
// };

// export default LoginPopup;
