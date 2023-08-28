window.addEventListener('beforeunload', () => {
    // Send a request to the server to clear the database
    fetch('/clear-database', { method: 'POST' });
  });