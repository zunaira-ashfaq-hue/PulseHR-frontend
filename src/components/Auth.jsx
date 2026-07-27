import { useState } from "react";
import { useToast } from "./Toast";

const API_URL = "https://pulsehr-backend-sa06.onrender.com/api";
function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "employee",
    department: "",
    position: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });


      const data = await res.json();

      console.log("Login Response:", data);


      if (res.ok) {

        const token = data.token;

        // backend response handle
        const user = data.employee || data.user || data.data;


        console.log("TOKEN:", token);
        console.log("USER:", user);


        if (!token || !user) {
          toast.error("Invalid login response");
          return;
        }


        localStorage.setItem("token", token);

        toast.success("Login successful!");

        onLogin(token, user);


      } else {
        toast.error(data.message || "Login failed");
      }


    } catch (error) {

      console.log("Login Error:", error);
      toast.error("Server connection error");

    }
  };



  // REGISTER
  const handleRegister = async (e) => {

    e.preventDefault();


    const {
      email,
      password,
      name,
      department,
      position,
      phone,
      role,
    } = formData;



    if (
      !email ||
      !password ||
      !name ||
      !department ||
      !position ||
      !phone
    ) {
      toast.error("Please fill all fields");
      return;
    }



    try {


      const res = await fetch(`${API_URL}/auth/register`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },


        body: JSON.stringify({
          email,
          password,
          name,
          department,
          position,
          phone,
          role,
        }),

      });



      const data = await res.json();


      console.log("Register Response:", data);



      if(res.ok){

        toast.success(
          "Registration successful! Please login"
        );


        setFormData({
          email:"",
          password:"",
          name:"",
          role:"employee",
          department:"",
          position:"",
          phone:"",
        });


        setIsLogin(true);


      }
      else{

        toast.error(
          data.message || "Registration failed"
        );

      }


    }
    catch(error){

      console.log(error);
      toast.error("Server error");

    }

  };



  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-card">


          <div className="auth-header">

            <h1>
              PulseHR: Employee Management System
            </h1>

            <p>
              Streamline your workforce management
            </p>

          </div>



          <div className="auth-body">


            <div className="tabs">

              <button
                className={`tab ${isLogin ? "active":""}`}
                onClick={()=>setIsLogin(true)}
              >
                Login
              </button>


              <button
                className={`tab ${!isLogin ? "active":""}`}
                onClick={()=>setIsLogin(false)}
              >
                Register
              </button>


            </div>



            {
              isLogin ? (

              <form onSubmit={handleLogin}>


                <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                />


                <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                />


                <button className="btn btn-primary btn-full">
                  Sign In
                </button>


              </form>


              ):(


              <form onSubmit={handleRegister}>


                <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                />


                <input
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                />


                <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                />


                <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                >

                  <option value="employee">
                    Employee
                  </option>

                  <option value="admin">
                    Admin
                  </option>

                </select>


                <input
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleChange}
                />


                <input
                name="position"
                placeholder="Position"
                value={formData.position}
                onChange={handleChange}
                />


                <input
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                />


                <button className="btn btn-primary btn-full">
                  Create Account
                </button>


              </form>

              )
            }


          </div>


        </div>

      </div>

    </div>
  );
}


export default Auth;