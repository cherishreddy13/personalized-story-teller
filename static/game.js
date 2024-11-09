document.getElementById('generate-story-btn').addEventListener('click', async function () {
   const userInput = document.getElementById('user-input').value;
   const char_name = document.getElementById('char').value;
   const gender = document.getElementById('gender').value;

   if (!userInput) {
       alert("Please enter your feelings to generate a story.");
       return;
   }

   if (!char_name) {
       alert("Please enter a character name.");
       return;
   }

   if (!gender) {
       alert("Please enter a character gender.");
       return;
   }

   // Send the user input, character name, and gender to the backend for sentiment analysis and story generation
   const response = await fetch('/generate_story', {
       method: 'POST',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify({
           user_input: userInput,
           char_name: char_name,
           gender: gender
       })
   });

   const data = await response.json();

   // Display the mood and the generated story
   document.getElementById('mood').innerText = `Your Mood: ${data.mood.charAt(0).toUpperCase() + data.mood.slice(1)}`;
   document.getElementById('story').innerText = data.story;

   // Play background music
   const backgroundMusic = document.getElementById('background-music');
   backgroundMusic.volume = document.getElementById('background-volume').value; // Set volume from slider
   backgroundMusic.play();

   // Play sound effect based on mood
   let moodSound;
   switch (data.mood) {
       case 'happy':
           moodSound = document.getElementById('happy-sound');
           break;
       case 'sad':
           moodSound = document.getElementById('sad-sound');
           break;
       case 'neutral':
           moodSound = document.getElementById('neutral-sound');
           break;
   }
   if (moodSound) {
       moodSound.volume = document.getElementById('sound-volume').value; // Set volume from slider
       moodSound.currentTime = 0; // Reset sound to start
       moodSound.play();
   }

   // Voice narration of the story
   const utterance = new SpeechSynthesisUtterance(data.story);
   speechSynthesis.speak(utterance);
});

// Event listeners for volume controls
document.getElementById('background-volume').addEventListener('input', function () {
   const backgroundMusic = document.getElementById('background-music');
   backgroundMusic.volume = this.value; // Adjust background music volume
});

document.getElementById('sound-volume').addEventListener('input', function () {
   const happySound = document.getElementById('happy-sound');
   const sadSound = document.getElementById('sad-sound');
   const neutralSound = document.getElementById('neutral-sound');

   // Adjust sound effects volume
   happySound.volume = this.value;
   sadSound.volume = this.value;
   neutralSound.volume = this.value;
});