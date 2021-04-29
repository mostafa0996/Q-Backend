const { admin, company, master } = require("../../config/contant");

const paginate = (schema) => {

  schema.statics.paginate = async function (filter, options, req) {

    const sort = {};
    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    options.page = Number(options.page) + 1;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;


    var filters = {};
    if (filter.length > 0) {
      filters = { $and: filter };
    }

    const countPromise = this.countDocuments(filters);
    const docsPromise = this.find(filters).skip(skip).limit(limit);


    return Promise.all([countPromise, docsPromise]).then((values) => {
      var [totalResults, results] = values;
      if (!req.user || (req.user.role !== admin && req.user.role !== company && req.user.role !== master))
        results = schema.methods.toObjectLocalizedOnly(results, req.headers['accept-language'] ? req.headers['accept-language'] : 'en', 'en');
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
