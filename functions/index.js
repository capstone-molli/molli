const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise');
const Fortnite = require("fortnite-api");

//firestore in functions
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
db.settings({ timestampsInSnapshots: true })

exports.betCreate = functions.firestore.document(`bets/{betId}`).onCreate((snap, context) => {
  const betId = context.params.betId
  const betInfo = snap.data();
  // console.log('betInfo', betInfo);
  db.collection("bets").doc(betId).update({ status: `watching` }).then(() => {
    if (betInfo.epicUser.length) {
      request({
        method: "GET",
        url: `https://us-central1-molli-e1c3f.cloudfunctions.net/betaConFetFortniteAPI?player=${betInfo.epicUser}`,
      }).catch(e => console.error(e))
    }
  }).catch(e => console.error(e))
  return null
});
// exports.importCSV = functions.https.onRequest((req, res) => {
//   const fs = require('fs')
//   const csvSync = require('csv-parse/lib/sync')
//   const file = './FortNiteLeaderboard.csv'
//   let data = fs.readFileSync(file)
//   let responses = csvSync(data)

//   // convert CSV data into objects
//   let objects = []

//   responses.forEach(function (response) {
//     objects.push({
//       twitchName: response[0],
//       epicName: response[1],
//     })
//   }, this)

//   // set the data from objects
//   return db.runTransaction(function (transaction) {
//     return transaction.get(db.collection(`twitch`)).then(doc => {
//       objects.forEach(function (object) {
//         transaction.set(db.collection(`twitch`).doc(object.twitchName), { epicName: object.epicName })
//       }, this)
//     })
//   }).then(function () {
//     console.log('Success!')
//   }).catch(function (error) {
//     console.log('Failed', error)
//   })
// })

exports.betaConFetFortniteAPI = functions.https.onRequest((req, res) => {
  const beta = functions.config().betafortniteapi
  let fortniteAPI = new Fortnite(
    [
      beta.user,
      beta.password,
      beta.clienttoken,
      beta.gametoken
    ]
  )
  const playerTwitch = req.query.player

  db.collection("players2").doc(playerTwitch).get().then(playerInfo => {
    const betsRef = db.collection("bets").where("epicUser", "==", playerTwitch)
    const playerStatus = playerInfo.data()
    db.collection("twitch").doc(playerTwitch).get().then(epicInfo => {
      const betsBatch = db.batch()
      const epicPlayerName = epicInfo.data().epicName
      // console.log('epicPlayerName', epicPlayerName);

      if (!playerInfo.exists || playerStatus.status !== 'watching' || req.query.status === 'continue') {
        fortniteAPI.login().then(() => {
          fortniteAPI.getStatsBR(epicPlayerName, "pc", "alltime")
            .then(result => {
              let oldMatchCount;
              let oldWins;
              player = result.info.username
              const matchCount = result.lifetimeStats.matches
              const wins = result.lifetimeStats.wins

              if (playerInfo.exists) {
                oldMatchCount = playerStatus.lifetimeStats.matches
                oldWins = playerStatus.lifetimeStats.wins
                if (!req.query.status) {
                  console.log(`Watching ${player}`)
                  db.collection("players2").doc(playerTwitch).update(result)
                  db.collection("players2").doc(playerTwitch).update({ status: `watching` })
                }
              } else {
                console.log(`Created and watching ${player}`)
                db.collection("players2").doc(playerTwitch).set(result).then(() => {
                  db.collection("players2").doc(playerTwitch).update({ status: `watching` })
                })
                oldMatchCount = matchCount
                oldWins = wins
              }

              let betDate;
              if (req.query.time) {
                betDate = new Date(req.query.time)
              } else {
                betDate = new Date()
              }
              const nowDate = new Date()
              if (nowDate - betDate >= 20 * 60 * 1000) {
                console.log("Bet Expired")
                betsBatch.update(betsRef.where("status", "==", "watching"), { status: `expired` })
                db.collection("players2").doc(playerTwitch).update({ status: `expired` })
                res.status(200).end()
              } else {

                if (matchCount > oldMatchCount) {
                  let newResult;

                  if (wins > oldWins) {
                    newResult = 'win'
                  } else {
                    newResult = 'lost'
                  }
                  console.log(`Result for ${player}: Player ${newResult} the bet!`)
                  betsBatch.update(betsRef.where("status", "==", "watching"), { status: newResult }).then(() => res.status(204).send())
                  db.collection("players2").doc(playerTwitch).get().then(() => {
                    db.collection("players2").doc(playerTwitch).update(result)
                    db.collection("players2").doc(playerTwitch).update({ status: `finished`, lastResult: newResult })
                  })

                } else {
                  setTimeout(() => {

                    request({
                      method: "GET",
                      url: `https://us-central1-molli-e1c3f.cloudfunctions.net/betaConFetFortniteAPI?player=${player}&time=${betDate}&status=continue`,
                    })
                    res.status(201).end()
                  }, 8000)
                }
              }
            }).catch(e => {
              console.error(e)
              const betErrored = betsRef.where("status", "==", "watching")
              betsBatch.update(betErrored, { status: "Player not found" })
              res.send("Player doesn't Exist")
            })
        }).catch(e => console.error(e))
      } else {
        // console.log(`Already watching`)
        res.send(`Already watching`)
      }
    }).catch(e => console.error(e))
  }).catch(e => console.error(e))
})

// Back up API Request 

// exports.conFetFortniteAPI = functions.https.onRequest((req, res) => {
//   let player = req.query.player
//   db.collection("players").doc(player).get().then(playerInfo => {

//     const playerStatus = playerInfo.data()

//     if (!playerInfo.exists || playerStatus.status !== 'watching' || req.query.status === 'continue') {
//       request({
//         method: "GET",
//         url: `https://api.fortnitetracker.com/v1/profile/pc/${player}`,
//         headers: {
//           "TRN-Api-Key": functions.config().fortniteapi.key
//         },
//         json: true
//       }).then(result => {

//         // console.log('result', result);
//         /*"accountId",
//         "platformId",
//         "platformName",
//         "platformNameLong",
//         "epicUserHandle",
//         "stats",
//         "lifeTimeStats",
//         "recentMatches",*/
//         // lifeTimeStats ->7: Matches Played , 8: Wins
//         let oldMatchCount;
//         let oldWins;

//         const matchCount = result.lifeTimeStats.filter(ele => ele.key === "Matches Played")[0].value
//         const wins = result.lifeTimeStats.filter(ele => ele.key === "Wins")[0].value

//         if (playerInfo.exists) {
//           oldMatchCount = playerStatus.lifeTimeStats.filter(ele => ele.key === "Matches Played")[0].value
//           oldWins = playerStatus.lifeTimeStats.filter(ele => ele.key === "Wins")[0].value
//           if (!req.query.status) {
//             console.log(`Watching ${result.epicUserHandle}`)
//             db.collection("players").doc(result.epicUserHandle).update(result)
//             db.collection("players").doc(result.epicUserHandle).update({ status: `watching` })
//           }
//         } else {
//           console.log(`Created and watching ${result.epicUserHandle}`)
//           db.collection("players").doc(result.epicUserHandle).set(result).then(() => {
//             db.collection("players").doc(result.epicUserHandle).update({ status: `watching` })
//           })
//           // db.collection("players").doc(result.epicUserHandle).set(match)

//           oldMatchCount = matchCount
//           oldWins = wins
//         }

//         let betDate;
//         if (req.query.time) {
//           betDate = new Date(req.query.time)
//         } else {
//           betDate = new Date()
//           // console.log('Setting Bet Date', betDate);
//         }
//         const nowDate = new Date()
//         if (nowDate - betDate >= 20 * 60 * 1000) {
//           console.log("Bet Expired")
//           db.collection("players").doc(result.epicUserHandle).update({ status: `expired` })
//           res.status(200).end()
//         } else {

//           if (matchCount > oldMatchCount) {
//             let newResult;
//             if (wins > oldWins && bet.betType === 'Win') {
//               console.log(`Result for ${player}: Player wins the bet!`)
//               newResult = 'win'
//             } else {
//               console.log(`Result for ${player}: Player lost the bet!`)
//               newResult = 'lost'
//             }
//             db.collection("players").doc(result.epicUserHandle).get().then(() => {
//               db.collection("players").doc(result.epicUserHandle).update(result)
//               db.collection("players").doc(result.epicUserHandle).update({ status: `finished`, lastResult: newResult, timeframe: { betDate, nowJS: new Date() } }).then(() => res.status(204).send())
//             })

//           } else {
//             setTimeout(() => {
//               res.status(200).end()
//               request({
//                 method: "GET",
//                 url: `https://us-central1-molli-e1c3f.cloudfunctions.net/conFetFortniteAPI?player=${player}&time=${betDate}&status=continue`,
//               })
//             }, 15000)

//           }
//         }
//       }).catch(e => console.error(e))
//     } else {
//       console.log(`Already watching`)
//       res.send(`Already watching`)
//     }
//   }).catch(e => console.error(e))
// })
