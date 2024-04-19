import {FaSearch} from 'react-icons/fa';
import {Link} from 'react-router-dom'
import {useSelector} from 'react-redux'


export default function Header() {
  const {currentUser}= useSelector((state)=>state.user); //useSelector hook for selecting data from the Redux store state.
  //Here we should mention currentUser only that is what we defined in userslice
  // console.log("currentUser from header");
  //console.log(currentUser);
  return (
    <header className='bg-slate-200 shadow-md '>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Ruth</span>
            <span className='text-slate-700'>Estate</span>
        </h1>
        </Link>
        <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
            <input type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64'/>
            <FaSearch className='text-slate-600'/>
        </form>

        <ul className='flex gap-4'>

            <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
            </Link>

            <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
            </Link>

            <Link to='/profile'> 
            
            {
              currentUser ? (
                <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile'/>
              ) : (
                <li className='text-slate-700 hover:underline'>Signin</li>
              )
            }
            </Link>
        </ul>
        </div> 
      
    </header>
    //in line 35 i.e,<Link to='/profile'>  we directly mentioned profile cuz if the user is active then it goes to private route and checks the diplay the profile page if not redirected to sign in page
    //check PrivateRouter.jsx
  )
}
