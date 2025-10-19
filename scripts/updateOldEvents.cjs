const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updateOldEvents() {
  const eventsSnapshot = await db.collection("events").get();

  for (const doc of eventsSnapshot.docs) {
    if (!doc.data().event_type) {
      console.log(`Updating event ${doc.id}`);
      await doc.ref.update({ event_type: "cold_plunge" });
    }
  }

  console.log("All old events updated!");
}

updateOldEvents().catch(console.error);
