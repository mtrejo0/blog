import React, { useState } from 'react';
import "./App.css"

/*

Users

- user_id
- username
- password
- bio
- interests []
- email
- linkedin

All provided with google firebase

Blog Post

- post_id
- user_id - if the blog will have more than one user?
- text
- tags [] - what the tag does

Blog Likes

- post_id
- user_id

Blog comment

- comment_id
- user_id
- post_id
- text
- text_index [] - start and end of a comment

blog comment like

- comment_id
- user_id

*/

const styles = {
  box: {
    padding: "16px", margin: "32px", border: "2px solid black", borderRadius: "8px"
  },
  
}

const App = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogComments, setBlogComments] = useState([]);
  const [blogLikes, setBlogLikes] = useState([]);
  const [blogCommentLikes, setBlogCommentLikes] = useState([]);

  const user_id = 'moises';

  const addBlogPost = (title, text, tags) => {
    // Assuming a new post object is created here
    const newPost = { user_id, title, text, tags, post_id: Date.now() };
    setBlogPosts([...blogPosts, newPost]);
    // You should also send this newPost to your backend or Firebase
  };

  const addLikeToPost = (post_id) => {
    const newLike = { post_id, user_id };
    setBlogLikes([...blogLikes, newLike]);
    // Update the backend or Firebase
  };

  const removeLikeFromPost = (post_id) => {
    setBlogLikes(s => s.filter(like => !(like.post_id === post_id && like.user_id === user_id)));
    // Update the backend or Firebase
  };

  const addCommentToPost = (post_id, text) => {
    const newComment = { comment_id: Date.now(), user_id, post_id, text };
    setBlogComments([...blogComments, newComment]);
    // Update the backend or Firebase
  };

  const addLikeToComment = (comment_id) => {
    const newCommentLike = { comment_id, user_id };
    setBlogCommentLikes([...blogCommentLikes, newCommentLike]);
    // Update the backend or Firebase
  };

  const removeLikeFromComment = (comment_id) => {
    setBlogCommentLikes(s => s.filter(like => !(like.comment_id === comment_id && like.user_id === user_id)));
    // Update the backend or Firebase
  };

  // Component to render each blog post
  const BlogPost = ({ post }) => {

    const likeCount = blogLikes.filter(like => like.post_id === post.post_id).length;
    const hasLiked = blogLikes.find(like => like.user_id === user_id && like.post_id === post.post_id) ? true : false
    return (
      <div style={{...styles.box}}>
        <h3>{post.title}</h3>
        <p>{post.text}</p>
        <p>Made by: {post.user_id}</p>
        <p>like count: {likeCount}</p>
        
        {
          hasLiked ? 
            <button onClick={() => removeLikeFromPost(post.post_id)}>Unlike</button>
          : <button onClick={() => addLikeToPost(post.post_id)}>Like</button>

        }
        
        <AddBlogComment post_id={post.post_id}/>

        {blogComments.filter(comment => comment.post_id === post.post_id).map((comment) => (
          <BlogComment key={comment.comment_id} comment={comment} />
        ))}
      </div>
    );
  };

  // Component to render each blog comment
  const BlogComment = ({ comment }) => {

    const likeCount = blogCommentLikes.filter(like => like.comment_id === comment.comment_id).length;
    const hasLiked = blogCommentLikes.find(like => like.user_id === user_id  && like.comment_id === comment.comment_id) ? true : false
    return (
      <div>
        <p>{comment.text}</p>
        <p>like count: {likeCount}</p>
        
        {
          hasLiked ? 
          < button onClick={() => removeLikeFromComment(comment.comment_id)}>Unlike</button>
          : <button onClick={() => addLikeToComment(comment.comment_id)}>Like Comment</button>

        }
      </div>
    );
  };

  const AddBlogPost = () => {
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [tags, setTags] = useState([]);
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (title && text) {
        addBlogPost(title, text, tags);
        setTitle('');
        setText('');
      } else {
        // You can handle validation or show an error message here
        console.log('Title and content are required.');
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Text:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Blog Post</button>
      </form>
    );
  };
  

  const AddBlogComment = ({post_id}) => {
    const [text, setText] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
      if (text) {
        addCommentToPost(post_id, text)
        setText('');
      } else {
        // You can handle validation or show an error message here
        console.log('Text is required.');
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Text:</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Comment</button>
      </form>
    );
  };

  return (
    <div>
      <p>User ID: {user_id}</p>
      <AddBlogPost/>
      {blogPosts.map((post) => (
        <BlogPost key={post.post_id} post={post} />
      ))}
      {/* Add UI to create a new blog post */}
    </div>
  );
};

export default App;
