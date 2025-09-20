import { useEffect, useState } from "react";
import { db, storage } from "./firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function App() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const testFirestore = async () => {
      try {
        await addDoc(collection(db, "events"), {
          title: "Test Cold Exposure",
          createdAt: new Date(),
          userId: "test-user",
        });

        const snapshot = await getDocs(collection(db, "events"));
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(docs);
      } catch (error) {
        console.error("Firestore test failed:", error);
      }
    };

    testFirestore();
  }, []);

  const handleUpload = async () => {
    try {
      const file = new Blob(["seal-test 🦭"], { type: "text/plain" });
      const storageRef = ref(storage, `events/test-event/test-user/seal.txt`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      alert("Uploaded test file! URL: " + url);
    } catch (error) {
      console.error("Storage test failed:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-3xl font-bold text-blue-700 mb-4">
        Lucenské Tulene 🦭❄️
      </h1>

      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Upload Test File
      </button>

      <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Events from Firestore:</h2>
        <ul className="bg-white shadow-md rounded-lg p-4">
          {events.map((event) => (
            <li key={event.id} className="border-b py-1 last:border-none">
              {event.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
