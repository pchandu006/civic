import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Create() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [areaName, setAreaName] = useState("Detecting location...");
  const [fullAddress, setFullAddress] = useState("");

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setAreaName("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLatitude(lat);
        setLongitude(lng);

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                format: "json",
                lat: lat,
                lon: lng,
              },
              headers: {
                "Accept-Language": "en",
              },
            }
          );

          const address = res.data.address || {};

          const village =
            address.hamlet ||
            address.village ||
            address.suburb ||
            address.neighbourhood ||
            address.town ||
            address.city ||
            "";

          const district = address.county || "";
          const state = address.state || "";
          const pincode = address.postcode || "";
          const country = address.country || "";

          const formattedAddress = [
            village,
            district,
            state,
            pincode,
            country,
          ]
            .filter(Boolean)
            .join(", ");

          setAreaName(village || district || "Location detected");
          setFullAddress(formattedAddress);

        } catch (error) {
          console.log(error);
          setAreaName("Location detected");
        }
      },
      (error) => {
        console.log(error);
        setAreaName("Location permission denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!image) {
      alert("Please upload an image ❗");
      return;
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("areaName", areaName);
    formData.append("fullAddress", fullAddress);
    formData.append("image", image);

    try {
      await axios.post(
        "http://localhost:5000/api/posts/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Issue Detected & Reported Successfully 🤖✅");
      navigate("/dashboard");

    } catch (error) {
      console.log(error);
      alert("Error reporting issue ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

        <h2 className="text-xl font-bold mb-4">
          Report New Issue (AI Powered)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <textarea
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="w-full"
          />

          {/* Location Display */}
          <div className="bg-gray-100 p-3 rounded text-sm space-y-1">
            <div>
              📍 <strong>Area:</strong> {areaName}
            </div>
            <div>
              🌍 <strong>Full Address:</strong>
              <div className="text-gray-600 mt-1">{fullAddress}</div>
            </div>
            <div>
              🧭 <strong>Latitude:</strong> {latitude}
            </div>
            <div>
              🧭 <strong>Longitude:</strong> {longitude}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Submit Issue
          </button>

        </form>
      </div>
    </div>
  );
}

export default Create;