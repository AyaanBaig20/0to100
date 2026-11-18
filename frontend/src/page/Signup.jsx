import React from "react";
import { useState } from "react";
import axios from "axios";
import { failureToast, successToast } from "../toast/toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setloading } from "../redux/counter/user";
const Signup = () => {
  let user = useSelector((state) => state.user.user);
  let loading = useSelector((state) => state.user.loading);
  console.log("user", user);
  console.log("loading", loading);

  let navigate = useNavigate();
  let dispatch = useDispatch();
  let [data, setData] = useState({
    name: "",
    username: "",
    password: "",
  });
  let handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(setloading(true));
      let res = await axios.post(
        "http://localhost:3000/api/auth/signup",
        data,
        { withCredentials: true },
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        successToast(res.data.message);
        navigate("/");
      }
    } catch (error) {
      failureToast(error.response?.data?.message || error.mesage);
    } finally {
      dispatch(setloading(false));
    }
  };
  if (loading) {
    return (
      <>
        <h1>Loading</h1>
      </>
    );
  }
  return (
    <div>
      <h1>Signup Page</h1>
      <br />
      <br />
      <h1>name</h1>
      <input
        type="text"
        name="name"
        value={data.name}
        onChange={handleChange}
      />
      <br />
      <h1>username</h1>
      <input
        type="text"
        name="username"
        value={data.username}
        onChange={handleChange}
      />
      <br />
      <h1>Password</h1>
      <input
        type="text"
        name="password"
        value={data.password}
        onChange={handleChange}
      />
      <br />
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Signup;
