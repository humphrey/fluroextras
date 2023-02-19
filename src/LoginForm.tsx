import React from 'react';
import { useForm } from "react-hook-form";
import { useApi } from './api/context';
import { LoginInput } from './api/login';

export const LoginForm = () => {
  const api = useApi();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>();
  const onSubmit = handleSubmit(data => {
    // console.log(data)
    api.login(data)
  });
  return (
    <form onSubmit={onSubmit}>
      <label>Username</label>
      <input {...register("username")} />
      <label>Password</label>
      <input {...register("password")} type="password" />
      <button
        type="submit"
        // onClick={() => {
        //   setValue("username", "luo"); // ✅
        //   setValue("firstName", true); // ❌: true is not string
        //   errors.bill; // ❌: property bill does not exist
        // }}
      >
        Login
      </button>
    </form>
  )
}