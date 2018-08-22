const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise');
const Fortnite = require("fortnite-api");

//firestore in functions
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
db.settings({ timestampsInSnapshots: true })

// exports.betUpdate = functions.firestore.document(`bets/{betId}`).onUpdate((snap, context) => {
//   //TODO: On update field of winnerId
//   //increase userId.balance and decrease takerId.balance if condition matches result else opposite 



// })


exports.betCreate = functions.firestore.document(`bets/{betId}`).onCreate((snap, context) => {

  const betId = context.params.betId
  const betInfo = snap.data()

  return db.collection("bets").doc(betId).update({ status: `watching` }).then(() => {
    const beta = functions.config().betafortniteapi
    let fortniteAPI = new Fortnite(
      [
        beta.user,
        beta.password,
        beta.clienttoken,
        beta.gametoken
      ]
    )
    const twitchName = betInfo.epicUser
    return db.collection("twitchPlayers").doc(twitchName).get().then(playerInfo => {
      if (!playerInfo.exists || playerInfo.data().status !== "watching") {
        return db.collection("twitch").doc(twitchName).get().then(epicInfo => {
          if (!epicInfo.data()) {
            console.log(`Add user: ${twitchName}`)
          } else {
            const epicPlayerName = epicInfo.data().epicName
            return fortniteAPI.login().then(() => {
              return fortniteAPI.getStatsBR(epicPlayerName, "pc", "alltime")
                .then(result => {
                  const playerBatch = db.batch()
                  const playerRef = db.collection("twitchPlayers").doc(twitchName)
                  player = result.info.username
                  if (playerInfo.exists) {
                    console.log(`Watching ${player}`)
                    playerBatch.update(playerRef, result)
                    playerBatch.update(playerRef, { status: `watching`, checkHere: `${Date.now()}` })
                  } else {
                    console.log(`Created and watching ${player}`)
                    playerBatch.set(playerRef, result)
                    playerBatch.update(playerRef, { twitchName, status: `watching`, checkHere: `${Date.now()}` })
                  }
                  return playerBatch.commit()

                }).catch(e => {
                  console.error(e)
                  const betsBatch = db.batch()
                  return db.collection("bets").where("epicUser", "==", epicPlayerName).where("status", "==", "watching").get().then((snap) => {
                    snap.forEach(doc => {
                      betsBatch.update(doc.ref, { status: "Player not found" })
                    })
                    return betsBatch.commit()
                  })

                })
            }).catch(e => console.error(e))
          }
        }).catch(e => console.error(e))
      } else {
        console.log("Already Watching")
      }
    })
  })
})
exports.cronScan = functions.https.onRequest((req, res) => {
  let counter = 1
  if (req.query.counter) {
    counter += Number(req.query.counter)
  }
  if (counter < 5) {
    const batch = db.batch()
    const beta = functions.config().betafortniteapi
    const fortniteAPI = new Fortnite(
      [
        beta.user,
        beta.password,
        beta.clienttoken,
        beta.gametoken
      ]
    )

    fortniteAPI.login().then(() => {

      db.collection("twitchPlayers").where("status", "==", "watching").get().then((snap) => {
        snap.forEach(doc => {
          const batchFunc = ({ status, player }) => {
            const betsBatch = db.batch()
            return db.collection("bets").where("epicUser", "==", player).where("status", "==", "watching").get().then((snap) => {
              snap.forEach(doc => {
                betsBatch.update(doc.ref, status)
              })
              return betsBatch.commit()
            }).catch(e => console.error(e))
          }
          const player = doc.data()
          const playerStats = player.lifetimeStats
          const epicName = player.info.username

          setTimeout(() => {
            fortniteAPI.getStatsBR(epicName, "pc", "alltime").then(result => {
              const oldMatchCount = playerStats.matches
              const oldWins = playerStats.wins

              const matchCount = result.lifetimeStats.matches
              const wins = result.lifetimeStats.wins

              const nowDate = Date.now()
              if (nowDate - Date(player.watchTimeStart) >= 20 * 60 * 1000) {

                console.log("Bet Expired")
                batchFunc({ status: { status: "Expired" }, player: player.twitchName })
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
                  batchFunc({ status: { status: newResult }, player: player.twitchName })
                  batch.update(doc.ref, result)
                  batch.update(doc.ref, {
                    status: `finished`, lastResult: newResult
                  })
                  batch.commit()
                }
              }
            }).catch(e => console.error(e))
          })
        }, Math.random(5) * 1000)
      }).catch(e => console.error(e))
      setTimeout(() => {
        request({
          method: "GET",
          url: `https://us-central1-molli-e1c3f.cloudfunctions.net/cronScan?counter=${counter}`
        })
        res.status(204).end()
      }, 10000)
    }).catch(e => {
      // console.error(e)
      res.status(200).end()
    })
  } else {
    // console.log("Finished Cycle - 17")
    res.status(203).send("Finished Cycle - 17")
  }
})