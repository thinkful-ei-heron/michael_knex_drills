const ShoppingListService = require('../src/shopping-list-service');
const types = require('pg').types;
types.setTypeParser(1700, 'text', parseFloat); //get type 'numeric' back as a number, not a string
const knex = require('knex');

describe(`Shopping list service object`, function() {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'Foo',
      price: 12.34,
      date_added: new Date('2100-05-22T00:00:00Z'),
      category: 'Main'
    },
    {
      id: 2,
      name: 'Bar',
      price: 43.21,
      date_added: new Date('2000-01-01'),
      category: 'Snack'
    },
    {
      id: 3,
      name: 'Bizz',
      price: 12,
      date_added: new Date('2111-11-11'),
      category: 'Snack'
    }
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db('shopping_list').truncate());

  this.afterEach(() => db('shopping_list').truncate());

  after(() => db.destroy());

  context(`Given 'shopping_list' has data`, function() {
    beforeEach(() => {
      return db.into('shopping_list').insert(
        testItems.map(item => {
          const { id, ...rest } = item; //strip 'id' because it results in conflicts with auto IDs
          return rest;
        })
      );
    });

    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql(
          testItems.map(item => ({ ...item, checked: false }))
        );
      });
    });

    it(`insertItem() inserts an item and resolves the item with an 'id'`, () => {
      const newItem = {
        name: 'Bang',
        price: 0.11,
        date_added: new Date('2019-10-27'),
        category: 'Lunch'
      };
      return ShoppingListService.insertItem(db, newItem).then(actual => {
        expect(actual).to.eql({
          id: 4,
          checked: false,
          ...newItem
        });
      });
    });

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const testId = 3;
      const testItem = testItems[testId - 1];
      return ShoppingListService.getItemById(db, testId).then(actual => {
        expect(actual).to.eql({ ...testItem, checked: false });
      });
    });

    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const ItemId = 3;
      return ShoppingListService.deleteItem(db, ItemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          // copy the test Items array without the "deleted" Item
          const expected = testItems
            .filter(Item => Item.id !== ItemId)
            .map(item => ({ ...item, checked: false }));
          expect(allItems).to.eql(expected);
        });
    });

    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: 'Bizz 2.0',
        price: 17,
        date_added: new Date(),
        category: 'Snack'
      };
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getItemById(db, idOfItemToUpdate))
        .then(Item => {
          expect(Item).to.eql({
            id: idOfItemToUpdate,
            checked: false,
            ...newItemData
          });
        });
    });
  });
  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
  });
});
