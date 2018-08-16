const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise');
const Fortnite = require("fortnite-api");

//firestore in functions
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
db.settings({ timestampsInSnapshots: true })

exports.betUpdate = functions.firestore.document(`bets/{betId}`).onCreate((snap, context) => {
  console.log('context', context);
  const newBet = snap.data;
  console.log('newBet', newBet);


});

exports.conFetFortniteAPI = functions.https.onRequest((req, res) => {
  let player = req.query.player
  db.collection("players").doc(player).get().then(playerInfo => {

    const playerStatus = playerInfo.data()

    if (!playerInfo.exists || playerStatus.status !== 'watching' || req.query.status === 'continue') {
      request({
        method: "GET",
        url: `https://api.fortnitetracker.com/v1/profile/pc/${player}`,
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
        // lifeTimeStats ->7: Matches Played , 8: Wins
        let oldMatchCount;
        let oldWins;

        const matchCount = result.lifeTimeStats.filter(ele => ele.key === "Matches Played")[0].value
        // console.log('matchCount', matchCount);
        const wins = result.lifeTimeStats.filter(ele => ele.key === "Wins")[0].value
        // console.log('wins', wins);
        const bet = {

          betAmount: "12",
          betType: "Win",
          description: "win",
          epicUser: "DominicSmorraJr",
          timePlaced: `2018-08-14T16:32:30.19`
        }

        if (playerInfo.exists) {
          oldMatchCount = playerStatus.lifeTimeStats.filter(ele => ele.key === "Matches Played")[0].value
          oldWins = playerStatus.lifeTimeStats.filter(ele => ele.key === "Wins")[0].value
          if (!req.query.status) {
            console.log(`Watching ${result.epicUserHandle}`)
            db.collection("players").doc(result.epicUserHandle).update(result)
            db.collection("players").doc(result.epicUserHandle).update({ status: `watching` })
          }
        } else {
          console.log(`Created and watching ${result.epicUserHandle}`)
          db.collection("players").doc(result.epicUserHandle).set(result).then(() => {
            db.collection("players").doc(result.epicUserHandle).update({ status: `watching` })
          })
          // db.collection("players").doc(result.epicUserHandle).set(match)

          oldMatchCount = matchCount
          oldWins = wins
        }

        let betDate;
        if (req.query.time) {
          betDate = new Date(req.query.time)
        } else {
          betDate = new Date()
          // console.log('Setting Bet Date', betDate);
        }
        const nowDate = new Date()
        if (nowDate - betDate >= 20 * 60 * 1000) {
          console.log("Bet Expired")
          db.collection("players").doc(result.epicUserHandle).update({ status: `expired` })
          res.status(200).end()
        } else {


          if (matchCount > oldMatchCount) {
            let newResult;
            if (wins > oldWins && bet.betType === 'Win') {
              console.log(`Result for ${player}: Player wins the bet!`)
              newResult = 'win'
            } else {
              console.log(`Result for ${player}: Player lost the bet!`)
              newResult = 'lost'
            }
            db.collection("players").doc(result.epicUserHandle).get().then(() => {
              db.collection("players").doc(result.epicUserHandle).update(result)
              db.collection("players").doc(result.epicUserHandle).update({ status: `finished`, lastResult: newResult, timeframe: { betDate, nowJS: new Date() } }).then(() => res.status(204).send())
            })

          } else {
            // console.log(`No result for ${player}, lets try again`)
            setTimeout(() => {
              res.status(200).end()
              request({
                method: "GET",
                url: `https://us-central1-molli-e1c3f.cloudfunctions.net/conFetFortniteAPI?player=${player}&time=${betDate}&status=continue`,
              })
            }, 15000)

          }
        }
      }).catch(e => console.error(e))
    } else {
      console.log(`Already watching`)
      res.send(`Already watching`)
    }
  }).catch(e => console.error(e))
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
  let player = req.query.player
  db.collection("players2").doc(player).get().then(playerInfo => {

    const playerStatus = playerInfo.data()

    if (!playerInfo.exists || playerStatus.status !== 'watching' || req.query.status === 'continue') {
      fortniteAPI.login().then(() => {
        fortniteAPI.getStatsBR(player, "pc", "alltime")
          .then(result => {
            // db.collection("players2").doc(player).set(result)
            let oldMatchCount;
            let oldWins;
            player = result.info.username
            const matchCount = result.lifetimeStats.matches
            // console.log('matchCount', matchCount);
            const wins = result.lifetimeStats.wins
            const bet = {

              betAmount: "12",
              betType: "Win",
              description: "win",
              epicUser: "DominicSmorraJr",
              timePlaced: `2018-08-14T16:32:30.19`
            }

            if (playerInfo.exists) {
              oldMatchCount = playerStatus.lifetimeStats.matches
              oldWins = playerStatus.lifetimeStats.wins
              if (!req.query.status) {
                console.log(`Watching ${player}`)
                db.collection("players2").doc(player).update(result)
                db.collection("players2").doc(player).update({ status: `watching` })
              }
            } else {
              console.log(`Created and watching ${player}`)
              db.collection("players2").doc(player).set(result).then(() => {
                db.collection("players2").doc(player).update({ status: `watching` })
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
              db.collection("players2").doc(player).update({ status: `expired` })
              res.status(200).end()
            } else {

              if (matchCount > oldMatchCount) {
                let newResult;
                if (wins > oldWins && bet.betType === 'Win') {
                  console.log(`Result for ${player}: Player wins the bet!`)
                  newResult = 'win'
                } else {
                  console.log(`Result for ${player}: Player lost the bet!`)
                  newResult = 'lost'
                }
                db.collection("players2").doc(player).get().then(() => {
                  db.collection("players2").doc(player).update(result)
                  db.collection("players2").doc(player).update({ status: `finished`, lastResult: newResult, timeframe: { betDate, nowJS: new Date() } }).then(() => res.status(204).send())
                })

              } else {
                // console.log(`No result for ${player}, lets try again`)
                setTimeout(() => {
                  res.status(200).end()
                  request({
                    method: "GET",
                    url: `https://us-central1-molli-e1c3f.cloudfunctions.net/betaConFetFortniteAPI?player=${player}&time=${betDate}&status=continue`,
                  })
                }, 8000)
              }
            }
          }).catch(e => console.error(e))
      }).catch(e => console.error(e))
    } else {
      console.log(`Already watching`)
      res.send(`Already watching`)
    }
  }).catch(e => console.error(e))
})