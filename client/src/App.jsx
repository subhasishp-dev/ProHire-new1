import React, { useContext } from "react";
import { Route,Routes } from "react-router-dom";
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Applications from './pages/Applications'
import Navbar from './components/Navbar';
import RecruiterLogin from "./components/RecruiterLogin";
import { AppContext } from "./context/AppContext";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import ManageJobs from "./pages/ManageJobs";
import ViewApplications from "./pages/ViewApplications";
import { useLocation } from 'react-router-dom';
import 'quill/dist/quill.snow.css'

const App = () => {

  const location = useLocation();

   const shouldHideNavbar = location.pathname.startsWith('/dashboard');


  const {showRecruiterLogin} = useContext(AppContext)

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      {showRecruiterLogin && <RecruiterLogin />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/applications' element={<Applications />} />
        <Route path='/apply-job/:id' element={<ApplyJob/>} />
        <Route path='/dashboard' element={<Dashboard/>}>
          <Route path='add-job' element={<AddJob/>} />
          <Route path='manage-jobs' element={<ManageJobs/>} />
          <Route path='view-applications' element={<ViewApplications/>} />
        </Route>
      </Routes>
    </div>
  )
}

export default App