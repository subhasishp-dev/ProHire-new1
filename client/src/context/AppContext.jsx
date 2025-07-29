import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-toastify";


export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const { user } = useUser()
    const { getToken } = useAuth()


    const [searchFilter, setSearchFilter] = useState({
        title: '',
        location: ''
    })

    const [isSearched, setIsSearched] = useState(false)

    const [jobs, setJobs] = useState([])

    const [showRecruiterLogin, setShowRecruiterLogin] = useState(false)

    const [companyToken, setCompanyToken] = useState(null)
    const [companyData, setCompanyData] = useState(null)

    const [userdata, setUserData] = useState(null)
    const [userApplications, setUserApplications] = useState([])

    //Function to fetch jobs
    const fetchJobs = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/jobs')

            if (data.success) {
                setJobs(data.jobs)
                console.log(data.jobs);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }

    }

    //Function to fetch company data
    const fetchCompanyData = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/company/company', { headers: { token: companyToken } })

            if (data.success) {
                setCompanyData(data.company);
                console.log(data);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    // Function to fetch user data
    const fetchUserData = async () => {
        try {

            const token = await getToken();

            const { data } = await axios.get(backendUrl + '/api/users/user',
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                setUserData(data.user)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    //Function to fetch user's applied applications data
    const fetchUserApplications = async () => {
        try {

            const token = await getToken()

            const { data } = await axios.get(backendUrl + '/api/users/applications',
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (data.success) {
                setUserApplications(data.applications)

            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }
    }

    useEffect(() => {
        fetchJobs()

        const storedCompanyToken = localStorage.getItem('companyToken');

        if (storedCompanyToken) {
            setCompanyToken(storedCompanyToken);
        }

    }, [])

    useEffect(() => {
        if (companyToken) {
            fetchCompanyData();
        }
    }, [companyToken])

    useEffect(() => {

        const syncUserToBackend = async () => {
            try {
                const token = await getToken();

                const { data } = await axios.post(`${backendUrl}/api/users/sync`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (data.success) {
                    setUserData(data.user);
                    fetchUserApplications();
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error("User sync failed:", error.message);
                toast.error(error.message)
            }
        }


        if (user) {
            //fetchUserData()
            syncUserToBackend()
            //fetchUserApplications()
        }
        // if (user) {
        //     fetch("http://localhost:5000/api/users/sync", {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //             Authorization: `Bearer ${user.sessionId}`, // or use `getToken()`
        //         },
        //     });
        // }

    }, [user])

    const value = {
        searchFilter, setSearchFilter,
        isSearched, setIsSearched,
        jobs, setJobs,
        showRecruiterLogin, setShowRecruiterLogin,
        companyToken, setCompanyToken,
        companyData, setCompanyData,
        backendUrl,
        userdata, setUserData,
        userApplications, setUserApplications,
        fetchUserData,
        fetchUserApplications
    }

    return (<AppContext.Provider value={value}>
        {props.children}

    </AppContext.Provider>)
}