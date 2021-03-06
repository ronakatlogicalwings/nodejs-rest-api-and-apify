const Apify = require('apify');
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');


// Apify.utils contains various utilities, e.g. for logging.
// Here we turn off the logging of unimportant messages.
const {
    log
} = Apify.utils;
log.setLevel(log.LEVELS.WARNING);


// Apify.main() function wraps the crawler logic (it is optional).
Apify.main(async () => {
    // Create an instance of the RequestList class that contains a list of URLs to crawl.
    // Here we download and parse the list of URLs from an external file.
    const requestList = new Apify.RequestList({
        sources: [
            
            {
                url: 'https://sdk.apify.com/docs/examples/basiccrawler'
            }
        ],
    });
    await requestList.initialize();
    console.log('===========================START===============================');
    console.log('Crawler start.');
    console.log('===============================================================');
    // Create an instance of the CheerioCrawler class - a crawler
    // that automatically loads the URLs and parses their HTML using the cheerio library.
    const crawler = new Apify.CheerioCrawler({
        // Let the crawler fetch URLs from our list.
        requestList,

        // The crawler downloads and processes the web pages in parallel, with a concurrency
        // automatically managed based on the available system memory and CPU (see AutoscaledPool class).
        // Here we define some hard limits for the concurrency.
        minConcurrency: 10,
        maxConcurrency: 50,

        // On error, retry each page at most once.
        maxRequestRetries: 1,

        // Increase the timeout for processing of each page.
        handlePageTimeoutSecs: 60,

        // This function will be called for each URL to crawl.
        // It accepts a single parameter, which is an object with the following fields:
        // - request: an instance of the Request class with information such as URL and HTTP method
        // - html: contains raw HTML of the page
        // - $: the cheerio object containing parsed HTML
        handlePageFunction: async ({request, html, $}) => {
            console.log(`Processing ${request.url}...`);

            // Extract data from the page using cheerio.
            const linksName = [];
            $('.navListItem a').each((index, el) => {
                linksName.push({
                    text: $(el).text(),
                });
                console.log($(el).text());
            });
            console.log("****************************");
            console.log(linksName);
            console.log("****************************");
            // linksName.each((index, el)=>{
            //     console.log(index);
            // });

            console.log(linksName);

            $.each(linksName, function (index, value) {
                console.log(index.textext + ": " + value);
            });
            return false;
            
            const h1texts = [];
            $('h1').each((index, el) => {
                h1texts.push({
                    text: $(el).text(),
                });
            });

            // Store the results to the default dataset. In local configuration,
            // the data will be stored as JSON files in ./apify_storage/datasets/default
            await Apify.pushData({
                url: request.url,
                title,
                h1texts,
                html,
            });
        },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async ({
            request
        }) => {
            console.log(`Request ${request.url} failed twice.`);
        },
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();

    console.log('===========================END=================================');
    console.log('Crawler finished.');
    console.log('===============================================================');
});