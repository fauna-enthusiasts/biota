import { FrameworkRelationDefinition } from '~/../types/framework/framework.collection';
// external
import { Biota } from '~/biota';
// biota
import { collectionNamePlural, BiotaCollectionName } from '~/factory/constructors/collection';
import { insert } from '~/factory/api/fql/base/insert';
import { name } from '~/helpers';
import { execute } from '~/tools/tasks';

export function relation(this: Biota, relationName?: string) {
  const self = this;

  let definition: FrameworkRelationDefinition = {
    name: relationName,
    // Does the relation implies deep destruction/delete
    destructive: false,
    parts: [],
  };

  async function buildRelation() {
    if (!definition.name) definition.name = name(['']);

    let relations = definition.parts.map((p) => p.relation);
    let firstRelation = definition.parts[0];
    let secondRelation = definition.parts[1];

    let tasks = [];

    tasks.push({
      async task() {
        // let existingRelations = await self.collection(BiotaCollectionName("relations")).find({
        //   $and: [
        //     {
        //       "parts.collection": firstRelation.collection,
        //       "parts.relation": firstRelation.relation,
        //       "parts.path": firstRelation.path
        //     },
        //     {
        //       "parts.collection": secondRelation.collection,
        //       "parts.relation": secondRelation.relation,
        //       "parts.path": secondRelation.path
        //     }
        //   ]
        // });

        return self.collection(BiotaCollectionName('relations')).insert({
          data: {
            relations: {},
          },
        });
      },
    });

    // one-to-one
    if (relations.includes('one') && !relations.includes('many')) {
    }
    // many-to-one / one-to-many
    else if (relations.includes('one') && relations.includes('many')) {
    }
    // many-to-many
    else if (relations.includes('many') && !relations.includes('one')) {
    } else {
      throw new Error(`Relation ${name} isn't right`);
    }

    return execute(tasks, {
      domain: 'Biota.relation',
    });
  }

  let firstApi = {
    many: function (collection: string, path: string = '~ref') {
      definition.parts.push({
        relation: 'many',
        collection: collectionNamePlural(collection),
        path,
      });
      return secondApi;
    },
    one: function (collection: string, path: string = '~ref') {
      definition.parts.push({
        relation: 'one',
        collection: collectionNamePlural(collection),
        path,
      });
      return secondApi;
    },
  };

  let secondMethods = {
    many: function (collection: string, path: string = '~ref') {
      definition.parts.push({
        relation: 'many',
        collection: collectionNamePlural(collection),
        path,
      });
      return buildRelation();
    },
    one: function (collection: string, path: string = '~ref') {
      definition.parts.push({
        relation: 'one',
        collection: collectionNamePlural(collection),
        path,
      });
      return buildRelation();
    },
  };

  let secondApi = {
    connects: secondMethods,
    can: {
      have: secondMethods,
    },
  };

  return firstApi;
}
