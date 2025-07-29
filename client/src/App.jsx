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
import { ToastContainer, toast } from 'react-toastify';

const App = () => {

  const location = useLocation();

   const shouldHideNavbar = location.pathname.startsWith('/dashboard');


  const {showRecruiterLogin, companyToken} = useContext(AppContext)

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/applications' element={<Applications />} />
        <Route path='/apply-job/:id' element={<ApplyJob/>} />
        <Route path='/dashboard' element={<Dashboard/>}>
          {companyToken ? <>
            <Route path='add-job' element={<AddJob/>} />
            <Route path='manage-jobs' element={<ManageJobs/>} />
            <Route path='view-applications' element={<ViewApplications/>} />
          </> : null
          }
          
        </Route>
      </Routes>
    </div>
  )
}

export default App