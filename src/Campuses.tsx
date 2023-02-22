

import { useSelectCampuses } from './selectors/campuses';

interface Props {
}


export const Campuses = (props: Props) => {
  const campuses = useSelectCampuses();
  return (
    <div className='btn-group m-3' role="group">
      {campuses.map(c => (
        <button key={c._id} type="button" className='btn btn-outline-primary'>{c.title}</button>
      ))}
    </div>
  )
}