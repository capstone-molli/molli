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
  console.log('betId: ', betId);
  const betInfo = snap.data()

  db.collection("bets").doc(betId).update({ status: `watching` }).then(() => {
    if (betInfo.epicUser.length) {
      request({
        method: "GET",
        url: `https://us-central1-molli-e1c3f.cloudfunctions.net/scanInit?player=${betInfo.epicUser}`,
      }).catch(e => console.error(e))
    }
  }).catch(e => console.error(e))
  return null
});


// exports.importCSV = functions.https.onRequest((req, res) => {
//   const fs = require('fs')
//   const csvSync = require('csv-parse/lib/sync')
//   const file = './secondImport.csv'
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
//     console.log('Success! added ', objects.length)
//   }).catch(function (error) {
//     console.log('Failed', error)
//   })
// })
// exports.testDBAPI = functions.https.onRequest((req, res) => {
//   const betsBatch = db.batch()
//   const batchFunc = (toUpdateStats) => {
//     db.collection("bets").where("status", "==", "watching").get().then((snap) => {
//       // console.log('snap', snap);
//       snap.forEach(doc => {
//         betsBatch.update(doc.ref, toUpdateStats)
//       })
//       return betsBatch.commit()
//     }).catch(e => console.error(e))
//   }
//   batchFunc({ status: "expired" })
// })

exports.cronScan = functions.https.onRequest((req, res) => {
  let counter = 1
  if (req.query.counter) {
    counter += req.query.counter
  }
  if (counter < 17) {
    const batch = db.batch()
    const beta = functions.config().betafortniteapi
    let fortniteAPI = new Fortnite(
      [
        beta.user,
        beta.password,
        beta.clienttoken,
        beta.gametoken
      ]
    )
    const batchFunc = ({ status, player }) => {
      console.log('status, player', status, player);
      const betsBatch = db.batch()
      return db.collection("bets").where("epicUser", "==", player).where("status", "==", "watching").get().then((snap) => {
        snap.forEach(doc => {
          betsBatch.update(doc.ref, status)
        })
        return betsBatch.commit()
      }).catch(e => console.error(e))
    }

    fortniteAPI.login().then(() => {
      db.collection("twitchPlayers").where("status", "==", "watching").get().then((snap) => {
        snap.forEach(doc => {
          const player = doc.data()
          const playerStats = player.lifetimeStats
          const epicName = player.info.username
          setTimeout(() => {
            fortniteAPI.getStatsBR(epicName, "pc", "alltime")
              .then(result => {

                const oldMatchCount = playerStats.matches
                const oldWins = playerStats.wins

                const matchCount = result.lifetimeStats.matches
                const wins = result.lifetimeStats.wins

                const nowDate = new Date()
                if (nowDate - player.watchTimeStart >= 20 * 60 * 1000) {
                  console.log("Bet Expired")
                  batchFunc({ status: "Expired", player: player.twitchName })
                  batch.update(doc.ref, { status: "Expired" })
                } else {
                  if (matchCount > oldMatchCount) {
                    let newResult;
                    if (wins > oldWins) {
                      newResult = 'Win'
                    } else {
                      newResult = 'Lose'
                    }
                    console.log(`Result for ${epicName}: Player ${newResult}!`)
                    batchFunc({ status: newResult, player: player.twitchName })
                    batch.update(doc.ref, result)
                    batch.update(doc.ref, { status: `finished`, lastResult: newResult })
                  }
                }
                batch.commit()
                request({
                  method: "GET",
                  url: `https://us-central1-molli-e1c3f.cloudfunctions.net/cronScan?counter=${counter}`,
                })
                res.status(204).end()
              }).catch(e => console.error(e))
          }, 2000)

        }).catch(e => console.error(e))
      }).catch(e => res.status(200).end())
    }).catch(e => res.status(404).end())
  } else {
    console.log("Finished Cycle - 17")
    res.status(203).send("Finished Cycle - 17")
  }
})

exports.scanInit = functions.https.onRequest((req, res) => {
  const beta = functions.config().betafortniteapi
  let fortniteAPI = new Fortnite(
    [
      beta.user,
      beta.password,
      beta.clienttoken,
      beta.gametoken
    ]
  )
  const twitchName = req.query.player
  db.collection("twitchPlayers").doc(twitchName).get().then(playerInfo => {
    if (!playerInfo.exists || playerInfo.data().status !== "watching") {
      db.collection("twitch").doc(twitchName).get().then(epicInfo => {
        if (!epicInfo.data()) {
          console.log(`Add user: ${twitchName}`)
          res.status(404).send("User doesnt exist")
        } else {
          const epicPlayerName = epicInfo.data().epicName
          const playerBatch = db.batch()
          const playerRef = db.collection("twitchPlayers").doc(twitchName)

          fortniteAPI.login().then(() => {
            fortniteAPI.getStatsBR(epicPlayerName, "pc", "alltime")
              .then(result => {

                player = result.info.username

                if (playerInfo.exists) {
                  console.log(`Watching ${player}`)
                  playerBatch.update(playerRef, result)
                  playerBatch.update(playerRef, { status: `watching` })
                } else {
                  console.log(`Created and watching ${player}`)
                  playerBatch.set(playerRef, result)
                  playerBatch.update(playerRef, { twitchName: player })
                  playerBatch.update(playerRef, { status: `watching` })
                }
                playerBatch.commit()
                res.status(201).send()
              }).catch(e => {
                console.error(e)
                batchFunc({ status: "Player not found" })
                res.send("Player doesn't Exist")
              })
          }).catch(e => console.error(e))
        }
      }).catch(e => console.error(e))
    } else {
      console.log("Already Watching")
      res.send("Already Watching")
    }
  })
})

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
  const twitchName = req.query.player

  db.collection("twitchPlayers").doc(twitchName).get().then(playerInfo => {
    const playerStatus = playerInfo.data()
    db.collection("twitch").doc(twitchName).get().then(epicInfo => {
      const betsBatch = db.batch()
      let epicPlayerName;
      if (!epicInfo.data()) {
        console.log(`Add user: ${twitchName}`)
        res.status(404).send("User doesnt exist")
      } else {
        epicPlayerName = epicInfo.data().epicName

        const batchFunc = (toUpdateStats) => {
          db.collection("bets").where("epicUser", "==", twitchName).where("status", "==", "watching").get().then((snap) => {
            snap.forEach(doc => {
              betsBatch.update(doc.ref, toUpdateStats)
            })
            return betsBatch.commit()
          }).catch(e => console.error(e))
        }


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
                    db.collection("twitchPlayers").doc(twitchName).update(result)
                    db.collection("twitchPlayers").doc(twitchName).update({ status: `watching` })
                  }
                } else {
                  console.log(`Created and watching ${player}`)
                  db.collection("twitchPlayers").doc(twitchName).set(result).then(() => {
                    db.collection("twitchPlayers").doc(twitchName).update({ status: `watching` })
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
                  batchFunc({ status: "Expired" })
                  db.collection("twitchPlayers").doc(twitchName).update({ status: `expired` })
                  res.status(200).end()
                } else {

                  if (matchCount > oldMatchCount) {
                    let newResult;


                    if (wins > oldWins) {
                      newResult = 'Win'
                    } else {
                      newResult = 'Lose'
                    }
                    console.log(`Result for ${player}: Player ${newResult}!`)
                    batchFunc({ status: newResult })
                    db.collection("twitchPlayers").doc(twitchName).get().then(() => {
                      db.collection("twitchPlayers").doc(twitchName).update(result)
                      db.collection("twitchPlayers").doc(twitchName).update({ status: `finished`, lastResult: newResult })
                      res.status(204).end()
                    })

                  } else {
                    setTimeout(() => {

                      request({
                        method: "GET",
                        url: `https://us-central1-molli-e1c3f.cloudfunctions.net/betaConFetFortniteAPI?player=${twitchName}&time=${betDate}&status=continue`,
                      })
                      res.status(201).end()
                    }, 8000)
                  }
                }
              }).catch(e => {
                console.error(e)
                batchFunc({ status: "Player not found" })
                res.send("Player doesn't Exist")
              })
          }).catch(e => console.error(e))
        } else {
          res.send(`Already watching`)
        }
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
