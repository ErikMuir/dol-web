import { NextRequest, NextResponse } from "next/server";
import { Review } from "@erikmuir/dol-lib/types";
import { getReviewsByShowDate } from "@erikmuir/dol-lib/server/api";
import { StandardPayload, success } from "@/utils";

// /api/reviews/[date]

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ date: string }> }
): Promise<NextResponse<StandardPayload<Review[] | string>>> {
  const artistId = 1; // only phish, for now
  const reviews: Review[] = [];
  try {
    const date = (await params).date;
    if (!date || isNaN(Date.parse(date))) {
      throw new Error(`Invalid date: ${date}`);
    }
    const allReviews = (await getReviewsByShowDate(date)) || [];
    const filteredReviews = allReviews.filter((review) =>
      artistId ? review.artistId === artistId : true
    );
    reviews.push(...filteredReviews);
  } catch (e: any) {
    console.error(e);
  }
  return success(reviews);
}
