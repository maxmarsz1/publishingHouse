import React from 'react'

import { Review, ReviewStatusDisplay } from '@/app/types/types'


const ArticleReviews = ({ reviews }: { reviews: Review[] }) => {
  return (
    <div>
      <h2 style={{marginTop: "2rem"}}>Recenzje artykułu</h2>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            {review.reviewer && (
              `${review.reviewer.first_name} ${review.reviewer.last_name} - `
            )}
            Status recenzji: {ReviewStatusDisplay[review.status]}, Ocena: {review.grade ? review.grade : "brak"}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ArticleReviews