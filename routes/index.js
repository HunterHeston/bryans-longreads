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
      entry.links.push({ description: link.description, link: link.link });
    }

    view_data.push(entry);
  }

  res.render("index", { view_data: view_data });
});

module.exports = router;
