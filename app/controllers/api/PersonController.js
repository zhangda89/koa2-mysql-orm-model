import * as objection from 'objection';
import Person from '../../models/Person';
import Movie from '../../models/Movie';

class PersonController {

  async index(ctx, next) {
    const self = this;

    const persons = await Person
      .query()
      .allowEager('[pets, children.[pets, movies], movies]')
      .eager(ctx.request.query.eager)
      .skipUndefined()
      .where('age', '>=', ctx.request.query.minAge)
      .where('age', '<', ctx.request.query.maxAge)
      .where('firstName', 'like', ctx.request.query.firstName);

    ctx.body = persons;
  }

  async create(ctx, next) {
    const self = this;

    try {
      const person = await Person
        .query()
        .insert(ctx.request.body);

      ctx.body = person;
    } catch (err) {
      throw err;
    }
  }

  async detail(ctx, next) {
    const self = this;

    const person = await Person
      .query()
      .findById(ctx.params.id);

    if (!person) {
      ctx.throw(404);
    }

    ctx.body = person;
  }

  async update(ctx, next) {
    const self = this;

    const person = await Person
      .query()
      .patchAndFetchById(ctx.params.id, ctx.request.body);
    ctx.body = person;
  }

  // delete a person
  async delete(ctx, next) {
    const self = this;

    await Person.query().delete().where('id', ctx.params.id);
    ctx.body = {};
  }

  // add children for a person
  async createChildren(ctx, next) {
    const self = this;

    const person = await Person
      .query()
      .findById(ctx.params.id);

    if (!person) {
      ctx.throw(404);
    }

    const children = await person
      .$relatedQuery('children')
      .insert(ctx.request.body);

    ctx.body = children;
  }

  // add pets for person
  async createPets(ctx, next) {
    const self = this;

    const person = await Person
      .query()
      .findById(ctx.params.id);

    if (!person) {
      ctx.throw(404);
    }

    const pets = await person
      .$relatedQuery('pets')
      .insert(ctx.request.body);

    ctx.body = pets;
  }

  // query pets
  async pets(ctx, next) {
    const self = this;

    const person = await Person
      .query()
      .findById(ctx.params.id);

    if (!person) {
      ctx.throw(404);
    }

    const pets = await person
      .$relatedQuery('pets')
      .skipUndefined()
      .where('name', 'like', ctx.request.query.name)
      .where('species', ctx.request.query.species);

    ctx.body = pets;
    return ctx.body;
  }

  // add movie for person
  async createMovies(ctx, next) {
    const self = this;

    const movie = await objection.transaction(Person, async (TrPerson) => {
      const person = await TrPerson
        .query()
        .findById(ctx.params.id);

      if (!person) {
        return this.throw(404);
      }

      const res = await person
        .$relatedQuery('movies')
        .insert(ctx.request.body);
      return res;
    });

    ctx.body = movie;
  }
}

export default PersonController;
