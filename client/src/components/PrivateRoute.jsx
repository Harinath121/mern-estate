import {  useSelector } from "react-redux"
import { Outlet,Navigate } from "react-router-dom";
//Navigate is also same as useNavigate where useNavigate is hook Navigate is a component


export default function PrivateRoute() {
  const {currentUser}=useSelector(state=>state.user);
  return currentUser?<Outlet/>:<Navigate to='/sign-in'/>
}
