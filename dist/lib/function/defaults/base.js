"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const function_1 = require("./../methods/function");
const action_1 = require("../methods/action");
const methods_1 = require("./../../index/methods");
const merge = (activity, data = faunadb_1.query.Var('data')) => faunadb_1.query.Merge(data, { activity: faunadb_1.query.Merge(faunadb_1.query.Select('activity', data, {}), activity) });
const logData = {
    own: () => merge({ owner: faunadb_1.query.Var('ref'), owner_changed_at: faunadb_1.query.Now(), owner_changed_by: faunadb_1.query.Identity() }),
    credentials: () => merge({ credentials_changed_by: faunadb_1.query.Var('ref'), credentials_changed_at: faunadb_1.query.Now() }, {}),
    assign: () => merge({ assignees: faunadb_1.query.Var('ref'), assigned_at: faunadb_1.query.Now() }),
    import: () => merge({ imported_by: faunadb_1.query.Identity(), imported_at: faunadb_1.query.Now() }),
    create: () => merge({ created_by: faunadb_1.query.Identity(), created_at: faunadb_1.query.Now() }),
    update: () => merge({ updated_by: faunadb_1.query.Identity(), updated_at: faunadb_1.query.Now() }),
    replace: () => merge({ replaced_by: faunadb_1.query.Identity(), replaced_at: faunadb_1.query.Now() }),
    expire: () => merge({ expired_by: faunadb_1.query.Identity(), expired_at: faunadb_1.query.Var('at') }),
    delete: () => merge({ deleted_by: faunadb_1.query.Identity(), deleted_at: faunadb_1.query.Now() }),
    archive: () => merge({ archived_by: faunadb_1.query.Identity(), archived_at: faunadb_1.query.Now() })
};
/**
 * - owner only
 * - assigned only
 * - any
 */
exports.FindIndex = function_1.UDFunction({
    name: 'FindIndex',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['resource', 'terms_fields'], faunadb_1.query.Let({
        indexes: faunadb_1.query.Paginate(faunadb_1.query.Intersection(faunadb_1.query.Match(faunadb_1.query.Index(methods_1.IndexName('indexes__by__resource')), [faunadb_1.query.Var('resource')]), faunadb_1.query.Union(faunadb_1.query.Map(faunadb_1.query.Var('terms_fields'), faunadb_1.query.Lambda(['field'], faunadb_1.query.Match(faunadb_1.query.Index(methods_1.IndexName('indexes__by__terms')), [faunadb_1.query.Var('field')])))))),
        termsCount: faunadb_1.query.Count(faunadb_1.query.Var('terms_fields'))
    }, faunadb_1.query.Select(0, faunadb_1.query.Filter(faunadb_1.query.Var('indexes'), faunadb_1.query.Lambda(['index'], faunadb_1.query.Equals(faunadb_1.query.Var('termsCount'), faunadb_1.query.Count(faunadb_1.query.Select('terms', faunadb_1.query.Get(faunadb_1.query.Var('index')), Infinity))))))))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.Match = function_1.UDFunction({
    name: 'Match',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'collectionRef', 'terms'], faunadb_1.query.Match(faunadb_1.query.Var('refIndex'), faunadb_1.query.Var('terms'))))
});
exports.Own = function_1.UDFunction({
    name: 'Own',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'data'], action_1.WrapActionToLog('own', faunadb_1.query.Update(faunadb_1.query.Var('ref'), { data: logData.own() })))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.ChangePassword = function_1.UDFunction({
    name: 'ChangePassword',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'password'], action_1.WrapActionToLog('credentials', faunadb_1.query.Update(faunadb_1.query.Var('ref'), {
        data: logData.credentials(),
        credentials: {
            password: faunadb_1.query.Var('password')
        }
    })))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.Assign = function_1.UDFunction({
    name: 'Assign',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'data'], action_1.WrapActionToLog('assign', faunadb_1.query.Update(faunadb_1.query.Var('ref'), { data: logData.assign() })))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.Import = function_1.UDFunction({
    name: 'Import',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'data'], action_1.WrapActionToLog('import', faunadb_1.query.Update(faunadb_1.query.Var('ref'), { data: logData.import() })))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.Create = function_1.UDFunction({
    name: 'Create',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'data'], action_1.WrapActionToLog('create', faunadb_1.query.Update(faunadb_1.query.Var('ref'), { data: logData.create() })))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.Update = function_1.UDFunction({
    name: 'Update',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'data'], action_1.WrapActionToLog('update', faunadb_1.query.Update(faunadb_1.query.Var('ref'), { data: logData.update() })))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.Replace = function_1.UDFunction({
    name: 'Replace',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'data'], action_1.WrapActionToLog('replace', faunadb_1.query.Do(faunadb_1.query.Replace(faunadb_1.query.Var('ref'), { data: faunadb_1.query.Var('data') }), faunadb_1.query.Update(faunadb_1.query.Var('ref'), { data: logData.replace() }))))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.Expire = function_1.UDFunction({
    name: 'Expire',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'at'], action_1.WrapActionToLog('expire', faunadb_1.query.Update(faunadb_1.query.Var('ref'), { data: logData.expire() })))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.Delete = function_1.UDFunction({
    name: 'Delete',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'at'], action_1.WrapActionToLog('delete', faunadb_1.query.Update(faunadb_1.query.Var('ref'), { data: logData.delete() })))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.Forget = function_1.UDFunction({
    name: 'Forget',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'at'], action_1.WrapActionToLog('forget', faunadb_1.query.Delete(faunadb_1.query.Var('ref'))))),
    role: faunadb_1.query.Role('AdminForUser')
});
exports.Archive = function_1.UDFunction({
    name: 'Archive',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['user', 'ref', 'at'], action_1.WrapActionToLog('archive', faunadb_1.query.Update(faunadb_1.query.Var('ref'), { data: logData.archive() })))),
    role: faunadb_1.query.Role('AdminForUser')
});
//# sourceMappingURL=base.js.map