import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import mongoose, { type HydratedDocument } from "mongoose";
import connectDB from "../lib/db";
import { searchPixabay } from "../lib/pixabay";
import { uploadImageFromUrl } from "../lib/cloudinary";
import { slugify } from "../lib/slug";
import Country, { type CountryDoc } from "../models/Country";
import Town, { type TownDoc } from "../models/Town";
import Activity from "../models/Activity";
import BlogPost from "../models/BlogPost";

interface SeededImage {
  url: string;
  publicId: string;
}

const imageCache = new Map<string, SeededImage>();

async function fetchImage(query: string): Promise<SeededImage> {
  if (imageCache.has(query)) {
    return imageCache.get(query) as SeededImage;
  }

  console.log(`  Searching Pixabay for "${query}"...`);
  const result = await searchPixabay(query, 1, 3);
  const hit = result.hits[0];
  if (!hit) {
    throw new Error(`No Pixabay results for query "${query}"`);
  }

  console.log(`  Uploading to Cloudinary...`);
  const uploaded = await uploadImageFromUrl(hit.largeImageURL);
  const image = { url: uploaded.url, publicId: uploaded.publicId };
  imageCache.set(query, image);
  return image;
}

interface TownSeed {
  name: string;
  lat: number;
  lng: number;
  imageQuery: string;
  activities: {
    name: string;
    price: number;
    description: string;
    tags: string[];
    imageQuery: string;
  }[];
}

interface CountrySeed {
  name: string;
  imageQuery: string;
  towns: TownSeed[];
}

const countrySeeds: CountrySeed[] = [
  {
    name: "Italy",
    imageQuery: "italy landscape",
    towns: [
      {
        name: "Rome",
        lat: 41.9028,
        lng: 12.4964,
        imageQuery: "rome colosseum",
        activities: [
          {
            name: "Colosseum Tour",
            price: 55,
            description:
              "Step inside the ancient Colosseum with a guided tour covering its gladiatorial history and architecture.",
            tags: ["history", "landmark"],
            imageQuery: "colosseum rome",
          },
          {
            name: "Vatican Museums",
            price: 65,
            description:
              "Explore the Vatican Museums and the Sistine Chapel with skip-the-line access and an expert guide.",
            tags: ["art", "museum"],
            imageQuery: "vatican museum",
          },
        ],
      },
      {
        name: "Venice",
        lat: 45.4408,
        lng: 12.3155,
        imageQuery: "venice canal",
        activities: [
          {
            name: "Gondola Ride",
            price: 90,
            description:
              "Glide through Venice's iconic canals on a traditional gondola with a singing gondolier.",
            tags: ["romantic", "canal"],
            imageQuery: "venice gondola",
          },
          {
            name: "St Mark's Basilica",
            price: 35,
            description:
              "Discover the golden mosaics and Byzantine architecture of St Mark's Basilica on a guided visit.",
            tags: ["history", "church"],
            imageQuery: "st marks basilica venice",
          },
        ],
      },
    ],
  },
  {
    name: "Japan",
    imageQuery: "japan landscape",
    towns: [
      {
        name: "Tokyo",
        lat: 35.6762,
        lng: 139.6503,
        imageQuery: "tokyo skyline",
        activities: [
          {
            name: "Senso-ji Temple Walk",
            price: 25,
            description:
              "Wander through Asakusa and visit Tokyo's oldest temple, Senso-ji, with a local guide.",
            tags: ["temple", "culture"],
            imageQuery: "sensoji temple",
          },
          {
            name: "Shibuya Food Tour",
            price: 70,
            description:
              "Taste your way through Shibuya's best izakayas, ramen shops, and street food stalls.",
            tags: ["food", "nightlife"],
            imageQuery: "shibuya tokyo food",
          },
        ],
      },
      {
        name: "Kyoto",
        lat: 35.0116,
        lng: 135.7681,
        imageQuery: "kyoto temple",
        activities: [
          {
            name: "Fushimi Inari Hike",
            price: 20,
            description:
              "Hike through thousands of vermillion torii gates up the sacred Mount Inari.",
            tags: ["hiking", "shrine"],
            imageQuery: "fushimi inari",
          },
          {
            name: "Arashiyama Bamboo Grove",
            price: 30,
            description:
              "Walk through the towering, otherworldly bamboo groves of Arashiyama.",
            tags: ["nature", "photography"],
            imageQuery: "arashiyama bamboo",
          },
        ],
      },
    ],
  },
  {
    name: "Iceland",
    imageQuery: "iceland landscape",
    towns: [
      {
        name: "Reykjavik",
        lat: 64.1466,
        lng: -21.9426,
        imageQuery: "reykjavik iceland",
        activities: [
          {
            name: "Northern Lights Tour",
            price: 95,
            description:
              "Chase the aurora borealis on a night tour departing from Reykjavik with an expert guide.",
            tags: ["aurora", "night"],
            imageQuery: "northern lights iceland",
          },
          {
            name: "Blue Lagoon",
            price: 80,
            description:
              "Relax in the geothermal, mineral-rich waters of the world-famous Blue Lagoon.",
            tags: ["relax", "spa"],
            imageQuery: "blue lagoon iceland",
          },
        ],
      },
      {
        name: "Vik",
        lat: 63.4187,
        lng: -19.006,
        imageQuery: "vik iceland",
        activities: [
          {
            name: "Reynisfjara Black Sand Beach",
            price: 40,
            description:
              "Explore the dramatic basalt columns and black sands of Reynisfjara beach near Vik.",
            tags: ["beach", "nature"],
            imageQuery: "reynisfjara black sand beach",
          },
        ],
      },
    ],
  },
];

interface BlogSeed {
  title: string;
  excerpt: string;
  content: string;
  imageQuery: string;
  relatedCountryName?: string;
  relatedTownName?: string;
}

const blogSeeds: BlogSeed[] = [
  {
    title: "5 Days in Rome",
    excerpt: "A five-day itinerary covering the Eternal City's must-see sights.",
    imageQuery: "rome italy travel",
    relatedCountryName: "Italy",
    relatedTownName: "Rome",
    content: `# 5 Days in Rome

Rome rewards visitors who take their time. Here's how to spend five unforgettable days in the Eternal City.

## Day 1: Ancient Rome

Start at the Colosseum, then walk through the Roman Forum and up Palatine Hill for sweeping views over the ruins.

## Day 2: Vatican City

Spend the morning in the Vatican Museums and Sistine Chapel, then climb the dome of St Peter's Basilica for panoramic views.

## Day 3: Trastevere & the Center

Cross the river to Trastevere for cobblestone streets and trattorias, then explore the Pantheon and Piazza Navona.

## Day 4: Villa Borghese & Shopping

Relax in the Villa Borghese gardens, visit the Borghese Gallery, and shop along Via del Corso.

## Day 5: Day Trip

Take a day trip to Tivoli to see the fountains of Villa d'Este, or simply enjoy a final espresso in a quiet piazza.
`,
  },
  {
    title: "Chasing the Northern Lights in Iceland",
    excerpt: "Tips for catching the aurora borealis on your Icelandic adventure.",
    imageQuery: "aurora borealis iceland",
    relatedCountryName: "Iceland",
    relatedTownName: "Reykjavik",
    content: `# Chasing the Northern Lights in Iceland

Few sights compare to the aurora borealis dancing over Iceland's dramatic landscapes.

## Best Time to Go

The aurora season runs from late August through April, with the darkest months offering the best odds.

## Where to Look

Escape Reykjavik's light pollution and head to open countryside, coastal cliffs, or the Snaefellsnes peninsula.

## What to Bring

Warm layers, a tripod, and a camera capable of long exposures will make the most of the experience.

## Patience Pays Off

The lights are unpredictable — clear, cold nights away from city lights give you the best chance.
`,
  },
  {
    title: "A Food Lover's Guide to Tokyo",
    excerpt: "From street food to sushi counters, here's how to eat your way through Tokyo.",
    imageQuery: "tokyo food ramen",
    relatedCountryName: "Japan",
    relatedTownName: "Tokyo",
    content: `# A Food Lover's Guide to Tokyo

Tokyo is a city built around food, with something extraordinary on nearly every corner.

## Ramen

Seek out a tiny counter shop for a steaming bowl of tonkotsu or shoyu ramen.

## Sushi

Visit a standing sushi bar near Tsukiji for the freshest cuts at a fraction of high-end prices.

## Izakayas

Spend an evening hopping between izakayas in Shibuya or Shinjuku for skewers, small plates, and drinks.

## Street Food

Don't miss taiyaki, takoyaki, and convenience store snacks — Tokyo's casual food scene is world-class.
`,
  },
  {
    title: "Kyoto's Hidden Temples",
    excerpt: "Skip the crowds and discover Kyoto's quieter, equally stunning temples.",
    imageQuery: "kyoto temple garden",
    relatedCountryName: "Japan",
    relatedTownName: "Kyoto",
    content: `# Kyoto's Hidden Temples

While Fushimi Inari and Kinkaku-ji draw the crowds, Kyoto hides dozens of equally beautiful, quieter temples.

## Otagi Nenbutsu-ji

Home to over 1,200 whimsical stone statues, each carved with a different expression.

## Jojakko-ji

A peaceful hillside temple in Arashiyama with panoramic views and stunning autumn foliage.

## Honen-in

A moss-covered gate and thatched roof mark the entrance to this tranquil temple near the Philosopher's Path.

## Visiting Tips

Go early in the morning for the softest light and the fewest visitors.
`,
  },
];

async function seed() {
  await connectDB();
  console.log("Connected to MongoDB.");

  console.log("Clearing existing Country/Town/Activity/BlogPost collections (Bookings untouched)...");
  await Promise.all([
    Country.deleteMany({}),
    Town.deleteMany({}),
    Activity.deleteMany({}),
    BlogPost.deleteMany({}),
  ]);

  const countryDocs: Record<string, HydratedDocument<CountryDoc>> = {};
  const townDocs: Record<string, HydratedDocument<TownDoc>> = {};

  for (const countrySeed of countrySeeds) {
    console.log(`\nSeeding country: ${countrySeed.name}`);
    const countryImage = await fetchImage(countrySeed.imageQuery);
    const country = await Country.create({
      name: countrySeed.name,
      slug: slugify(countrySeed.name),
      description: `Discover the best of ${countrySeed.name}.`,
      imageUrl: countryImage.url,
      imagePublicId: countryImage.publicId,
    });
    countryDocs[countrySeed.name] = country;

    for (const townSeed of countrySeed.towns) {
      console.log(` Seeding town: ${townSeed.name}`);
      const townImage = await fetchImage(townSeed.imageQuery);
      const town = await Town.create({
        name: townSeed.name,
        slug: slugify(townSeed.name),
        country: country._id,
        description: `Explore ${townSeed.name}, ${countrySeed.name}.`,
        location: { lat: townSeed.lat, lng: townSeed.lng },
        imageUrl: townImage.url,
        imagePublicId: townImage.publicId,
      });
      townDocs[`${countrySeed.name}:${townSeed.name}`] = town;

      for (const activitySeed of townSeed.activities) {
        console.log(`  Seeding activity: ${activitySeed.name}`);
        const activityImage = await fetchImage(activitySeed.imageQuery);
        await Activity.create({
          name: activitySeed.name,
          slug: slugify(activitySeed.name),
          town: town._id,
          country: country._id,
          description: activitySeed.description,
          price: activitySeed.price,
          currency: "USD",
          location: { lat: townSeed.lat, lng: townSeed.lng },
          images: [activityImage],
          tags: activitySeed.tags,
        });
      }
    }
  }

  console.log("\nSeeding blog posts...");
  for (const blogSeed of blogSeeds) {
    console.log(` Seeding blog post: ${blogSeed.title}`);
    const coverImage = await fetchImage(blogSeed.imageQuery);
    const relatedCountry = blogSeed.relatedCountryName
      ? countryDocs[blogSeed.relatedCountryName]
      : undefined;
    const relatedTown =
      blogSeed.relatedCountryName && blogSeed.relatedTownName
        ? townDocs[`${blogSeed.relatedCountryName}:${blogSeed.relatedTownName}`]
        : undefined;

    await BlogPost.create({
      title: blogSeed.title,
      slug: slugify(blogSeed.title),
      excerpt: blogSeed.excerpt,
      content: blogSeed.content,
      coverImageUrl: coverImage.url,
      coverImagePublicId: coverImage.publicId,
      relatedCountry: relatedCountry?._id,
      relatedTown: relatedTown?._id,
      author: "Admin",
      published: true,
      publishedAt: new Date(),
    });
  }

  const counts = {
    countries: await Country.countDocuments(),
    towns: await Town.countDocuments(),
    activities: await Activity.countDocuments(),
    blogPosts: await BlogPost.countDocuments(),
  };

  console.log("\nSeed complete:", counts);
}

seed()
  .then(() => mongoose.connection.close())
  .then(() => {
    console.log("Done.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
