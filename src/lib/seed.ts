import { db } from './firebase';
import { doc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { INITIAL_LIGHT_PROFILE, INITIAL_DARK_PROFILE, INITIAL_PROJECTS } from './types';

export async function seedFirestoreDatabase() {
  console.log("Seeding Firestore database with initial portfolio content...");

  try {
    // 1. Seed Light Profile
    await setDoc(doc(db, 'profile', 'light'), INITIAL_LIGHT_PROFILE, { merge: true });
    console.log("✓ Light profile seeded");

    // 2. Seed Dark Profile
    await setDoc(doc(db, 'profile_dark', 'dark'), INITIAL_DARK_PROFILE, { merge: true });
    console.log("✓ Dark profile seeded");

    // 3. Seed Projects
    const batch = writeBatch(db);
    for (const project of INITIAL_PROJECTS) {
      const projRef = doc(collection(db, 'projects'), project.id);
      batch.set(projRef, project, { merge: true });
    }
    await batch.commit();
    console.log("✓ Projects seeded successfully");

    return { success: true, message: "Firestore database successfully initialized!" };
  } catch (error: any) {
    console.error("Error seeding Firestore:", error);
    return { success: false, error: error.message };
  }
}
