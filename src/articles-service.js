const ArticlesService = {
  getAllArticles(knex) {
    return knex.select('*').from('blogful_articles');
  },

  insertArticle(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into('blogful_articles')
      .returning('*')
      .then(rows => rows[0]);
  },

  getById(knex, id) {
    return knex
      .from('blogful_articles')
      .select('*')
      .where('id', id)
      .first();
  },

  deleteArticle(knex, id) {
    return knex('blogful_articles')
      .where({ id })
      .delete();
  },

  updateArticle(knex, id, newData) {
    return knex('blogful_articles')
      .where({ id })
      .update(newData);
  }
};

module.exports = ArticlesService;
