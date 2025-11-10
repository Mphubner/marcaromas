import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { API_URL } from "../utils/api";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card.jsx";

export default function BlogPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/posts`)
      .then((res) => res.json())
      .then(setPosts)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Blog Marc Aromas</h1>
      <motion.div
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        {posts.map((post) => (
          <Card key={post.id}>
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="text-2xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-muted-foreground">{post.excerpt}</p>
            </div>
          </Card>
        ))}
      </motion.div>
    </div>
  );
}
