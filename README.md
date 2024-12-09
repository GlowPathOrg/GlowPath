# 🌟 GlowPath

GlowPath is a progressive web application designed to enhance user safety by enabling **real-time location sharing** with trusted contacts and providing instant alerts to contacts or authorities via an **SOS button**.

---

## 🚀 Key Features:
- **Real-Time Location Sharing**: Share your live location with a trusted contact list.  
- **SOS Button**: Notify trusted contacts and authorities during emergencies with a personalized emergency button.  
- **Safe Zone Mapping**: View nearby safe zones like police stations and hospitals on an interactive map.  
- **Safety Analytics**: Visualize important safety statistics for better decision-making.  

---

## 🛠️ Getting Started:
To run GlowPath locally, ensure the following dependencies and accounts are set up:  
1. **Node.js**: [Download and install Node.js](https://nodejs.org).  
2. **MongoDB**: Set up a local or cloud-based MongoDB instance (e.g., [MongoDB Atlas](https://www.mongodb.com/atlas)).  
3. **API Keys**:  
   - [HERE API](https://developer.here.com)  
   - [Weather API](https://www.weatherapi.com/)  
   - [Twilio](https://www.twilio.com/) for sending emergency messages.  
4. **OpenStreetMap and Overpass API**: No additional setup needed.  

---

## 📦 Installation:

### 1. Clone the repository:

git clone <repository-link>
cd GlowPath

### 2. Install dependencies:
-root Directory
npm install

- server:
 cd server
 npm install 

- client:
cd client
npm install 

### 3.	Set up environment variables:
Create a .env file in the client for the weather API Key
Create a .env file in the server directory and add the following:
SERVER_PORT=3002
CLIENT_PORT=5173
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER


## 💻 Tech Stack
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


## 🤝 Contributing:

Contributions, issues, and feature requests are welcome!
Feel free to check the issues page or submit a pull request.

## Authors:
Hadil Ben Koura [linkedIn](www.linkedin.com/in/hadil-benkoura)
Mellissa Cessna
Jonas Rinderlin

Enjoy using GlowPath, and stay safe! 🚶‍♂️🛡️

