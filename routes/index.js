var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/* GET home page. */
router.get("/", async (req, res, next) => {
  // query the database
  const long_reads = await prisma.longreadList.findMany({
    include: {
      links: true,
    },
  });

  // create an object to pass to our view
  const view_data = [];

  for (const read of long_reads) {
    const entry = {
      date: read.date,
      links: [],
    };

    for (const link of read.links) {
      // const link_short_name = [...link.link];

      let link_short_name = link.link;

      link_short_name = link_short_name.slice(link_short_name.indexOf(".") + 1);
      link_short_name = link_short_name.slice(0, link_short_name.indexOf("/"));

      // // get rid of everything before the .
      // while (link_short_name[0] !== ".") {
      //   link_short_name.shift();
      // }

      // // get rid of the .
      // link_short_name.shift();

      // let i = 0;
      // while (link_short_name[i] !== "/" && i < link_short_name.length) {
      //   i++;
      // }

      // // remove everything after
      // link_short_name.splice(i);

      entry.links.push({
        description: link.description,
        link: link.link,
        link_short_name: link_short_name,
      });
    }

    view_data.push(entry);
  }

  res.render("index", { view_data: view_data });
});

module.exports = router;
