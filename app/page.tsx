import MoviePoster from "@/components/MoviePoster";
import db from "@/db";
import { Movie } from "@/types";

// refresh cache every 24 hours
export const revalidate = 60 * 60 * 24;

//reaches out to vector database and imports movies

export default async function Home() {
  const movies = db.collection("movie_collection");

  const allMovies = (await movies.find(
      {},
      {}
    )
    .toArray()) as Movie[];

  return (
    <div className="flex items-center justify-center pb-24 pt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {allMovies.map((movie) => (
          <MoviePoster key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

// create custom embeedings by directly interacting with OPEN API's text-embedding model 
async function embedding(prompt: string) {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      input: prompt,
      model: "text-embedding-3-large",
      dimensions: 3072, // recommended dimensions as per API docs
    }),
  });

  const result = await response.json();

  return result.data[0].embedding;
}
