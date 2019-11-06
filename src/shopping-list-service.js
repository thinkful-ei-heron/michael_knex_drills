const ShoppingListService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list');
  },

  getItemById(knex, id) {
    return knex
      .from('shopping_list')
      .select('*')
      .where('id', id)
      .first();
  },

  searchItems(knex, searchTerm) {
    return knex
      .from('shopping_list')
      .select('*')
      .where('name', 'ILIKE', `%${searchTerm}%`)
      .then(res => console.log(res));
  },

  insertItem(knex, newItem) {
    return knex
      .insert(newItem)
      .into('shopping_list')
      .returning('*')
      .then(rows => rows[0]);
  },

  updateItem(knex, id, newData) {
    return knex('shopping_list')
      .where({ id })
      .update(newData);
  },

  deleteItem(knex, id) {
    return knex('shopping_list')
      .where({ id })
      .delete();
  }
};

module.exports = ShoppingListService;
