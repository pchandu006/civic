import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {

const navigate = useNavigate();

const [posts, setPosts] = useState([]);
const [filteredPosts, setFilteredPosts] = useState([]);
const [selectedPost, setSelectedPost] = useState(null);
const [filter, setFilter] = useState("All");
const [loading, setLoading] = useState(false);

const token = localStorage.getItem("token");

useEffect(() => {

if (!token) {
navigate("/");
return;
}

fetchPosts();

}, []);

const fetchPosts = async () => {

try {

setLoading(true);

const res = await axios.get("https://civic-backend-6wpl.onrender.com/api/posts", {
headers: { Authorization: `Bearer ${token}` }
});

setPosts(res.data);
setFilteredPosts(res.data);

} catch (err) {
alert("Error fetching posts");
} finally {
setLoading(false);
}

};

useEffect(() => {

if (filter === "All") {
setFilteredPosts(posts);
} else {
setFilteredPosts(posts.filter(p => p.status === filter));
}

}, [filter, posts]);

// statistics
const total = posts.length;
const pending = posts.filter(p => p.status === "Pending").length;
const progress = posts.filter(p => p.status === "In Progress").length;
const resolved = posts.filter(p => p.status === "Resolved").length;

return (

<div className="min-h-screen bg-gray-100 p-6">

{/* TOP STATS */}

<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

<div className="bg-white p-4 rounded shadow text-center">
<p className="text-gray-500">Total Issues</p>
<h2 className="text-2xl font-bold">{total}</h2>
</div>

<div className="bg-white p-4 rounded shadow text-center">
<p className="text-gray-500">Pending</p>
<h2 className="text-2xl font-bold text-yellow-600">{pending}</h2>
</div>

<div className="bg-white p-4 rounded shadow text-center">
<p className="text-gray-500">In Progress</p>
<h2 className="text-2xl font-bold text-blue-600">{progress}</h2>
</div>

<div className="bg-white p-4 rounded shadow text-center">
<p className="text-gray-500">Resolved</p>
<h2 className="text-2xl font-bold text-green-600">{resolved}</h2>
</div>

</div>

{/* FILTER BUTTONS */}

<div className="flex gap-3 mb-6">

<button
onClick={() => setFilter("All")}
className={`px-4 py-2 rounded ${filter==="All" ? "bg-blue-600 text-white" : "bg-white shadow"}`}
>
All
</button>

<button
onClick={() => setFilter("Pending")}
className={`px-4 py-2 rounded ${filter==="Pending" ? "bg-blue-600 text-white" : "bg-white shadow"}`}
>
Pending
</button>

<button
onClick={() => setFilter("In Progress")}
className={`px-4 py-2 rounded ${filter==="In Progress" ? "bg-blue-600 text-white" : "bg-white shadow"}`}
>
In Progress
</button>

<button
onClick={() => setFilter("Resolved")}
className={`px-4 py-2 rounded ${filter==="Resolved" ? "bg-blue-600 text-white" : "bg-white shadow"}`}
>
Resolved
</button>

</div>

{/* POSTS */}

<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

{loading ? (
<p>Loading...</p>
) : filteredPosts.length === 0 ? (
<p>No issues found</p>
) : (

filteredPosts.map(post => (

<div key={post._id} className="bg-white p-4 rounded shadow">

<div className="flex justify-between mb-2">

<h3 className="font-semibold">{post.issueType}</h3>

<span className={`text-xs px-2 py-1 rounded
${post.status === "Pending" && "bg-yellow-400"}
${post.status === "In Progress" && "bg-blue-500 text-white"}
${post.status === "Resolved" && "bg-green-500 text-white"}
`}>
{post.status}
</span>

</div>

<p className="text-gray-600">{post.description}</p>

{post.image && (
<img
src={`https://civic-backend-6wpl.onrender.com/uploads/${post.image}`}
className="w-full h-40 object-cover rounded mt-2"
/>
)}

<p className="text-sm mt-2">📍 {post.areaName}</p>

<button
onClick={() => setSelectedPost(post)}
className="text-blue-600 text-sm mt-2"
>
View Details
</button>

</div>

))

)}

</div>

{/* MODAL */}

{selectedPost && (

<div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

<div className="bg-white p-6 rounded w-1/2 relative">

<button
onClick={() => setSelectedPost(null)}
className="absolute top-2 right-2"
>
✕
</button>

<h3 className="text-lg font-bold mb-2">
{selectedPost.issueType}
</h3>

{selectedPost.image && (
<img
src={`https://civic-backend-6wpl.onrender.com/uploads/${selectedPost.image}`}
className="w-full h-60 object-cover rounded mb-3"
/>
)}

<p>
<strong>Description:</strong> {selectedPost.description}
</p>

<p>
<strong>Full Address:</strong>{" "}
{selectedPost.fullAddress || selectedPost.areaName}
</p>

{selectedPost.latitude && selectedPost.longitude && (
<iframe
title="map"
width="100%"
height="250"
className="mt-3 rounded"
src={`https://maps.google.com/maps?q=${selectedPost.latitude},${selectedPost.longitude}&z=15&output=embed`}
/>
)}

</div>

</div>

)}

</div>

);
}

export default Dashboard;