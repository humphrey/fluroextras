

import { useSelectCampuses } from './selectors/campuses';

interface Props {
}



export const Campuses = (props: Props) => {
  const campuses = useSelectCampuses();
  return (
    /*
    <div class="btn-group" role="group" aria-label="Basic outlined example">
  <button type="button" class="btn btn-outline-primary">Left</button>
  <button type="button" class="btn btn-outline-primary">Middle</button>
  <button type="button" class="btn btn-outline-primary">Right</button>
</div>* */
    <div className='btn-group m-3' role="group">
      {campuses.map(c => (
        <button key={c._id} type="button" className='btn btn-outline-primary'>{c.title}</button>
      ))}
    </div>
  )
}