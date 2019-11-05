require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL
});

function searchItems(searchTerm) {
  knexInstance
    .from('shopping_list')
    .select('*')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(res => console.log(res));
}

function getPage(pageNumber) {
  const ITEMS_PER_PAGE = 6;
  const offset = ITEMS_PER_PAGE * (pageNumber - 1);
  knexInstance
    .from('shopping_list')
    .select('*')
    .limit(ITEMS_PER_PAGE)
    .offset(offset)
    .then(res => console.log(res));
}

function getRecentItems(daysAgo) {
  console.log('foo');
  knexInstance
    .from('shopping_list')
    .select('*')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(res => console.log(res));
}

function getTotalCosts() {
  knexInstance
    .from('shopping_list')
    .groupBy('category')
    .select('category')
    .sum('price')
    .then(res => console.log(res));
}

// searchItems('tuna');

// getPage(2);

// getRecentItems(2);

getTotalCosts();
