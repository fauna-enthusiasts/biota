import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';
import { query as q } from 'faunadb';
import { Identity } from '~/factory/api/ql';

// tslint:disable-next-line: variable-name
export const curentUserDelete: FactoryUser<FrameworkUserApi['delete']> = function (id = null) {
  const self = this;

  return async () => {
    return execute(
      [
        {
          name: `Delete current user`,
          task() {
            return self.query(user(self.context)(q.Select('id', Identity(), null)).delete());
          },
        },
      ],
      {
        domain: 'Biota.current.user.delete',
      },
    );
  };
};
