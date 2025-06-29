import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { userAuth } from "./AuthContext";
import { useNavigate, useOutletContext } from "react-router-dom";
import { toast } from 'react-toastify';
import ConfirmDialog from "./components/ConfirmDialog";

const DEFAULT_NO_CONTENT_MESSAGE = "No content generated. (Default Fallback)";

export default function GeneareteContent() {
  const { user } = userAuth(); // Get the current user from context
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [question, setQuestion] = useState("");
  // Initialize state from sessionStorage to persist posts across page reloads/redirects.
  const [posts, setPosts] = useState(() => {
    try {
      const savedPosts = sessionStorage.getItem('generatedPosts');
      return savedPosts ? JSON.parse(savedPosts) : [];
    } catch (error) {
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null); // Create a ref for the input element
  const outletContext = useOutletContext(); // Access Outlet context for history, etc.
  const isTwitterConnected = outletContext?.isTwitterConnected; // Get Twitter connection status from Layout
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [tweetToPost, setTweetToPost] = useState('');

  // Persist posts to sessionStorage whenever they change.
  useEffect(() => {
    sessionStorage.setItem('generatedPosts', JSON.stringify(posts));
  }, [posts]);

  // useEffect to focus the input field when the component mounts
  useEffect(() => {
    // Check if the inputRef is attached and the user is logged in (content generation is available)
    if (inputRef.current && user) {
      inputRef.current.focus();
    }
  }, [user]); // Re-run if the user state changes (e.g., after login, if the component was already mounted)

  // Effect to clear content when a new session is triggered from Layout
  useEffect(() => {
    // Check if newSessionKey exists in context and has changed (initial mount is also a change)
    if (outletContext && outletContext.newSessionKey) {
      // We don't need to compare with a previous value of newSessionKey here,
      // simply reacting to its presence and change is enough to clear.
      setQuestion("");
      setPosts([]);
      sessionStorage.removeItem('generatedPosts'); // Also clear storage
      setError(""); // Also clear any existing errors
    }
  }, [outletContext?.newSessionKey]);

  // Effect to load history when selectedHistoryItem changes from Layout
  useEffect(() => {
    // Check if outletContext and selectedHistoryItem exist
    if (outletContext && outletContext.selectedHistoryItem) {
      const { question: historyQuestion, content: historyContent, createdAt: historyTimestamp } = outletContext.selectedHistoryItem;
      
      setQuestion(historyQuestion || ""); // Set the prompt input

      if (historyContent && typeof historyContent === 'string') {
        const individualTweets = historyContent.split(/~\n+/).filter(tweet => tweet.trim() !== "");
        const historicalPosts = individualTweets.map((tweetContent, index) => ({
          // Use a more unique ID, perhaps combining original ID and index if available, or just a new timestamp
          id: outletContext.selectedHistoryItem._id ? `${outletContext.selectedHistoryItem._id}-${index}` : Date.now() + index, 
          prompt: historyQuestion,
          content: tweetContent.trim(),
          // Use the timestamp from the history item if available, otherwise generate a new one
          timestamp: historyTimestamp ? new Date(historyTimestamp).toLocaleString() : new Date().toLocaleString() 
        }));
        setPosts(historicalPosts); // Display the historical posts
      } else {
        setPosts([]); // Clear posts if no valid content from history
      }
      setError(""); // Clear any previous errors
      // Notify Layout to clear the selected item after loading to prevent re-processing on unrelated re-renders
      if (outletContext.clearSelectedHistory) {
        outletContext.clearSelectedHistory();
      }
    }
  }, [outletContext?.selectedHistoryItem, outletContext?.clearSelectedHistory]); // Depend on specific context properties

  const Generate = async (e) => {
    e.preventDefault();

    // Safeguard: If for some reason this function is called without a user,
    // (e.g., if UI wasn't updated yet), redirect to signin.
    if (!user) {
      // Consider replacing alert with a more integrated UI notification for better UX
      alert("Please sign in to generate content.");
      // navigate("/Signin"); // Redirect to the sign-in page
      return; // Stop further execution of the Generate function
    }

    if (question.trim().length < 10) {
      toast.error("Please provide more context for your idea (at least 10 characters).");
      setIsLoading(false); // Ensure loading state is reset if we return early
      return;
    }

    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      // console.log("Attempting to generate content for question:", question); // Keep for debugging if needed
      const resp = await axios.post(
        "https://media-generator-2yau.onrender.com/user/GenerateData",
        { question: question },
        { withCredentials: true }
       
      );
      console.log("API Response:", resp); // Keep for debugging if needed
      // console.log("Generated Data from API:", resp.data); // Keep for debugging if needed

      let generatedText = DEFAULT_NO_CONTENT_MESSAGE;
      const data = resp.data; // For easier access
      // Log the type of data to understand its structure
      // console.log("Type of resp.data:", typeof data); // Keep for debugging if needed

      // --- Text Extraction ---
      if (data && typeof data.ans === 'string') { // Check for the 'ans' property
        generatedText = data.ans; // Assign the content from 'ans'
        // console.log("Successfully extracted text from: data.ans"); // Keep for debugging if needed
      } else {
        // If none of the above matched, this warning will appear.
        console.warn("Could not find generated text in API response. Full response:", resp.data);
      }

      // If generatedText is the fallback, don't try to split it or create posts from it.
      if (generatedText !== DEFAULT_NO_CONTENT_MESSAGE && generatedText.trim() !== "") {
        const individualTweets = generatedText.split(/~\n+/).filter(tweet => tweet.trim() !== ""); // Split by ~\n and remove empty strings

        const newPosts = individualTweets.map((tweetContent, index) => ({
          id: Date.now() + index, // Create a slightly varied ID for multiple posts from one call
          prompt: question, // The same prompt generated all these tweets
          content: tweetContent.trim(), // Store the individual tweet
          timestamp: new Date().toLocaleString() // Consider a more robust date formatting library for consistency
        }));

        // Add new posts to the beginning. The order from API (after split) is preserved.
        setPosts(prevPosts => [...newPosts, ...prevPosts]);
      } else {
        if (generatedText === DEFAULT_NO_CONTENT_MESSAGE) {
          // Optionally, set an error or info message if the API truly returned no usable content
          // setError("The AI couldn't generate content for this prompt.");
        }
      }

      // setQuestion(""); // Clear the input field
    } catch (err) {
      console.error("Error generating content:", err);
      const errorMessage = err.response?.data?.message || "Failed to generate content. Please try again.";
      setError(errorMessage); // Keep setting local error state if you use it in the UI
      toast.error(errorMessage);
    }
    setIsLoading(false);
  };

  const handlePostTweet = (tweetContent) => {
    // 1. Check if Twitter is connected
    if (!isTwitterConnected) {
      toast.error("Please connect your Twitter account to post.");
      return; // Stop the function
    }

    // 2. Set the content to be posted and open the custom dialog
    setTweetToPost(tweetContent);
    // setIsConfirmDialogOpen(true);
  };

  // This function is called when the user clicks "Confirm" in the dialog
  const confirmAndPostTweet = async () => {
    // Close the dialog first
    // setIsConfirmDialogOpen(false);

    const toastId = toast.loading("Posting tweet..."); // Show a loading indicator
    try {
      // Assumes a backend endpoint exists to handle the post
      const response = await axios.post(
        "https://media-generator-2yau.onrender.com/user/auth/twitter/post",
        { status: tweetToPost }, // Use the tweet content from state
        { withCredentials: true }
      );

      toast.update(toastId, { render: "Tweet posted successfully!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (err) {
      console.error("Error posting tweet:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to post tweet. Please try again.";
      toast.update(toastId, { render: errorMessage, type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      // Clear the tweet content from state after the attempt
      setTweetToPost('');
    }
  };

  return (
    <div className="generate-content-container" id="generate-content-area">
      <input
        type="text"
        ref={inputRef} // Attach the ref to the input element
        placeholder="What's your idea to generate the tweet "
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={Generate} disabled={isLoading}>
        {isLoading ? "Generating..." : "Generate"}
      </button>

      {error && <p className="error-message">{error}</p>}

      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <p className="post-prompt"><strong>Prompt:</strong> {post.prompt}</p>
            <div className="post-content">
              {/* Ensure post.content is a string before trying to split it */}
              {typeof post.content === 'string' ? (
                post.content.split('\n').map((line, index) => (
                  // Render a non-breaking space for empty lines to ensure the <p> tag has content
                  <p key={`post-${post.id}-line-${index}`}>{line || '\u00A0'}</p>
                ))
              ) : (
                <p>Content is not available in the expected format.</p>
              )}
            </div>
            <div className="post-footer">
              <p className="post-timestamp">{post.timestamp}</p>
              {/* This button now triggers our new posting logic */}
              <button onClick={() => handlePostTweet(post.content)} className="post-action-button">
                Post on X
              </button>
            </div>
          </div>
        ))}
      </div>
{/* 
      <ConfirmDialog
        // isOpen={isConfirmDialogOpen}
        // onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmAndPostTweet}
        title="Confirm Tweet"
      >
        <p>Are you sure you want to post this to your X account?</p>
      </ConfirmDialog> */}
    </div>
  );
}
