import React from 'react';
import { useForm } from "react-hook-form";
import { LoginInput, useApiLogin } from './api/login';

export const LoginForm = () => {
  const api = useApiLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>();
  const [loading, setLoading] = React.useState(false);
  const onSubmit = handleSubmit(async data => {
    // console.log(data)
    setLoading(true)
    await api.login(data)
    setLoading(false)
  });
  return (
    <form onSubmit={onSubmit}>
      <label>Username</label>
      <input {...register("username")} />
      <label>Password</label>
      <input {...register("password")} type="password" />
      <button
        type="submit"
        disabled={loading}
        // onClick={() => {
        //   setValue("username", "luo"); // ✅
        //   setValue("firstName", true); // ❌: true is not string
        //   errors.bill; // ❌: property bill does not exist
        // }}
      >{loading ? 'Logging In' : 'Login'}
      </button>
    </form>
  )
}