import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { failureToast, successToast } from "../toast/toast";
import { useDispatch,useSelector } from "react-redux";
import { setUser, setloading } from "../redux/counter/user";

const Login = () => {
let loading = useSelector((state) => state.user.loading);

  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [data, setData] = useState({
    username: "",
    password: "",
  });
  let handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(setloading(true));

      let res = await axios.post("http://localhost:3000/api/auth/login", data, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        successToast(res.data.message);
        navigate("/");
      }
    } catch (error) {
      failureToast(error.response?.data?.message || error.message);
    } finally {
      dispatch(setloading(false));
    }
  };
  if (loading) {
    return <>
        <h1>loading</h1>
    </>
  }

  return (
    <div>
      <h1>Login page</h1>
      <br />
      <h3>email</h3>
      <input
        type="text"
        onChange={handleChange}
        value={data.username}
        name="username"
      />
      <h3>password</h3>
      <input
        type="password"
        onChange={handleChange}
        value={data.password}
        name="password"
      />

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Login;
