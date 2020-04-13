import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/classes/document';
import { execute } from '~/tasks';

export function get(this: Biota, collectionName: string) {
  const self = this;

  return async function getMethod(id: FaunaId) {
    return execute(
      [
        {
          name: `Get (${id}) in (${collectionName})`,
          task() {
            return self.query(document.get.call(self, collectionName, id));
          },
        },
      ],
      {
        domain: 'Biota.collection.get',
      },
    );
  };
}