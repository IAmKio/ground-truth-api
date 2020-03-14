const functions = require('firebase-functions');
const admin = require('firebase-admin');
const geohash = require('ngeohash');

let db = admin.firestore();
admin.initializeApp();

const request = functions.https.onRequest(async (request, response) => {
  console.log('Incoming data:', {
    body: request.body,
    query: request.query,
  });

  const hotspotReference = await db.collection('hotspots').doc().set({
    anonymousUserId: request.body.anonymousUserId,
    geopoint: new admin.firestore.GeoPoint(
      request.body.latitude,
      request.body.longitude
    ),
    geohash: geohash.encode(
      request.body.latitude,
      request.body.longitude
    ),
    hotspotLevel: request.body.level,
    notes: [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  })
  .then((writeResult) => {
    console.log('Successfully wrote hotspot:', writeResult);
  });

console.log('Ingestion complete.')

 return response.send({
   hotspotReference
 });
});

module.exports = request;