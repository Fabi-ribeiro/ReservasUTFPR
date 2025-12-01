// scripts/setAdmin.cjs
const admin = require("firebase-admin");
const serviceAccount = require("../firebase-adminsdk.json");

// Inicializa admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();

const UID = "ygtbuZTuzWPu10Zp7eXU5O7WqD22";

async function setAdmin() {
  try {
    await auth.setCustomUserClaims(UID, { admin: true });
    console.log("✔ Admin atribuído com sucesso!");
  } catch (err) {
    console.error("Erro ao definir admin:", err);
  }
}

setAdmin();
