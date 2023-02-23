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
      <div className='mb-3'>
        <label htmlFor="id-fluro-username" className='form-label'>Your Fluro Username</label>
        <input {...register("username")} id="id-fluro-username" className='form-control'/>
      </div>
      <div className='mb-4'>
        <label htmlFor="id-fluro-password" className='form-label'>Your Fluro Password</label>
        <input {...register("password")} type="password" id="id-fluro-password" className='form-control'/>
      </div>
      <button
        type="submit"
        disabled={loading}
        className='btn btn-primary'
      >{loading ? 'Logging In' : 'Login'}
      </button>
    </form>
  )
}