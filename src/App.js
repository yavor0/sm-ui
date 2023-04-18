import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:3000";

function App() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_URL}/posts`, { withCredentials: true });
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchPosts();

      const interval = setInterval(() => {
        fetchPosts();
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isLoggedIn]);

  const register = async () => {
    try {
      if (!name) return;
      await axios.post(`${API_URL}/register`, { name });
      setMessage("Account has been created successfully!");
      setIsError(false);
    } catch (error) {
      setMessage("Error creating account.");
      setIsError(true);
    }
  };

  const login = async () => {
    try {
      if (!name) return;
      const response = await axios.post(`${API_URL}/login`, { name }, { withCredentials: true });
      setIsLoggedIn(true);
      setMessage("Logged in successfully!");
      setIsError(false);
    } catch (error) {
      if (error.response.status === 404) {
        setMessage("Account not found.");
      } else {
        setMessage("Error logging in.");
      }
      setIsError(true);
    }
  };

  const logout = async () => {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    setIsLoggedIn(false);
  };

  const createPost = async () => {
    await axios.post(`${API_URL}/posts`, { content }, { withCredentials: true });
    setContent("");
    fetchPosts();
  };

  const deletePost = async (postId) => {
    await axios.delete(`${API_URL}/posts/${postId}`, { withCredentials: true });
    fetchPosts();
  };

  const likePost = async (postId) => {
    await axios.post(`${API_URL}/posts/${postId}/like`, {}, { withCredentials: true });
    fetchPosts();
  };


  return (
    <div className="container">
      <div className="header">
        {!isLoggedIn ? (
          <div>
            <input
              className="input-field"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button className="btn" onClick={register}>
              Register
            </button>
            <button className="btn" onClick={login}>
              Login
            </button>
          </div>
        ) : (
          <button className="btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>
      {message && (
        <div className={`message${isError ? " error" : " success"}`}>{message}</div>
      )}
      {isLoggedIn && (
        <div>
          <input
            className="input-field"
            type="text"
            placeholder="Write a post"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="btn" onClick={createPost}>
            Create Post
          </button>
          <div>
            {posts.map((post) => (
              <div key={post.id} className="post">
                <p className="post-user">
                  {post.userName}
                </p>
                <p className="post-content">{post.content}</p>
                <p>Likes: {post.likes}</p>
                <button className="btn" onClick={() => likePost(post.id)}>
                  Like
                </button>
                <button className="btn" onClick={() => deletePost(post.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;