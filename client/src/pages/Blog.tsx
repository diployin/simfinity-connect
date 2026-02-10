import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Calendar, Clock, BookOpen, ArrowRight, TrendingUp } from 'lucide-react';
import { calculateReadingTime } from '@/lib/imageOptimization';
import type { BlogPost } from '@shared/schema';

export default function Blog() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery<{
    posts: BlogPost[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: ['/api/blog', page, search],
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-background">
      <Helmet>
        <title>eSIM Travel Blog - Tips, Guides & Destination Insights | eSIM Marketplace</title>
        <meta
          name="description"
          content="Explore our travel blog for eSIM guides, destination tips, and digital nomad resources. Learn how to stay connected while traveling globally."
        />
        <meta property="og:title" content="eSIM Travel Blog - Tips & Guides" />
        <meta
          property="og:description"
          content="Travel tips, eSIM guides, and destination insights for digital nomads and travelers."
        />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="flex-1">
        {/* Hero Section - With Max Width Container */}
        <section className="relative py-32 md:py-10 lg:py-4 bg-white dark:bg-background overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 dark:from-primary/10 dark:via-transparent dark:to-primary/5"></div>

          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, var(--primary) 1px, transparent 0)`,
                backgroundSize: '32px 32px',
              }}
            ></div>
          </div>

          <div className="containers relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-primary">
                  Travel Insights & Guides
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight text-gray-900 dark:text-foreground">
                eSIM Travel{' '}
                <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  Blog
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                Discover travel tips, destination guides, and expert advice on staying connected
                worldwide with eSIMs. Your ultimate resource for smart travel connectivity.
              </p>

              {/* Search Bar with Enhanced Design */}
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles, destinations, guides..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-12 pr-4 py-6 text-base border-2 dark:border-primary/30 border-gray-300 focus:border-primary dark:focus:border-primary rounded-xl shadow-sm dark:shadow-primary/10"
                  data-testid="input-blog-search"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        {data && !isLoading && (
          <section className="py-8 sm:py-10 bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-background border-y dark:border-border/50 border-gray-200">
            <div className="containers">
              <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-foreground">
                      {data.pagination.total}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-muted-foreground">
                      Articles
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-foreground">
                      {data.posts.length}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-muted-foreground">
                      This Page
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Content Section - With Max Width Container */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50 dark:bg-background">
          <div className="containers">
            {isLoading ? (
              /* Loading Skeletons */
              <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card
                    key={i}
                    className="overflow-hidden border-2 dark:border-primary/30 border-gray-200"
                  >
                    <Skeleton className="h-48 sm:h-56 w-full" />
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : data && data.posts.length > 0 ? (
              <>
                {/* Blog Posts Grid with Staggered Animation */}
                <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {data.posts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <Card
                          className="group h-full overflow-hidden border-2 dark:border-primary/30 border-gray-200 hover:border-primary/50 dark:hover:border-primary/50 shadow-md hover:shadow-xl dark:hover:shadow-primary/20 transition-all duration-300 cursor-pointer bg-white dark:bg-card"
                          data-testid={`card-blog-${post.id}`}
                        >
                          {/* Featured Image with Overlay */}
                          {post.featuredImage && (
                            <div className="relative aspect-video w-full overflow-hidden">
                              <img
                                src={post.featuredImage}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                              {/* Read More Badge on Hover */}
                              <div className="absolute bottom-4 right-4 bg-white dark:bg-card rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                <ArrowRight className="w-5 h-5 text-primary" />
                              </div>
                            </div>
                          )}

                          {/* Card Content */}
                          <CardContent className="p-5 sm:p-6">
                            {/* Title */}
                            <h2
                              className="text-lg sm:text-xl font-bold line-clamp-2 leading-tight mb-3 text-gray-900 dark:text-foreground group-hover:text-primary transition-colors"
                              data-testid={`text-blog-title-${post.id}`}
                            >
                              {post.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-sm sm:text-base text-gray-600 dark:text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                              {post.excerpt}
                            </p>

                            {/* Meta Info with Enhanced Design */}
                            <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500 dark:text-muted-foreground pt-4 border-t dark:border-border/50 border-gray-200">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                                <span className="whitespace-nowrap">
                                  {post.publishedAt
                                    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                      })
                                    : 'Draft'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                                <span className="whitespace-nowrap">
                                  {calculateReadingTime(post.content)} min
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {data.pagination.totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12 sm:mt-16"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      data-testid="button-blog-prev-page"
                      className="w-full sm:w-auto border-2 dark:border-primary/30 border-gray-300 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 px-6 py-2.5 rounded-lg transition-all"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card rounded-lg border-2 dark:border-primary/30 border-gray-200 shadow-sm">
                      <span className="text-sm font-semibold text-gray-900 dark:text-foreground">
                        Page {page}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-muted-foreground">of</span>
                      <span className="text-sm font-semibold text-primary">
                        {data.pagination.totalPages}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                      disabled={page === data.pagination.totalPages}
                      data-testid="button-blog-next-page"
                      className="w-full sm:w-auto border-2 dark:border-primary/30 border-gray-300 hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 px-6 py-2.5 rounded-lg transition-all"
                    >
                      Next
                    </Button>
                  </motion.div>
                )}
              </>
            ) : (
              /* Empty State with Better Design */
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 sm:py-20 md:py-24"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 dark:bg-primary/20 mb-6">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-foreground mb-3">
                  No Articles Found
                </h3>
                <p className="text-base sm:text-lg text-gray-600 dark:text-muted-foreground mb-6">
                  Try adjusting your search or browse all articles
                </p>
                <Button
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                  }}
                  className="bg-primary-gradient text-white px-6 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Clear Search
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
