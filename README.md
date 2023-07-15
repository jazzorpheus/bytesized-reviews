# Bytesized Book Reviews

#### Video Demo: https://youtu.be/M5oRd-m5XVQ

#### Description:

Bytesized Book Reviews is a dynamic and responsive web application that allows users to sign up for an account in order to post their own book reviews, which can then be viewed (by any visitors to the website) and discussed (by registered users only). When adding a new review users are prompted to give a star rating out of 10, a 1-2 sentence title, and a short paragraph. There is also an optional feature to add an image of the book. The short paragraph is capped at 2000 characters in length to ensure reviews are succinct and to-the-point, hence the 'bytesized'. The main page of the website displays a preview of all reviews with the most recently published displayed at the top. This page can be filtered to show only those reviews by a selected review author. Following the 'Read more' link for a review takes users to a page displaying that review in full, together with a section below for comments and discussion. Reviews and comments can be deleted at any time by those who have authored them; reviews can also be appended to/edited, comments cannot (yet).

The primary purpose of the project was to practise using as many of the skills I'd been learning as part of Colt Steele's Web Developer Bootcamp as possible, especially implementing basic CRUD functionality, authentication, and authorisation. Secondly, it was a way for me to document and reflect upon some of my favourite books from recent years. In light of this, I'd say the project has been a success.

However, there are many improvements and additional features that could be added. Some ideas include:

    * Have a confirmation email sent after registration.

    * Add a password reset capability (via user email).

    * Add user profile pages with some stats including number of reviews published, number of comments etc.

    * Add date-times to reviews and comments.

    * Add an edit feature to comments.

    * Implement infinite scrolling on index pages once the total number of displayed reviews exceeds a threshold.

    * Add a genre(s) category to reviews model and allow users to filter by genre.

    * Add a search bar feature to search for reviews matching keywords.

    * Improve overall security measures in addition to the basic protections against XSS and injection attacks.
