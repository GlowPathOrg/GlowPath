###GlowPath
GlowPath is a progressive web application designed to enhance user safety by allowing real-time location sharing with trusted contacts and enabling instant alerts to contacts or authorities via an SOS button.



##Key Features:
•	Share live location with a trusted contact list.
•	Personalised emergency button to notify trusted contacts and authorities.
•	Map with nearby safe zones (e.g., police stations, hospitals).
•	Analysis viualisation for important safety statistics.

##Getting started:
•	Node.js: Ensure you have Node.js installed.
•	MongoDB: Set up a MongoDB instance.
•	HERE API: Create an account for an API key.
•	Weather API: Create an account for an API key.
•	Openstreet and Overpass API.
•	Twilio account for Twilio sid, token and phone number. 

##installation:
1.	Clone the repository:

git clone <the repo link>
cd GlowPath

2. Install dependencies:
-GlowPath (root)
npm install

- server:
 npm install 

- client:
npm install 

3.	Set up environment variables:
Create a .env file in the client for the weather API Key
Create a .env file in the server directory and add the following:
SERVER_PORT=3002
CLIENT_PORT=5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER


##Tech Stack
•	Frontend: React.js and Typescript
•	Backend: Node.js with Express.js for routing and API logic.
•	Database: MongoDB for storing data.
•	Authentication: JSON Web Tokens (JWT) for secure user sessions.
•	Mapping: Leaflet.js for an interactive map.
• APIs and Tools:
HERE API
Nominatim
Twilio
Openstreetmaps
Overpass
Weather API
•	Others: Axios.   


