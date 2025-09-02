"use client";

import { useEffect, useState } from "react";

type Post = { id: number; title: string; body: string };
type ApiResponse = { instance: string; data: Post[] };

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [backendInstance, setBackendInstance] = useState<string>("");

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/posts`);
      const inst = r.headers.get("x-backend-instance") || "";
      const json = (await r.json()) as ApiResponse;
      setBackendInstance(inst || json.instance);
      setPosts(json.data.slice(0, 5));
    })();
  }, []);

  return (
    <main>
      <h1>Next.js + Express with Docker</h1>
      <p>
        <strong>Backend instance (via LB):</strong> {backendInstance || "…"}
      </p>
      <hr />
      <h2>Sample posts</h2>
      <ul>
        {posts.map((p) => (
          <li key={p.id}>
            <strong>#{p.id}:</strong> {p.title}
          </li>
        ))}
      </ul>
      <p style={{ marginTop: 24, opacity: 0.7 }}>
        Refresh to see backend flip between <code>backend-1</code> and{" "}
        <code>backend-2</code>.
      </p>
    </main>
  );
}
