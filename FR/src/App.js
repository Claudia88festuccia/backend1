
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import NavBar from "./components/navbar/BlogNavbar";
import Footer from "./components/footer/Footer";
import Home from "./views/home/Home";
import Blog from "./views/blog/Blog";
import NewBlogPost from "./views/new/New";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthorPosts from "./components/autorPost/AuthorPosts";  
import EditBlogPost from "./views/edit/EditBlogPost";
import AuthorProfile from "./components/authorProfile/AuthorProfile";
import { use } from "react";

function App() {
  const fetchAuthors= async ()=>{
    const res= await fetch(process.env.REACT_APP_API_URL + "/authors");
    const data= await res.json();
    console.log(data);
  }

  useEffect(() => {
    fetchAuthors();
  }, []);
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/404" element={<div>Pagina non trovata</div>} />
        <Route path="*" element={<Navigate to="/404" />} />
        <Route path="/" element={<Home />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/new" element={<NewBlogPost />} />
        <Route path="/profile/:authorId" element={<AuthorProfile />} />
        <Route path="/author/:id/posts" element={<AuthorPosts />} />
        <Route path="/edit/:id" element={<EditBlogPost />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

