
var multilanguageValues = 'title_';
const paginate = (schema) => {

  schema.statics.paginate = async function (filter, options, req) {

    const sort = {};
    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort['createdAt'] = 1;
    }
   options.page = Number(options.page) + 1;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;



    var agrigateFilters = [];
    for (let k in filter) {
      console.log(filter[k])
      agrigateFilters.push({ $match: filter[k] })
    }

    var filters = {};
    if (filter.length > 0) {
      filters = { $and: filter };
    }

    const countPromise = this.countDocuments(filters);
    const docsPromise = this.aggregate(agrigateFilters).sort(sort).skip(skip).limit(limit);


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
  schema.statics.contact = async function (filter, options, req) {

    const sort = {};
    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    } else {
      sort['createdAt'] = 1;
    }
   options.page = Number(options.page) + 1;
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;



    var agrigateFilters = [];
    for (let k in filter) {
      console.log(filter[k])
      agrigateFilters.push({ $match: filter[k] })
    }



    agrigateFilters.push({
      '$lookup': {
        from: 'cities',
        let: { city: "$city" },
        as: 'cityObj',
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$city"] } } }
        ],
      }
    })


    agrigateFilters.push({
      $unwind: {
        path: '$cityObj',
        preserveNullAndEmptyArrays: true,
      }
    })


   
    var filters = {};
    if (filter.length > 0) {
      filters = { $and: filter };
    }

    // const countPromise = await this.aggregate([{ $count: "count" }, ...agrigateFilters]);
    const docsPromise = this.aggregate(agrigateFilters).sort(sort).skip(skip).limit(limit);

    return Promise.all([docsPromise]).then((values) => {
      var [results] = values;
      // console.log(totalResults)
      // const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        page,
        limit,
        // totalPages,
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = paginate;
