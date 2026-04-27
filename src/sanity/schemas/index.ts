import trip from './documents/safari'
import destination from './documents/destination'
import blogPost from './documents/blog-post'
import testimonial from './documents/testimonial'
import googleReview from './documents/google-review'
import faqItem from './documents/faq'
import siteSettings from './documents/site-settings'
import homePage from './documents/home-page'
import aboutPage from './documents/about-page'
import contactPage from './documents/contact-page'
import safariListingPage from './documents/safari-listing-page'
import destinationListingPage from './documents/destination-listing-page'
import faqPage from './documents/faq-page'
import blogPage from './documents/blog-page'
import eigenReisschemaPage from './documents/eigen-reisschema-page'
import blogSubmissionPage from './documents/blog-submission-page'
import booking from './documents/booking'
import bookingPage from './documents/booking-page'
import legalPage from './documents/legal-page'
import itineraryDay from './objects/itinerary-day'
import galleryImage from './objects/gallery-image'
import seoFields from './objects/seo-fields'
import { withLanguage } from './with-language'

// Translatable doc types receive a hidden `language` field (consumed by the
// document-internationalization plugin). Non-translatable types (testimonial,
// googleReview, booking) are passed through unchanged.

export const schemaTypes = [
  // Translatable documents
  withLanguage(trip),
  withLanguage(destination),
  withLanguage(blogPost),
  withLanguage(faqItem),
  withLanguage(siteSettings),
  withLanguage(homePage),
  withLanguage(aboutPage),
  withLanguage(contactPage),
  withLanguage(safariListingPage),
  withLanguage(destinationListingPage),
  withLanguage(faqPage),
  withLanguage(blogPage),
  withLanguage(eigenReisschemaPage),
  withLanguage(blogSubmissionPage),
  withLanguage(bookingPage),
  withLanguage(legalPage),
  // Non-translatable documents
  booking,
  testimonial,
  googleReview,
  // Objects
  itineraryDay,
  galleryImage,
  seoFields,
]
