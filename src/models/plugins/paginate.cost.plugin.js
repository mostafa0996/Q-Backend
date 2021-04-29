const { admin } = require("../../config/contant");
const paginate = (schema) => {
  var multilanguageValues = 'title_';

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


    var filters = {}
    if (filter.length > 0) {
      filters = {
        $and: filter,
      };
    }
    var agrigateFilters = [];
    for (let k in filter) {
      agrigateFilters.push({ $match: filter[k] })
    }


    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { from: "$from" },
        as: 'fromObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$from"] } } }, {
            $project: { __v: 0, createdAt: 0 }
          }
        ],
      }
    })

    agrigateFilters.push({ $unwind: '$fromObj' })



    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { to: "$to" },
        as: 'toObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$to"] } } }, {
            $project: { __v: 0, createdAt: 0 }
          }
        ],
      }
    })

    agrigateFilters.push({ $unwind: '$toObj' })



    agrigateFilters.push({
      '$lookup': {
        from: 'categories',
        let: { category: "$category" },
        as: 'categoryObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$category"] } } }, {
            $project: { __v: 0, createdAt: 0 }
          }
        ],
      }
    })

    agrigateFilters.push({ $unwind: '$categoryObj' })



    const countPromise = this.countDocuments(filters);
    const docsPromise = this.aggregate(agrigateFilters).skip(skip).limit(limit);


    return Promise.all([countPromise, docsPromise]).then((values) => {
      var [totalResults, results] = values;
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
  schema.statics.paginateuser = async function (filter, options, req) {

    const sort = {};
    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
   options.page = Number(options.page) + 1;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;


    var filters = {}
    if (filter.length > 0) {
      filters = {
        $and: filter,
      };
    }
    var agrigateFilters = [];
    for (let k in filter) {
      agrigateFilters.push({ $match: filter[k] })
    }



    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { from: "$from" },
        as: 'fromObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$from"] } } },
          {
            $project: {
              title: '$' + multilanguageValues + req.headers['accept-language'] ? '$' + multilanguageValues + req.headers['accept-language'] : '$' + multilanguageValues + 'en', active: 1,
            }
          }
        ],
      }
    })

    agrigateFilters.push({ $unwind: '$fromObj' })



    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { to: "$to" },
        as: 'toObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$to"] } } },
          {
            $project: {
              title: '$' + multilanguageValues + req.headers['accept-language'] ? '$' + multilanguageValues + req.headers['accept-language'] : '$' + multilanguageValues + 'en', active: 1,
            }
          }
        ],
      }
    })

    agrigateFilters.push({ $unwind: '$toObj' })



    agrigateFilters.push({
      '$lookup': {
        from: 'categories',
        let: { category: "$category" },
        as: 'categoryObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$category"] } } },

          {
            $project: {
              title: '$' + multilanguageValues + req.headers['accept-language'] ? '$' + multilanguageValues + req.headers['accept-language'] : '$' + multilanguageValues + 'en', active: 1, icon: 1, weight: 1, price: 1
            }
          }
        ],
      }
    })

    agrigateFilters.push({ $unwind: '$categoryObj' })




    const countPromise = this.countDocuments(filters);
    const docsPromise = this.aggregate(agrigateFilters).skip(skip).limit(limit);


    return Promise.all([countPromise, docsPromise]).then((values) => {
      var [totalResults, results] = values;
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
