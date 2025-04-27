\*This is a submission for the [Alibaba Cloud](https://int.alibabacloud.com/m/1000402443/) Challenge: [Build a Web Game](https://dev.to/challenges/alibaba).\*\*

## What WE Built

<!-- Share a brief overview of your robot-themed game project. -->

**_What if we wrapped Soul Knights and Alibaba Cloud Services into a robot-themed web game?_** As a result, several viruses and bugs infected the laboratory of Alibaba, wreaking havoc and chaos. Now, as a sentient and righteous robot, it is up to you to save and cleanse the laboratory, fighting several corrupted refrigerators and heaters!

**RoBolts** is a robot-themed survival hybrid action RPG inspired by the game Soul Knights. Key features are as follows:
Uniquely created sprites and tiles for enemies and bosses, which may be the head of a robot or a weird TV man that came from brain rot.
Three starter weapons that have distinct qualities and abilities to suit your taste in gearing up and battling these corrupted robots

#### U I I A I U I I I A I, gear up and choose your weapons as you cleanse the bosses that wreak damage in the laboratory!

## Demo

<!-- Share a link to your game and include some screenshots here. -->

## Alibaba Cloud Services Implementation

<!-- Provide a detailed breakdown of each Alibaba Cloud service you utilized, why you chose it, how you integrated it into your game, and your experience working with it. Be specific about the benefits and any challenges you encountered with each service. →
## Alibaba Cloud Services Implementation

<!-- Provide a detailed breakdown of each Alibaba Cloud service you utilized, why you chose it, how you integrated it into your game, and your experience working with it. Be specific about the benefits and any challenges you encountered with each service. -->

### Overview of Alibaba Cloud Services in Your Game

Alibaba Cloud Object Storage Service (OSS) was selected for our leaderboard system based on several key factors:

1.  **Serverless Architecture**: OSS allowed us to implement a persistent data storage solution without maintaining a complex database infrastructure.
2.  **Cost Efficiency**: We subcribed for the product for a short time, since we cannot avail the free trial for not having a decent credit/debit card.
3.  **Simplicity**: OSS provided a straightforward API for storing and retrieving JSON data, which aligned well with our leaderboard's relatively simple data structure.
4.  **Global Availability**: As a globally distributed storage service, OSS ensured low-latency access for players across different regions, particularly in Southeast Asia where our primary audience is located.
5.  **Integration with Node.js**: The ali-oss SDK offered excellent compatibility with our Express.js backend service.

### Our integration involved several components:

1.  **Server-Side Implementation**:

```javacript
const OSS = require('ali-oss');

// Initialize OSS client with credentials from environment variables
const ossClient = new OSS({
  region: process.env.OSS_REGION,
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  bucket: process.env.OSS_BUCKET
});

// Leaderboard stored as a single JSON file
const LEADERBOARD_FILE = 'leaderboard.json';
```

2.  **API Endpoints**:

    - GET endpoint to retrieve scores
    - POST endpoint to submit new scores

3.  **Data Storage Pattern**:

    - We store all leaderboard entries in a single JSON file
    - When retrieving, we sort by score and return the top entries
    - When submitting, we read the existing file, append the new score, and write it back

4.  **Client-Side Service**:

    - A LeaderboardService class handles communication with our backend
    - Provides methods for fetching and submitting scores
    - Handles error cases gracefully with appropriate user feedback

### Our Experience Working With Alibaba Cloud

**Story time.** <br>Since we cannot avail the free trial we really went out buying for the stuff 😆. <br>
About setting the OSS up, at first I really got no idea on where to start after availing it, like **_"what do you mean buckets?" and "where do I actually find and get this access keys?" 😭_** <br>
Luckily, there are some tutorials on Youtube and there's also AI, that really helped us to set up the backend of our game (let me also say that this is my first time tapping into backend stuff, so it really crack my head) <br>
So, yeah! Even though we don't really know what we are doing on the first line, as long as we keep going, we'll get there. (⚠ LOCAL JOKE AHEAD) <br><br>
Like, **STEP BY STEP PALA S'YA, SASAKSES RIN PALA! in integrating the Alibaba Cloud Services 😆😅**

## Game Development Highlights

<!-- Briefly share any particularly interesting aspects of your development process or features you're proud of. -->

As first-year computer science students, several development highlights were introduced to us:

- First Game Development Project:
- First Utilization of Alibaba Cloud Services:
- First Implementation and Personal Creation of Sprites and Tiles:

<!-- Team Submissions: Please pick one member to publish the submission and credit teammates by listing their DEV usernames directly in the body of the post. -->

## Meet the TEAM

**Cilon, Rachel Anne** **_[@rachelannec](https://dev.to/rachelannec)_** <br>
**Inso, Eliazar N.** **_[@deadbush225](https://dev.to/deadbush225)_** <br>
**Rodriguez, Jan Earl F.** **_[@rawrearl](https://dev.to/rawrearl)_**

## Acknowledgements

<!-- Credits sa mga pinagnakawan natin ng sprites, tiles, and sounds hahah -->

- Sounds
  - [Freesound](https://freesound.org/)
  - [Pixabay](https://pixabay.com/)
- Other sprites (cause the characters and other stuffs are originals 💅💅)
  - ***
  - ***

<!-- ⚠️ By submitting this entry, you agree to receive communications from Alibaba Cloud regarding products, services, events, and special offers. You can unsubscribe at any time. Your information will be handled in accordance with Alibaba Cloud's Privacy Policy. -->

<!-- Don't forget to add a cover image (if you want). -->

<!-- Thanks for participating! -->
