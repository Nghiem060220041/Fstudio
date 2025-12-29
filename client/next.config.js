/** @type {import('next').NextConfig} */
const hostnames = [
    "avatars.githubusercontent.com",
    "lh3.googleusercontent.com",
    "githubusercontent.com",
    "googleusercontent.com",
    "images.unsplash.com",
    "cdn.discordapp.com",
    "res.cloudinary.com",
    "www.gravatar.com",
    "api.dicebear.com",
    "img.youtube.com",
    "discordapp.com",
    "pbs.twimg.com",
    "i.imgur.com",
    "utfs.io",
];
  
const nextConfig = {
    images: {
        formats: ["image/avif", "image/webp"],
        domains: hostnames,
    },
}

module.exports = nextConfig
