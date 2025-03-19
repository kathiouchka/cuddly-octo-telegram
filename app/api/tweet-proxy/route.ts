import { NextResponse } from 'next/server';

// Define cache settings
export const revalidate = 604800; // 1 week in seconds

// Simple in-memory cache 
const CACHE = new Map<string, {data: any, timestamp: number}>();
const CACHE_DURATION = 60 * 60 * 24 * 7 * 1000; // 1 week in milliseconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tweetUrl = searchParams.get('url');
  
  if (!tweetUrl) {
    return NextResponse.json({ error: 'Tweet URL is required' }, { status: 400 });
  }
  
  // Check if we have a cached response
  const cacheKey = tweetUrl;
  const cachedResponse = CACHE.get(cacheKey);
  
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
    // Return cached response if it's still valid
    return NextResponse.json(cachedResponse.data, {
      headers: {
        'Cache-Control': 'public, max-age=604800', // 1 week
        'X-Cache': 'HIT'
      }
    });
  }
  
  try {
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(tweetUrl)}&omit_script=true`;
    const response = await fetch(oembedUrl);
    
    if (!response.ok) {
      throw new Error('Twitter API returned an error');
    }
    
    const data = await response.json();
    
    // Store in cache
    CACHE.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=604800', // 1 week
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching tweet:', error);
    return NextResponse.json({ error: 'Failed to fetch tweet' }, { status: 500 });
  }
} 