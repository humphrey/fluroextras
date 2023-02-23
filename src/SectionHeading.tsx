import React from 'react';
import { useForm } from "react-hook-form";
import { LoginInput } from './fluroapi/auth';
import { useFluroContext } from './fluroapi/context';
import { ReloadButton, ReloadButtonProps } from './fluroapi/ReloadButton';


interface Props {
  children: React.ReactNode
  reload?: ReloadButtonProps
}

export const SectionHeading = (props: Props) => {
  return (
    <div className='d-flex align-items-center mb-3'>
      <h5 className='me-auto mb-0'>{props.children}</h5>
      {props.reload && <ReloadButton {...props.reload}/>}
    </div>
  )
}