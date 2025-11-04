import { setGlobalOptions } from "firebase-functions/v2";
setGlobalOptions({ region: "europe-west3" });

export * from "./notifyAdminUser";
export * from "./sendPush";
