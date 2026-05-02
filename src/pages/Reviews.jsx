import { useState } from "react";
import "../style.css";

export default function Reviews() {
  const [reviews, setReviews] = useState([
    {
      name: "Fatima",
      text: "Best cafe in town! Food is always fresh.",
      rating: 5,
      img: "/images/user.png",
    },
    {
      name: "Abdullah",
      text: "Coffee customization is love!",
      rating: 5,
      img: "/images/user.png",
    },
    {
      name: "Tania",
      text: "Very clean and tasty food.",
      rating: 4,
      img: "/images/user.png",
    },
    {
      name: "Hamna",
      text: "Juices are fresh and natural.",
      rating: 5,
      img: "/images/user.png",
    },
     {
      name: "Mahnoor",
      text: "Juices are fresh and natural.",
      rating: 5,
      img: "/images/user.png",
    },
     {
      name: "Hamza",
      text: "Juices are fresh and natural.",
      rating: 5,
      img: "/images/user.png",
    },
     {
      name: "Sana",
      text: "Juices are fresh and natural.",
      rating: 5,
      img: "/images/user.png",
    },
     {
      name: "Sara",
      text: "Juices are fresh and natural.",
      rating: 5,
      img: "/images/user.png",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    text: "",
    rating: 5,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      ...form,
      img: "/images/user.png",
    };
    setReviews([newReview, ...reviews]);
    setForm({ name: "", text: "", rating: 5 });
  };

  return (
    <div className="reviews-page">
      <div className="menu-page-header">
        
        <h1>Customer Reviews</h1>
        <p>Share your experience with Smart Cafe</p>
      </div>

      {/* FORM */}
      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <textarea
          placeholder="Write your review..."
          rows="4"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          required
        />

        <select
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: e.target.value })}
        >
          <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
          <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
          <option value="3">⭐⭐⭐ (3 Stars)</option>
          <option value="2">⭐⭐ (2 Stars)</option>
          <option value="1">⭐ (1 Star)</option>
        </select>

        <button type="submit">Submit Review</button>
      </form>

      {/* REVIEWS LIST */}
      <div className="reviews-grid">
        {reviews.map((item, i) => (
          <div className="review-card" key={i}>
            <img src={item.img} alt={item.name} className="review-img" />
            <h3>{item.name}</h3>
            <div className="stars">{"⭐".repeat(item.rating)}</div>
            <p>"{item.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}