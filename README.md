property-mailing-engine
=======================

Node.js based search engine for properties aiming to address the issue of already GONE properties

## Motivation

The property market more often than not lacks supply to satisfy the demand. As a result, it is increasingly harder to find the property to rent/buy in the popular cities.

The difficulty with regular property listing websites and search engines, is that they do not address the problem of undersupply. As a consequence, when one tries to find a property to rent/buy, the person ends up spending the time to in the end get a reply that it was already LET/SOLD.

## Objective

Solution this project brings, is to tell the user of only new properties matching their criteria, preferably as they are being added (using email or another instant-delivery protocol).

Ideally the application will work in the next manner:

* Property is added on one of the listing sites.
* Application find this newly added listing, extracts the information out of the AD
* If it matches the criteria set by the client, then deliver it through the e-mail or another protocol directly to the client.
* Client then can immediately take action and reach the landlord or agency.

This scheme will solve two main pain points for the customer:

1. No time spent filtering out what were the newly added properties by surfing the listing websites each day
2. Guarantee, that user gets the relevant information as soon as possible.

## Development Plan
To achieve our desired goal, let us divide the project into several functionalities and then focus on them one by one.. We need some sort of HTTP front end to list properties, even if we focus on emails, it is essential for development and debugging purposes.

1. Develop a simple web page with listing example
2. Plug in dummy database provider into the listing example
3. Develop the spider of properties listing websites (start with zoopla, as it as friendly API)
4. Make a database provider, uniting the spider with listing example
5. Now work on email functionality and improve spider.

## License
[GPL v3]

[GPL v3]:LICENSE
