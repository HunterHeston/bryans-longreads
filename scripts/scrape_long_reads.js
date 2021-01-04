const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require("node-fetch");

async function get_html(url) {
  const res = await fetch(url).catch(console.error);
  return await res.text();
}

// get all links off the first pages of episodes
function get_recent_podcast_links(dom, base_url) {
  const links = dom.window.document.querySelectorAll("div > h4 > a");

  const urls = [];
  for (let i = 0; i < links.length; i++) {
    urls.push(base_url + links[i]);
  }

  return urls;
}

// get long reads out of a page that has them in it.
async function get_long_reads(url) {
  const html = await get_html(url);
  const dom = new JSDOM(html);

  const show_notes = dom.window.document.getElementById("show-notes");

  // get the child index of the <ul> containg all
  let long_reads_child_index = -1;
  for (let i = 0; i < show_notes.children.length; i++) {
    const child = show_notes.children[i];

    if (child.tagName === "P" && child.textContent.includes("Longreads")) {
      long_reads_child_index = i + 1;
      break;
    }
  }

  const long_reads_element = show_notes.children[long_reads_child_index];

  const long_reads = [];
  for (const link of long_reads_element.children) {
    long_reads.push({
      text: link.textContent,
      link: link.children[0].href,
    });
  }

  return long_reads;
}

// check if the page has long reads on it
async function page_has_long_reads(url) {
  const html = await get_html(url);
  const dom = new JSDOM(html);

  const show_notes = dom.window.document.getElementById("show-notes");

  for (const child of show_notes.children) {
    if (child.tagName === "P" && child.textContent.includes("Longreads")) {
      return true;
    }
  }

  return false;
}

// get the date at the top of a given page
async function get_date_of_podcast(url) {
  const html = await get_html(url);
  const dom = new JSDOM(html);

  const result = dom.window.document.querySelectorAll("div.mb-4 > div");

  let date = result[0].textContent;

  // remove newline char and all space chars
  date = date.slice(3).trim();

  return date;
}

async function scrape_long_reads() {
  const base_url = "https://www.ridehome.info";
  const ridehome_url = "/show/techmeme-ride-home/episodes/";

  // get html of the first episodes page
  const html = await get_html(base_url + ridehome_url);
  const dom = new JSDOM(html);

  // get html for each podcast page
  const podcast_urls = get_recent_podcast_links(dom, base_url);

  // loop over all recent shows and save the first one with long reads
  let long_read_url = null;
  for (const url of podcast_urls) {
    const has_long_reads = await page_has_long_reads(url);

    if (has_long_reads) {
      long_read_url = url;
      break;
    }
  }

  // non of the fetched pages had a long read section
  if (!long_read_url) {
    console.error("no long read page found");
    return;
  }

  const long_reads = await get_long_reads(long_read_url);
  const date = await get_date_of_podcast(long_read_url);

  console.log(date, long_reads);
}

// run the script
scrape_long_reads();
