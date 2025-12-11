import { Module } from "@nestjs/common";
import * as admin from "firebase-admin";

@Module({})
export class FirebaseModule {
  constructor() {
    // Initialize Firebase Admin using ADC (no key file)
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: "ivs-notifications-poc-935c0",
    });
    console.log("Firebase Admin initialized with ADC");
  }
}
