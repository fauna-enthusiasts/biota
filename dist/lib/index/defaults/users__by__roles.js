"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fauna = require("faunadb");
const q = fauna.query;
const index_1 = require("../methods/index");
exports.users__by__roles = index_1.Index({
    name: 'users__by__roles',
    source: {
        collection: q.Indexes(),
        fields: {
            terms: q.Query(q.Lambda('index', q.Map(q.Select('terms', q.Var('index'), []), q.Lambda('term', q.If(q.Contains('binding', q.Var('term')), q.Concat(['binding:', q.Select('binding', q.Var('term'), '')], ''), q.Concat(['term:', q.Concat(q.Select('field', q.Var('term'), []), '.')], ''))))))
        }
    },
    terms: [
        {
            binding: 'terms'
        }
    ],
    values: [
        {
            field: ['ref']
        }
    ]
});
//# sourceMappingURL=users__by__roles.js.map