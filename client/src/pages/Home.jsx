import React, {useState} from 'react'
import Hero from '../components/Hero';
import JobListing from '../components/JobListing';
import AppDownload from '../components/AppDownload';
import Footer from '../components/Footer';

const Home = () => {
  //  const [searchFilter, setSearchFilter] = useState("");

  return (
    <div>

      <Hero />
      <JobListing />
      <AppDownload />
      <Footer />
    </div>
  )
}

export default Home