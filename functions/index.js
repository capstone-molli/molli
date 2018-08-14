const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise');
const Fortnite = require("fortnite-api");

//firestore in functions
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
db.settings({ timestampsInSnapshots: true })


exports.conFetFortniteAPI = functions.https.onRequest((req, res) => {

  request({
    method: "GET",
    url: `https://api.fortnitetracker.com/v1/profile/pc/${req.query.player}`,
    headers: {
      "TRN-Api-Key": functions.config().fortniteapi.key
    },
    json: true
  }).then(result => {
    // console.log('result', result);
    /*"accountId",
    "platformId",
    "platformName",
    "platformNameLong",
    "epicUserHandle",
    "stats",
    "lifeTimeStats",
    "recentMatches",*/
    // db.collection("players").doc(result.epicUserHandle).set(result)
    const bet = {

      betAmount: "12",
      betType: "Win",
      description: "win",
      epicUser: "DominicSmorraJr",
      timePlaced: `2018-08-14T16:32:30.19`
    }
    // console.log('bet', bet);
    const match = result.recentMatches[0]
    // console.log('checking match: ', match);
    db.collection("matches").doc(result.epicUserHandle).set(match)

    let matchDate = new Date(match.dateCollected)
    const betDate = new Date(`2018-08-14T17:17:30.19`)
    matchDate -= (4 * 60 * 60 * 1000)
    // console.log('match.dateCollected', match.dateCollected);
    // console.log('match date', d.getDate(), '/', d.getMonth(), '-', [d.d.getHours(), d.getMinutes(), d.getSeconds()].join(':'));
    console.log('betDate < d', betDate < matchDate);
    console.log('matchDate', matchDate);
    console.log('betDate', betDate);
    if (betDate < matchDate) {
      if (match.top1 && bet.betType === 'Win') {
        console.log('Player wins the bet!')
      } else {
        console.log('Player lost the bet!')
      }
      res.status(201).send()
    } else {
      console.log("No result yet, lets try again")
      setTimeout(() => {
        request({
          method: "GET",
          url: `https://us-central1-molli-e1c3f.cloudfunctions.net/conFetFortniteAPI?player=${req.query.player}`,
        })
        res.status(200).send()
      }, 20000)
    }
  }).catch(e => console.error(e))
})
// exports.constFetchFortniteAPI = functions.https.onRequest((req, res) => {
//   const beta = functions.config().betafortniteapi
//   let fortniteAPI = new Fortnite(
//     [
//       beta.user,
//       beta.password,
//       beta.clienttoken,
//       beta.gametoken
//     ],
//     {
//       debug: true
//     }
//   );

//   fortniteAPI.login().then(() => {
//     let oldStats;
//     // console.log(`Watching ${req.querys.player}`)
//     db.collection("playerStats").doc(req.query.player).get().then(dbStats => {

//       if (!dbStats.exists) {
//         console.log(`Did not find${req.query.player}`)
//         fortniteAPI.getStatsBR(req.query.player, "pc", "alltime")
//           .then(({ group, info, lifetimeStats }) => {
//             oldStats = { group, info, lifetimeStats, timeUpdated: Date.now() }
//             db.collection("playerStats").doc(req.query.player).set(oldStats)
//           })
//       } else {
//         oldStats = dbStats.data()
//         // console.log('Found`${req.query.player}', oldStats);
//         // console.log('How many minutes ago: ', Math.round(((Date.now() - oldStats.timeUpdated % 86400000) % 3600000) / 60000))
//         if (Math.round(((Date.now() - oldStats.timeUpdated % 86400000) % 3600000) / 60000) > 15) {
//           // console.log("Updating`${req.query.player} Record")
//           fortniteAPI.getStatsBR(`${req.query.player}`, "pc", "alltime")
//             .then(({ group, info, lifetimeStats }) => {
//               oldStats = { group, info, lifetimeStats, timeUpdated: Date.now() }
//               db.collection("playerStats").doc(`${req.query.player}`).set(oldStats)
//             })
//         }
//       }
//       // console.log('oldStats to compare', oldStats);
//       fortniteAPI.getStatsBR(req.query.player, "pc", "alltime")
//         .then(newStats => {
//           console.log(`Checking ${req.query.player}'s stats`)
//           if (newStats.lifetimeStats.matches !== oldStats.lifetimeStats.matches) {
//             // console.log("Results are in!")
//             if (newStats.lifetimeStats.wins > oldStats.lifetimeStats.wins) {
//               console.log(`${req.query.player} Won!`)
//             } else {
//               console.log(`${req.query.player} Lost!`)
//             }
//             db.collection("playerStats").doc(req.query.player).update(newStats)
//             db.collection("playerStats").doc(req.query.player).update({ timeUpdated: Date.now() })
//             res.status(201).end()
//           } else {
//             db.collection("playerStats").doc(req.query.player).update({ timeUpdated: Date.now() }).then(() => {
//               setTimeout(() => {
//                 request({
//                   method: "GET",
//                   url: `https://us-central1-molli-e1c3f.cloudfunctions.net/constFetchFortniteAPI?player=${req.query.player}`,
//                 })
//                 res.status(201).end()
//               }, 20000)
//             })
//           }
//         }).catch(err => {
//           console.log('Keys: ', Object.keys(err))
//           console.error(err)
//         })

//     }).catch(err => console.error(err));
//   }).catch(err => console.error(err))
// })