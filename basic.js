const Apify = require('apify');
const requestPromise = require('request-promise');

// Apify.main() function wraps the crawler logic (it is optional).
Apify.main(async () => {
    // Create and initialize an instance of the RequestList class that contains
    // a list of URLs to crawl. Here we use just a few hard-coded URLs.
    const requestList = new Apify.RequestList({
        sources: [
            { url: 'https://www.iana.org/' }
        ],
    });
    await requestList.initialize();

    // Create a BasicCrawler - the simplest crawler that enables
    // users to implement the crawling logic themselves.
    const crawler = new Apify.BasicCrawler({

        // Let the crawler fetch URLs from our list.
        requestList,

        // This function will be called for each URL to crawl.
        // The 'request' option is an instance of the Request class, which contains
        // information such as URL and HTTP method, as supplied by the RequestList.
        handleRequestFunction: async ({ request, $ }) => {
            console.log(`Processing ${request.url}...`);
            // console.log($('title').text());
            
            // Fetch the page HTML
            const html = await requestPromise(request.url);
            // console.log(html.('title').text);
            
            // Store the HTML and URL to the default dataset.
            // await Apify.pushData({
            //     url: request.url,
            //     html,
            // });
        },
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();

    console.log('Crawler finished.');
});