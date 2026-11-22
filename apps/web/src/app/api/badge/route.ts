import { NextRequest, NextResponse } from 'next/server';
import { generateScoreBadgeSvg } from '@chaff/core';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scoreParam = searchParams.get('score');
  
  let score = 98; // Default demo score
  if (scoreParam) {
    const parsed = parseInt(scoreParam, 10);
    if (!isNaN(parsed)) {
      score = parsed;
    }
  }

  const svg = generateScoreBadgeSvg(score);

  return new NextResponse(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
    },
  });
}
