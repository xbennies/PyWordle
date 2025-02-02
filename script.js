document.addEventListener('DOMContentLoaded', () => {
  fetch('https://pywordle.vercel.app/webservice/dailyword')
    .then(response => response.json()) // Convert the response to JSON
    .then(data => {
      // Access the 'word' property from the response data and set it into the HTML element
      document.getElementById('wotd').textContent = data.word;
    })
    .catch(error => {
      console.error('Error fetching daily word:', error);
      document.getElementById('wotd').textContent = 'Failed to load daily word';
    });
});
