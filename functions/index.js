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

exports.updateDB = functions.https.onRequest((req, res) => {
  const batch = db.batch()
  db.collection("bets").where("userId", "==", "T3uUSc1e9waYZGnTB6fXUHsVWO93").get().then((snap) => {
    snap.forEach(doc => {
      batch.update(doc.ref, { userId: "4ZJSr34c4JMeuRtuQBxJrFBNzse2" })
    })
    batch.commit()
  })
})
exports.betCreate = functions.firestore.document(`bets/{betId}`).onCreate((snap, context) => {

  const betId = context.params.betId
  const betInfo = snap.data()

  return db.collection("bets").doc(betId).update({ status: `watching` }).then(() => {

    const twitchName = betInfo.epicUser
    return db.collection("twitchPlayers").doc(twitchName).get().then(playerInfo => {
      if (!playerInfo.exists || playerInfo.data().status !== "watching") {
        return db.collection("twitch").doc(twitchName).get().then(epicInfo => {
          if (!epicInfo.data()) {
            console.log(`Add user: ${twitchName}`)
          } else {
            const epicPlayerName = epicInfo.data().epicName
            return request({
              method: "GET",
              url: `https://api.fortnitetracker.com/v1/profile/pc/${epicPlayerName}`,
              headers: {
                "TRN-Api-Key": functions.config().fortniteapi.key
              },
              json: true
            }).then(result => {

              const playerBatch = db.batch()
              const playerRef = db.collection("twitchPlayers").doc(twitchName)
              // player = result.info.username
              player = result.epicUserHandle
              return db.collection("twitchPlayers").doc("queue").get().then(preQueueData => {
                const currQueue = preQueueData.data().queue
                currQueue.push(twitchName)
                playerBatch.update(preQueueData.ref, { queue: currQueue })
                if (playerInfo.exists) {
                  console.log(`Watching ${player}`)
                  playerBatch.update(playerRef, result)
                  playerBatch.update(playerRef, { status: `watching`, checkHere: `${Date.now()}`, queue: currQueue.length - 1 })
                } else {
                  console.log(`Created and watching ${player}`)
                  playerBatch.set(playerRef, result)
                  playerBatch.update(playerRef, { twitchName, status: `watching`, checkHere: `${Date.now()}`, queue: currQueue.length - 1 })
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

exports.queueCheck = functions.https.onRequest((req, res) => {
  let counter = 1;
  if (req.query.counter) {
    counter += Number(req.query.counter)
  }
  if (counter < 9) {
    const player = req.query.player
    db.collection("twitchPlayers").doc('queue').get().then(result => {
      const currQueue = result.data().queue
      const nextIdx = currQueue.indexOf(player) + 1
      setTimeout(() => {
        if (nextIdx < currQueue.length) {
          const next = currQueue[nextIdx]
          request({
            method: "GET",
            url: `https://us-central1-molli-e1c3f.cloudfunctions.net/queueCheck?player=${next}&counter=${counter}`
          })
          res.status(203).end()
        } else if (currQueue.length === 1) {
          res.status(202).send("Finished")
        } else {
          request({
            method: "GET",
            url: `https://us-central1-molli-e1c3f.cloudfunctions.net/queueCheck?player=head&counter=${counter}`
          })
          res.status(203).end()
        }
      }, 5000)
      if (currQueue.length > 1 && player !== "head") {
        request({
          method: "GET",
          url: `https://us-central1-molli-e1c3f.cloudfunctions.net/queueCheckOn?player=${player}`
        })
        res.status(204).send(`Checking on ${player}`)
      }
    })
  } else {
    res.status(200).send("Finished")
  }
})

exports.queueCheckOn = functions.https.onRequest((req, res) => {
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
    const batchFunc = ({ status, player }) => {
      const betsBatch = db.batch()
      return db.collection("bets").where("epicUser", "==", player).where("status", "==", "watching").get().then((snap) => {
        snap.forEach(doc => {
          betsBatch.update(doc.ref, status)
        })
        return betsBatch.commit()
      }).catch(e => console.error(e))
    }
    const player = req.query.player
    db.collection("twitchPlayers").doc(player).get().then(playerRef => {
      const twitchPlayerData = playerRef.data()
      const epicName = twitchPlayerData.epicUserHandle

      const oldMatchCount = twitchPlayerData.lifeTimeStats.filter(ele => ele.key === "Matches Played")[0].value
      const oldWins = twitchPlayerData.lifeTimeStats.filter(ele => ele.key === "Wins")[0].value

      fortniteAPI.getStatsBR(epicName, "pc", "alltime").then(result => {
        const matchCount = result.lifetimeStats.matches
        const wins = result.lifetimeStats.wins

        db.collection("twitchPlayers").doc('queue').get().then(queueRef => {
          const currQueue = queueRef.data().queue
          const nowDate = Date.now()
          if (nowDate - Date(twitchPlayerData.checkHere) >= 20 * 60 * 1000) {

            console.log("Bet Expired")
            batchFunc({ status: { status: "Expired" }, player })
            batch.update(playerRef.ref, { status: "Expired" })
            currQueue.splice(currQueue.indexOf(player), 1)
            db.collection("twitchPlayers").doc("queue").update({ queue: currQueue })
            return batch.commit()
          } else {
            if (matchCount > oldMatchCount) {
              let newResult;
              if (wins > oldWins) {
                newResult = 'Win'
              } else {
                newResult = 'Lose'
              }
              console.log(`Result for ${epicName}: Player ${newResult}!`)
              batchFunc({ status: { status: newResult }, player })
              // batch.update(doc.ref, result)
              batch.update(playerRef.ref, {
                status: `finished`, lastResult: newResult
              })
              currQueue.splice(currQueue.indexOf(player), 1)
              db.collection("twitchPlayers").doc("queue").update({ queue: currQueue })
              res.status(200).end()
              return batch.commit()
            }
          }
          res.status(204).end()
        }).catch(e => console.error(e))
      })
    })
  }).catch(e => {
    // console.error(e)
    res.status(200).end()
  })
})

const express = require('express');
const cors = require('cors')({ origin: true });
const app = express();

// TODO: Remember to set token using >> firebase functions:config:set stripe.token="SECRET_STRIPE_TOKEN_HERE"
const stripe = require('stripe')(functions.config().stripe.token);

function charge(req, res) {
  const body = JSON.parse(req.body);
  const token = body.token.id;
  const amount = body.charge.amount;
  const currency = body.charge.currency;

  // Charge card
  stripe.charges.create({
    amount,
    currency,
    description: 'Firebase Example',
    source: token,
  }).then(charge => {
    send(res, 200, {
      message: 'Success',
      charge,
    });
  }).catch(err => {
    console.log(err);
    send(res, 500, {
      error: err.message,
    });
  });
}

function send(res, code, body) {
  res.send({
    statusCode: code,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(body),
  });
}

app.use(cors);
app.post('/', (req, res) => {

  // Catch any unexpected errors to prevent crashing
  try {
    charge(req, res);
  } catch (e) {
    console.log(e);
    send(res, 500, {
      error: `The server received an unexpected error. Please try again and contact the site admin if the error persists.`,
    });
  }
})



exports.charge = functions.https.onRequest(app);





