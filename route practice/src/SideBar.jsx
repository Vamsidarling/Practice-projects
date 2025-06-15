import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // For navigation links
import { userAuth } from './AuthContext'; // To check if user is logged in
import axios from 'axios'; // To make API calls
import { toast } from 'react-toastify'; // Import toast 

export default function Sidebar({ onNewGeneration, onLoadHistory }) { // Added onLoadHistory prop
  const { user } = userAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        setIsLoadingHistory(true);
        setHistoryError('');
        try {
          // Replace with your actual backend endpoint for fetching history
          const response = await axios.get('http://localhost:3000/user/getPosts', { 
            withCredentials: true, // Important if your backend uses cookies/sessions for auth
          });
          // Assuming the backend returns an object with a 'data' array like your example
          setHistoryItems(response.data.data || []);
          console.log('Fetched history:', response.data.data);
        } catch (error) {
          console.error('Failed to fetch history:', error);
          const errorMessage = 'Failed to load history.';
          setHistoryError(errorMessage);
          toast.error(errorMessage); // Add toast for history fetch error
          setHistoryItems([]); // Clear history on error
        }
        setIsLoadingHistory(false);
      };

      fetchHistory();
    }
  }, [user]); // Re-fetch if the user changes (e.g., on login)

  const handleHistoryItemClick = (item) => { // Now takes the full item
    console.log('Sidebar: Clicked history item:', item);
    // In a real app, this would trigger loading the selected history
    // into the main content area (e.g., re-populating GeneareteContent)
    if (onLoadHistory) {
      onLoadHistory(item); // Call the prop passed from Layout
    }
  };

  if (!user) {
    return null; // Don't show sidebar if user is not logged in
  }

  return (
    <aside className="app-sidebar">
      <div className="sidebar-header">
        <button onClick={onNewGeneration} className="new-generation-button">
          + New Generation
        </button>
      </div>
      <nav className="sidebar-history">
        <p className="history-title">History</p>
        <ul>
          {isLoadingHistory && <li className="loading-history-message">Loading history...</li>}
          {historyError && <li className="error-history-message">{historyError}</li>}
          {!isLoadingHistory && !historyError && historyItems.length === 0 && (
            <li className="no-history-message">No history yet.</li>
          )}
          {!isLoadingHistory && !historyError && [...historyItems].reverse().map((item) => {
            // Truncate the question for display if it's too long
            const displayQuestion = item.question.length > 30 
              ? item.question.substring(0, 30) + "..." 
              : item.question;
            return ( // Ensure you explicitly return the JSX for each item
              <li key={item._id}> 
                <button 
                  onClick={() => handleHistoryItemClick(item)} // Pass the full item object
                  className="history-item-button"
                  title={item.question} // Show full question on hover
                >
                  {displayQuestion} 
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      {/* You could add a sidebar footer here for settings, profile link, etc. */}
    </aside>
  );
}