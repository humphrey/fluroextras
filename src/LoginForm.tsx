import React from 'react';
import { useForm } from "react-hook-form";
import { LoginInput } from './fluroapi/auth';
import { useFluroContext } from './fluroapi/context';

export const LoginForm = () => {
  const fluro = useFluroContext();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>();
  const [loading, setLoading] = React.useState(false);
  const onSubmit = handleSubmit(async data => {
    setLoading(true)
    await fluro.auth.login(data)
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
      >{loading ? 'Logging In' : 'Login'}
      </button>
    </form>
  )
}