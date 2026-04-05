// Booking lifecycle hooks encapsulate mutation shapes for status transitions.

const appendTimelineEntry = (booking, entry) => {
  const timeline = Array.isArray(booking?.statusTimeline) ? booking.statusTimeline : []
  return [...timeline, entry]
}

export const buildCancelledBookingPatch = ({ booking, reason, attemptedAt = new Date().toISOString() }) => {
  return {
    ...booking,
    bookingStatus: 'Cancelled',
    paymentStatus: booking.paymentStatus || 'Cancelled',
    cancellation: {
      attemptedAt,
      allowed: true,
      reason
    },
    statusTimeline: appendTimelineEntry(booking, {
      type: 'BOOKING_CANCELLED',
      status: 'Cancelled',
      at: attemptedAt,
      note: reason
    })
  }
}

export const buildFeedbackLinkedBookingPatch = ({ booking, feedbackId, at = new Date().toISOString() }) => {
  return {
    ...booking,
    feedbackSubmitted: true,
    feedbackId,
    statusTimeline: appendTimelineEntry(booking, {
      type: 'FEEDBACK_SUBMITTED',
      status: booking.bookingStatus || 'Completed',
      at,
      note: `Feedback linked: ${feedbackId}`
    })
  }
}