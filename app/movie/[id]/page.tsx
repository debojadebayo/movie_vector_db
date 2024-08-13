import MoviePoster from "@/components/MoviePoster";
import db from "@/db";
import { Movie, SimilarMovie } from "@/types";
import { FindOptions } from "@datastax/astra-db-ts";
import Image from "next/image";
import { notFound } from "next/navigation";

// refresh cache every 24 hours
export const revalidate = 60 * 60 * 24;

async function MoviePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const movies = db.collection("movie_collection");

  //find method as part of database API to identify movie
  const search = await movies.find({ $and: [{ _id: id }] }, { projection: { $vector: 1 , _id: 1 } });


  if (!(await search.hasNext())) {
    return notFound();
  }

  const movie = (await search.next()) as Movie;

  //checks movie vector
  console.log(movie)
 
  //find similar movies based on movie vector

  const similarMovies = (await movies.find(
    {},
    {
      vector: movie.$vector,
      limit: 6,
      includeSimilarity: true
    }
    )
    .toArray()) as SimilarMovie[];

 
  similarMovies.shift();

  console.log(similarMovies[1].Poster)

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center gap-y-10 p-10 pb-0">
        <Image
          src={movie.Poster}
          alt={movie.Title}
          width={300}
          height={450}
          className="shrink-0 rounded-lg "
        />
        <div className="px-2 md:px-10 flex flex-col gap-y-2">
          <h1 className="text-6xl font-bold">{movie.Title}</h1>
          <p className="text-gray-600">{movie.Genre}</p>
          <p className="font-light">{movie.$vectorize}</p>

          <div className="mt-auto grid grid-cols-2">
            <div className="font-semibold">
              <p>Directed by:</p>
              <p>Featuring:</p>
              <p>Box Office:</p>
              <p>Released:</p>
              <p>Runtime:</p>
              <p>Rated:</p>
              <p>IMDB Rating:</p>
              <p>Language:</p>
              <p>Country:</p>
            </div>
            <div>
              <p>{movie.Director}</p>
              <p>{movie.Actors}</p>
              <p>{movie.BoxOffice}</p>
              <p>{movie.Released}</p>
              <p>{movie.Runtime}</p>
              <p>{movie.Rated}</p>
              <p>{movie.imdbRating}</p>
              <p>{movie.Language}</p>
              <p>{movie.Country}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="">
        <h2 className="text-3xl pt-10 pl-10 font-bold ">
          Similar Films you may like
        </h2>
        <div className="flex justify-between items-center lg:flex-row gap-x-20 gap-y-10 pl-20 pr-10 py-10 overflow-x-scroll">
          {similarMovies.map((movie, i) => (
            <div key={movie._id} className="flex space-x-2 relative">
              <MoviePoster
                index={i + 1}
                similarityRating={Number(movie.$similarity.toFixed(2)) * 100}
                movie={movie}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MoviePage;
