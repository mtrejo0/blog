import React, { useState, useRef, useEffect } from "react";
import "./App.css";

import { defaultText, defaultTitle } from "./default";
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
    padding: "16px",
    margin: "32px",
    border: "2px solid black",
    borderRadius: "8px",
  },
};

const App = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [blogComments, setBlogComments] = useState([]);
  const [blogLikes, setBlogLikes] = useState([]);
  const [blogCommentLikes, setBlogCommentLikes] = useState([]);

  const [user_id, setUserId] = useState("moises");

  useEffect(() => {
    addBlogPost(defaultTitle, defaultText, []);
  }, []);

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
    setBlogLikes((s) =>
      s.filter(
        (like) => !(like.post_id === post_id && like.user_id === user_id),
      ),
    );
    // Update the backend or Firebase
  };

  const addCommentToPost = (post_id, text, range) => {
    const newComment = {
      comment_id: Date.now(),
      user_id,
      post_id,
      text,
      range,
    };
    setBlogComments([...blogComments, newComment]);
    // Update the backend or Firebase
  };

  const addLikeToComment = (comment_id) => {
    const newCommentLike = { comment_id, user_id };
    setBlogCommentLikes([...blogCommentLikes, newCommentLike]);
    // Update the backend or Firebase
  };

  const removeLikeFromComment = (comment_id) => {
    setBlogCommentLikes((s) =>
      s.filter(
        (like) => !(like.comment_id === comment_id && like.user_id === user_id),
      ),
    );
    // Update the backend or Firebase
  };

  // Component to render each blog post
  const BlogPost = ({ post }) => {
    const textRef = useRef(null);
    const [formattedText, setFormattedText] = useState(post.text);

    const highlight = (range) => {
      if (!textRef.current) return;
      if (!range) return;

      const { start, end } = range;
      const text = post.text;
      const before = text.substring(0, start);
      const boldText = text.substring(start, end);
      const after = text.substring(end);

      setFormattedText(
        <>
          {before}
          <strong>{boldText}</strong>
          {after}
        </>,
      );
    };

    const unHighlight = () => {
      if (!textRef.current) return;
      setFormattedText(<>{post.text}</>);
    };

    const [selectedTextRange, setSelectedTextRange] = useState(null);

    const handleMouseUp = () => {
      const selection = window.getSelection();

      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const { startOffset, endOffset } = range;

        // Check if the selection is within the text paragraph
        if (
          textRef.current &&
          textRef.current.contains(range.commonAncestorContainer)
        ) {
          setSelectedTextRange({ start: startOffset, end: endOffset });
        } else {
          // setSelectedTextRange(null);
        }
      }
    };

    const likeCount = blogLikes.filter(
      (like) => like.post_id === post.post_id,
    ).length;
    const hasLiked = blogLikes.find(
      (like) => like.user_id === user_id && like.post_id === post.post_id,
    )
      ? true
      : false;
    return (
      <div style={{ ...styles.box }} onMouseUp={handleMouseUp}>
        <h3>{post.title}</h3>
        <p ref={textRef}>{formattedText}</p>
        {/* {selectedTextRange && (
          <AddBlogComment post_id={post.post_id} range={selectedTextRange}/>
        )} */}
        {/* {blogComments.filter(comment => comment.post_id === post.post_id && post.range !== null).map((comment) => (
          <BlogComment key={comment.comment_id} comment={comment} highlight={highlight} unHighlight={unHighlight}/>
        ))} */}

        <p>Tags: {post.tags.join(", ")}</p>
        <p>Made by: {post.user_id}</p>
        <p>like count: {likeCount}</p>

        {hasLiked ? (
          <button onClick={() => removeLikeFromPost(post.post_id)}>
            Unlike
          </button>
        ) : (
          <button onClick={() => addLikeToPost(post.post_id)}>Like</button>
        )}

        <AddBlogComment
          post_id={post.post_id}
          replyTo={
            selectedTextRange &&
            post.text.substring(selectedTextRange.start, selectedTextRange.end)
          }
          range={selectedTextRange}
          setSelectedTextRange={setSelectedTextRange}
        />

        {blogComments
          .filter((comment) => comment.post_id === post.post_id)
          .map((comment) => (
            <BlogComment
              key={comment.comment_id}
              comment={comment}
              highlight={() => highlight(comment.range)}
              unHighlight={unHighlight}
              replyTo={
                comment.range &&
                post.text.substring(comment.range.start, comment.range.end)
              }
            />
          ))}
      </div>
    );
  };

  // Component to render each blog comment
  const BlogComment = ({ comment, highlight, unHighlight, replyTo }) => {
    const likeCount = blogCommentLikes.filter(
      (like) => like.comment_id === comment.comment_id,
    ).length;
    const hasLiked = blogCommentLikes.find(
      (like) =>
        like.user_id === user_id && like.comment_id === comment.comment_id,
    )
      ? true
      : false;

    return (
      <div
        style={{ ...styles.box }}
        onMouseEnter={highlight}
        onMouseLeave={unHighlight}
      >
        <p>{comment.text}</p>
        {replyTo && <p>Replying to: {replyTo}</p>}
        <p>like count: {likeCount}</p>

        {hasLiked ? (
          <button onClick={() => removeLikeFromComment(comment.comment_id)}>
            Unlike
          </button>
        ) : (
          <button onClick={() => addLikeToComment(comment.comment_id)}>
            Like Comment
          </button>
        )}
      </div>
    );
  };

  const AddBlogPost = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [tags, setTags] = useState([]);

    const handleSubmit = (event) => {
      event.preventDefault();
      if (title && text) {
        addBlogPost(title, text, tags.split(","));
        setTitle("");
        setText("");
        setTags([]);
      } else {
        // You can handle validation or show an error message here
        console.log("Title and content are required.");
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <label> - Title</label>
        </div>
        <div>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <label> - Text</label>
        </div>
        <div>
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            required
          />
          <label> - Tags - comma separated</label>
        </div>
        <button type="submit">Add Blog Post</button>
      </form>
    );
  };

  const AddBlogComment = ({
    post_id,
    range,
    replyTo,
    setSelectedTextRange,
  }) => {
    const [text, setText] = useState("");

    const handleSubmit = (event) => {
      event.preventDefault();
      if (text) {
        addCommentToPost(post_id, text, range);
        setText("");
      } else {
        // You can handle validation or show an error message here
        console.log("Text is required.");
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <button type="submit">Add Comment</button>
        {replyTo && <label> - Replying to: {replyTo}</label>}
        {replyTo && (
          <button onClick={() => setSelectedTextRange(null)}>Cancel</button>
        )}
      </form>
    );
  };

  return (
    <div>
      <div style={{ margin: "32px" }}>
        <form>
          <div>
            <input
              value={user_id}
              onChange={(e) => setUserId(e.target.value)}
            />
            <label> - User ID</label>
          </div>
        </form>
        <br></br>
        <AddBlogPost />
      </div>
      {blogPosts.map((post) => (
        <BlogPost key={post.post_id} post={post} />
      ))}
      {/* Add UI to create a new blog post */}
    </div>
  );
};

export default App;
