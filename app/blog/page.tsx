import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata = {
  title: "Blog | Inox Secure",
  description: "Read the latest articles about security, safety tips, and product reviews",
}

export default function BlogPage() {
  // Mock blog posts
  const featuredPost = {
    id: 1,
    title: "10 Essential Home Security Tips Every Homeowner Should Know",
    excerpt:
      "Protect your home and loved ones with these expert-recommended security measures that you can implement today.",
    image: "/placeholder.svg?height=600&width=1200",
    date: "June 10, 2023",
    author: "Alex Johnson",
    category: "Home Security",
    readTime: "5 min read",
  }

  const recentPosts = [
    {
      id: 2,
      title: "Smart Locks vs. Traditional Locks: Which Is Right for You?",
      excerpt:
        "We compare the pros and cons of smart locks and traditional locks to help you make the best choice for your home.",
      image: "/placeholder.svg?height=400&width=600",
      date: "May 28, 2023",
      author: "Sarah Chen",
      category: "Product Comparison",
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "How to Choose the Right Security Camera for Your Property",
      excerpt:
        "With so many options available, finding the right security camera can be overwhelming. Here's our guide to help you decide.",
      image: "/placeholder.svg?height=400&width=600",
      date: "May 15, 2023",
      author: "Michael Rodriguez",
      category: "Buying Guide",
      readTime: "6 min read",
    },
    {
      id: 4,
      title: "5 Common Home Security Mistakes and How to Avoid Them",
      excerpt:
        "Are you making these common security mistakes? Learn how to identify and fix vulnerabilities in your home security setup.",
      image: "/placeholder.svg?height=400&width=600",
      date: "May 3, 2023",
      author: "Priya Sharma",
      category: "Safety Tips",
      readTime: "3 min read",
    },
  ]

  const categories = [
    "Home Security",
    "Product Reviews",
    "Safety Tips",
    "Buying Guides",
    "Industry News",
    "How-To Guides",
    "Technology Trends",
  ]

  return (
    <div  >
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-transparent">
        <div className="flex flex-col items-center text-center mb-16 px-10 py-10 w-full text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Blog
          </h1>
          <p className="text-lg text-white max-w-3xl">
           Stay informed with the latest security tips, product reviews, and industry insights from our security experts.
          </p>
        </div>
      </div>


      <div className=" px-20 py-10">
         {/* Featured Post */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Featured Article</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-lg overflow-hidden">
          <div className="relative h-[300px] md:h-full">
            <Image
              src={featuredPost.image || "/placeholder.svg"}
              alt={featuredPost.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <span>{featuredPost.category}</span>
              <span className="mx-2">•</span>
              <span>{featuredPost.date}</span>
            </div>
            <h3 className="text-2xl font-bold mb-3">{featuredPost.title}</h3>
            <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
              <span className="text-sm">
                By <span className="font-medium">{featuredPost.author}</span> • {featuredPost.readTime}
              </span>
            </div>
            <Link href={`/blog/${featuredPost.id}`}>
              <Button>Read Article</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6">Recent Articles</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <div key={post.id} className="border rounded-lg overflow-hidden">
              <div className="relative h-48">
                <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{post.category}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                  <Link href={`/blog/${post.id}`}>
                    <Button variant="link" className="p-0 h-auto">
                      Read More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="outline">View All Articles</Button>
        </div>
      </div>

      {/* Categories and Newsletter */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/blog/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
                className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg text-center transition-colors"
              >
                <span className="font-medium">{category}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-primary text-white p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="mb-4">Get the latest security tips and product updates delivered to your inbox.</p>
          <form className="space-y-4">
            <Input placeholder="Enter your email" className="bg-white text-black border-0" type="email" required />
            <Button type="submit" variant="secondary" className="w-full">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
      </div>
    
  )
}
