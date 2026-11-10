import { useEffect } from "react"
import { useLocation } from "react-router-dom"

import { getDestination } from "../data/destinations"
import { getPost } from "../data/posts"

const staticMeta = {
  "/": {
    title: "Dream — Travel, beautifully.",
    description:
      "Thoughtfully crafted small-group journeys to the world's most extraordinary places — led by people who call them home.",
  },
  "/destinations": {
    title: "Destinations — Dream",
    description:
      "Forty-eight hand-picked places, from high mountain valleys to quiet island atolls. Find your next somewhere with Dream.",
  },
  "/tours": {
    title: "Tours & journeys — Dream",
    description:
      "Small departures, carefully paced routes and the details that turn a holiday into a story. Browse every Dream journey.",
  },
  "/gallery": {
    title: "Gallery — Dream",
    description: "A visual diary from recent Dream journeys — first light, long lunches and the quiet minutes in between.",
  },
  "/journal": {
    title: "The Journal — Dream",
    description: "Field notes, practical guides and slow-travel stories from the Dream team and the people we meet.",
  },
  "/about": {
    title: "About — Dream",
    description:
      "Dream is a small travel studio in Islamabad, building journeys that are slower, kinder and a little more personal.",
  },
  "/contact": {
    title: "Contact — Dream",
    description: "Ask a question, share a date or tell us about a place you cannot stop thinking about. We reply within one working day.",
  },
  "/booking": {
    title: "Plan your trip — Dream",
    description: "Tell us the shape of the trip and we will take care of the rest. No payment now — every request is reviewed by a real person.",
  },
  "/wishlist": {
    title: "Your wishlist — Dream",
    description: "The places you keep coming back to, saved on this device and ready to turn into a journey.",
  },
}

const fallback = {
  title: "Page not found — Dream",
  description: "This path leads off the map, but there are forty-eight beautiful places waiting just around the corner.",
}

export default function PageMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    let meta = staticMeta[pathname]

    if (!meta && pathname.startsWith("/destinations/")) {
      const destination = getDestination(pathname.split("/")[2])
      if (destination) {
        meta = {
          title: `${destination.name}, ${destination.country} — Dream`,
          description: destination.summary,
        }
      }
    }

    if (!meta && pathname.startsWith("/journal/")) {
      const post = getPost(pathname.split("/")[2])
      if (post) {
        meta = { title: `${post.title} — Dream Journal`, description: post.excerpt }
      }
    }

    meta = meta || fallback

    document.title = meta.title

    const descriptionTag = document.head.querySelector('meta[name="description"]')
    if (descriptionTag) descriptionTag.setAttribute("content", meta.description)

    const ogTitle = document.head.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute("content", meta.title)

    const ogDescription = document.head.querySelector('meta[property="og:description"]')
    if (ogDescription) ogDescription.setAttribute("content", meta.description)

    return () => {
      /* meta is intentionally left in place between route changes */
    }
  }, [pathname])

  return null
}
