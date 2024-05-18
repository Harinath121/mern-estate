import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './Pages/Home'
import SingIn from './Pages/SingIn'
import SignUp from './Pages/SignUp'
import About from './Pages/About'
import Profile from './Pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './Pages/CreateListing'
import UpdateTheListing from './Pages/UpdateTheListing'
import Listing from './Pages/Listing'
import Search from './Pages/Search'



export default function App() {
  return (
    <BrowserRouter>
        <Header/>
        <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/sign-in" element={<SingIn/>}></Route>
            <Route path="/sign-up" element={<SignUp/>}></Route>
            <Route path="/about" element={<About/>}></Route>
            <Route path="/listing/:listingId" element={<Listing/>}></Route>
            <Route path = "/search" element = {<Search/>}></Route>
            <Route element={<PrivateRoute/>}> 
              <Route path="/profile" element={<Profile/>}></Route>
              <Route path="/create-listing" element={<CreateListing/>}></Route>
              <Route path="/update-listing/:listingId" element={<UpdateTheListing/>}></Route>

            </Route>

        </Routes>
    </BrowserRouter>

  )
}
  