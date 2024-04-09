const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');

class ProductService {

  constructor() {
    this.products = [];
    this.generate();
  }

  generate() {
    const limit = 100;
    for (let i = 0; i < limit; i++) {
      this.products.push({
        id: i + 1,
        name: faker.commerce.product(),
        price: parseInt(faker.commerce.price(), 10),
        image: faker.image.url(),
        isBlock: faker.datatype.boolean()
      });
    }
  }

  async create(product) {
    const { name, price, image } = product;
    const productAdd = {
      id: this.products.length + 1,
      name,
      price,
      image
    };
    this.products.push(productAdd);
    return productAdd;
  }

  async find() {
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(this.products);
    //   }, 5000);
    // });
    return this.products;
  }

  async findOne(id) {
    const product = this.products.find((product) => product.id === parseInt(id, 10));

    if (!product) {
      throw boom.notFound('Product not found');
    }

    if (product.isBlock) {
      throw boom.conflict('Product is block');
    }

    return product;
  }

  async update(id, changes) {
    const index = this.products.findIndex((product) => product.id === parseInt(id, 10));

    if (index === -1) {
      throw boom.notFound('Product not found');
    }

    this.products[index] = {
      id: parseInt(id, 10),
      ...changes
    };
    return this.products[index];
  }

  async delete(id) {
    const productExist = this.findOne(id);

    if (productExist.length == 0) {
      throw boom.notFound('Product not found');
    }

    const index = this.products.findIndex((product) => product.id === parseInt(id, 10));
    this.products.splice(index, 1);
    return { id: parseInt(id, 10) };
  }
}

module.exports = { ProductService };
