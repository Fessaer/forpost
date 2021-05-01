import { useContext} from 'react';
import { Context } from './Store'

const CheckAuth = () => {
  const [inState] = useContext(Context);
  let auth = false;
  if (inState.name === 'tim') {
    auth = true;
  }
  return auth;
}

export default CheckAuth;