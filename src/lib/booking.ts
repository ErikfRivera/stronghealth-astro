// Single source of truth for the site-wide "book your assessment" CTA.
// Every booking CTA opens the visitor's SMS app pre-filled to text Strong Health.
// The "?&body=" form is used because it reliably pre-fills the message on both
// iOS and Android (matches the working Miami DEXA "Book" buttons).
export const BOOKING_SMS_NUMBER = "+19546635563";
export const BOOKING_SMS_BODY =
  "I would like to book a free assessment with Strong Health";
export const BOOKING_SMS_HREF = `sms:${BOOKING_SMS_NUMBER}?&body=${encodeURIComponent(
  BOOKING_SMS_BODY,
)}`;
