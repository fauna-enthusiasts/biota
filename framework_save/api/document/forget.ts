import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { document } from '~/factory/api/classes/document';
import { execute } from '~/tasks';

export function forget(this: Biota, collectionName: string, id: FaunaId) {
  const self = this;

  return async function forgetMethod() {
    return execute(
      [
        {
          name: `Forget (${id}) in (${collectionName})`,
          task() {
            return self.query(document.forget.call(self, collectionName, id));
          },
        },
      ],
      {
        domain: 'Biota.document.forget',
      },
    );
  };
}