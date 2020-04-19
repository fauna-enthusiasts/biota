import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { query as q } from 'faunadb';
import { Identity } from '~/factory/api/ql';

export const currentUserHistory: FactoryUser<FrameworkUserApi['history']> = function (this: Biota, id) {
  const self = this;

  return async (pagination) => {
    return execute(
      [
        {
          name: `History of current user`,
          task() {
            return self.query(user(self.context)(q.Select('id', Identity(), null)).history(pagination));
          },
        },
      ],
      {
        domain: 'Biota.current.user.history',
      },
    );
  };
};